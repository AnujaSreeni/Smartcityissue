const express = require("express");
const Complaint = require("../models/Complaint");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE COMPLAINT (Citizen only)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (req.user.role !== "citizen") {
        return res.status(403).json({
          message: "Only citizens can report issues",
        });
      }

      if (!req.file || !req.body.description || !req.body.location) {
        return res.status(400).json({
          message: "Image, description and location are required",
        });
      }

      const { description, location } = req.body;

const complaint = new Complaint({
  userId: req.user.id,
  imageUrl: `/uploads/${req.file.filename}`,
  description,
  location: {
    address: location,   // ✅ THIS FIXES IT
  },
});


      await complaint.save();

      res.status(201).json({
        message: "Complaint submitted successfully",
        complaint,
      });
    } catch (error) {
      console.error("Create complaint error:", error);
      res.status(500).json({
        message: "Failed to submit complaint",
      });
    }
  }
);

// GET complaints of logged-in citizen
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id   // or req.user._id depending on authMiddleware
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error("Fetch my complaints error:", err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// GET ALL COMPLAINTS (Admin only)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;

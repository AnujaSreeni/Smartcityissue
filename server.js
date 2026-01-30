require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 4000;

/* MIDDLEWARE */
app.use(cors());
app.use(express.json()); // 🔥 MUST be before routes

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user
  });
});

/* DB + SERVER */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
  });

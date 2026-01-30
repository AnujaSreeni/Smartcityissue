const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    issueType: {
      type: String,
      enum: ["pothole", "garbage", "streetlight"],
    },

    department: {
      type: String,
    },

    location: {
      address: {
        type: String,
        required: true,
      },
      mapUrl: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["citizen", "admin", "department"],
      required: true
    },

    // Only for department users
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

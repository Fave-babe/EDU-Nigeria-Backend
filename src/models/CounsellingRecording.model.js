const mongoose = require("mongoose");

const counsellingRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },

    counsellor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "Counsellor is required"],
    },

    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },

    date: {
      type: Date,
      required: [true, "Counselling date is required"],
      default: Date.now,
    },

    reason: {
      type: String,
      required: [true, "Counselling reason is required"],
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "resolved", "follow_up"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CounsellingRecord",
  counsellingRecordSchema
);
const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
    },

    schoolType: {
      type: String,
      required: [true, "School type is required"],
      enum: ["Primary", "Secondary", "Primary & Secondary"],
    },

    email: {
      type: String,
      required: [true, "School email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "School phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "School address is required"],
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      default: "Nigeria",
      trim: true,
    },

    logo: {
      type: String,
      default: null,
    },

    // School application status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Only approved schools should be active
    isActive: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

schoolSchema.index({ name: 1 });
schoolSchema.index({ email: 1 });
schoolSchema.index({ schoolType: 1 });
schoolSchema.index({ status: 1 });
schoolSchema.index({ isActive: 1 });

module.exports = mongoose.model("School", schoolSchema);
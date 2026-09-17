const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Recipient is required"],
    },

    recipientModel: {
      type: String,
      enum: [
        "Admin",
        "Teacher",
        "Staff",
        "Bursar",
        "Counsellor",
        "Parent",
        "Student",
      ],
      required: [true, "Recipient model is required"],
    },

    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "general",
        "academic",
        "attendance",
        "finance",
        "result",
        "announcement",
        "system",
      ],
      default: "general",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  school: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },

    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Announcement message is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "general",
        "academic",
        "event",
        "meeting",
        "finance",
        "emergency",
      ],
      default: "general",
    },

    audience: {
      type: String,
      enum: [
        "all",
        "students",
        "parents",
        "teachers",
        "staff",
        "bursars",
        "counsellors",
      ],
      default: "all",
    },

    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },

    published: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Creator is required"],
    },

    createdByModel: {
      type: String,
      enum: [
        "Admin",
        "Teacher",
        "Staff",
        "Bursar",
        "Counsellor",
      ],
      required: [true, "Creator model is required"],
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({
  school: 1,
  published: 1,
  createdAt: -1,
});

announcementSchema.index({
  audience: 1,
  published: 1,
});

announcementSchema.index({
  expiresAt: 1,
});

module.exports = mongoose.model(
  "Announcement",
  announcementSchema
);
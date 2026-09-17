const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },

    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
      uppercase: true,
    },

    category: {
      type: String,
      enum: [
        "Core",
        "Science",
        "Arts",
        "Commercial",
        "Vocational",
        "Other",
      ],
      default: "Core",
    },

    description: {
      type: String,
      trim: true,
    },

    isCompulsory: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index({
  school: 1,
  name: 1,
});

subjectSchema.index({
  school: 1,
  code: 1,
});

module.exports =
  mongoose.models.Subject ||
  mongoose.model("Subject", subjectSchema);
const mongoose = require("mongoose");

const academicSessionSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },

    name: {
      type: String,
      required: [true, "Academic session name is required"],
      trim: true,
      // Example: "2026/2027"
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    isCurrent: {
      type: Boolean,
      default: false,
    },

    terms: [
      {
        name: {
          type: String,
          enum: [
            "First Term",
            "Second Term",
            "Third Term",
          ],
          required: true,
        },

        startDate: Date,
        endDate: Date,

        isCurrent: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

academicSessionSchema.index({
  school: 1,
  name: 1,
});

academicSessionSchema.index({
  school: 1,
  isCurrent: 1,
});

module.exports =
  mongoose.models.AcademicSession ||
  mongoose.model("AcademicSession", academicSessionSchema);
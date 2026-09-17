const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },

    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: [true, "Academic session is required"],
    },

    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },

    level: {
      type: String,
      required: [true, "Class level is required"],
      trim: true,
    },

    arm: {
      type: String,
      trim: true,
      default: "A",
    },

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    capacity: {
      type: Number,
      default: 40,
      min: [1, "Class capacity must be at least 1"],
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

classSchema.index({
  school: 1,
  academicSession: 1,
});

classSchema.index({
  school: 1,
  name: 1,
});

classSchema.index({
  classTeacher: 1,
});

module.exports = mongoose.model("Class", classSchema);
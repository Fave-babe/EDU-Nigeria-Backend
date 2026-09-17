const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },

    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: [true, "Academic session is required"],
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },

    enrollmentDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: [
        "active",
        "completed",
        "transferred",
        "withdrawn",
      ],
      default: "active",
    },

    enrollmentNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// A student should not be enrolled twice
// in the same class during the same session.
enrollmentSchema.index(
  {
    student: 1,
    academicSession: 1,
  },
  {
    unique: true,
  }
);

enrollmentSchema.index({
  school: 1,
  academicSession: 1,
  class: 1,
});

enrollmentSchema.index({
  student: 1,
});

enrollmentSchema.index({
  status: 1,
});

module.exports =
  mongoose.models.Enrollment ||
  mongoose.model("Enrollment", enrollmentSchema);
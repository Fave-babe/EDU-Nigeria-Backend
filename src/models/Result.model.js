const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
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

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required"],
    },

    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: [true, "Academic session is required"],
    },

    term: {
      type: String,
      enum: ["First Term", "Second Term", "Third Term"],
      required: [true, "Term is required"],
    },

    caScore: {
      type: Number,
      min: 0,
      max: 40,
      default: 0,
    },

    examScore: {
      type: Number,
      min: 0,
      max: 60,
      default: 0,
    },

    totalScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    grade: {
      type: String,
      trim: true,
    },

    remark: {
      type: String,
      trim: true,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "approved",
        "published",
      ],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// One result per student, subject, session and term
resultSchema.index(
  {
    student: 1,
    subject: 1,
    academicSession: 1,
    term: 1,
  },
  {
    unique: true,
  }
);

resultSchema.index({
  school: 1,
  class: 1,
  academicSession: 1,
  term: 1,
});

resultSchema.index({
  student: 1,
  academicSession: 1,
});

resultSchema.index({
  status: 1,
});

module.exports = mongoose.model("Result", resultSchema);
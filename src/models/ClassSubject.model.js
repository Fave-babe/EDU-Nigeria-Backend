const mongoose = require("mongoose");

const classSubjectSchema = new mongoose.Schema(
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

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"],
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

classSubjectSchema.index({
  school: 1,
  academicSession: 1,
  class: 1,
});

classSubjectSchema.index({
  class: 1,
  subject: 1,
  academicSession: 1,
});

classSubjectSchema.index({
  teacher: 1,
  academicSession: 1,
});

module.exports =
  mongoose.models.ClassSubject ||
  mongoose.model("ClassSubject", classSubjectSchema);
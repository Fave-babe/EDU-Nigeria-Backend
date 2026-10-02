const mongoose = require("mongoose");

const lessonNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson note title is required"],
      trim: true,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },

    content: {
      type: String,
      required: [true, "Lesson note content is required"],
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"],
    },

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

    term: {
      type: String,
      enum: ["First Term", "Second Term", "Third Term"],
      required: [true, "Term is required"],
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

lessonNoteSchema.index({
  school: 1,
  class: 1,
  academicSession: 1,
});

lessonNoteSchema.index({
  teacher: 1,
});

lessonNoteSchema.index({
  subject: 1,
});

module.exports = mongoose.model("LessonNote", lessonNoteSchema);
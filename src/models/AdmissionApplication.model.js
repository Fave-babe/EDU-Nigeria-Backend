
const mongoose = require("mongoose");

const admissionApplicationSchema = new mongoose.Schema(
  {
    // ================================
    // APPLICANT INFORMATION
    // ================================

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: [true, "Gender is required"],
    },

    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    // Password entered during admission registration.
    // It will be transferred to Student when Admin approves.
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    previousSchool: {
      type: String,
      trim: true,
    },

    // ================================
    // SCHOOL
    // ================================

    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },

    // Class the applicant wants to enter
    applyingForClass: {
      type: String,
      required: [true, "Class is required"],
      trim: true,
    },

    // ================================
    // APPLICATION STATUS
    // ================================

    applicationStatus: {
      type: String,
      enum: [
        "pending",
        "exam_pending",
        "exam_completed",
        "under_review",
        "approved",
        "rejected",
        "enrolled",
      ],
      default: "pending",
    },

    // ================================
    // ENTRANCE EXAM
    // ================================

    examStatus: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },

    examScore: {
      type: Number,
      default: null,
      min: 0,
    },

    examTotal: {
      type: Number,
      default: null,
      min: 0,
    },

    examPercentage: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    examPassed: {
      type: Boolean,
      default: false,
    },

    examDate: {
      type: Date,
      default: null,
    },

    // Store the applicant's answers
    examAnswers: [
      {
        questionId: {
          type: String,
        },

        answer: {
          type: String,
        },
      },
    ],

    // ================================
    // ADMIN REVIEW
    // ================================

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },

    adminNote: {
      type: String,
      trim: true,
      default: null,
    },

    // ================================
    // CREATED STUDENT
    // ================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ================================
// USEFUL INDEXES
// ================================

admissionApplicationSchema.index({ school: 1 });
admissionApplicationSchema.index({ applicationStatus: 1 });
admissionApplicationSchema.index({ examStatus: 1 });
admissionApplicationSchema.index({ email: 1 });
admissionApplicationSchema.index({
  school: 1,
  applicationStatus: 1,
});

module.exports = mongoose.model(
  "AdmissionApplication",
  admissionApplicationSchema
);

const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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

    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: [true, "Academic session is required"],
    },

    date: {
      type: Date,
      required: [true, "Attendance date is required"],
    },

    status: {
      type: String,
      enum: [
        "present",
        "absent",
        "late",
        "excused",
      ],
      default: "present",
    },

    remark: {
      type: String,
      trim: true,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  {
    timestamps: true,
  }
);

// A student should have only one attendance
// record per day.
attendanceSchema.index(
  {
    student: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

attendanceSchema.index({
  school: 1,
  class: 1,
  date: 1,
});

attendanceSchema.index({
  academicSession: 1,
  date: 1,
});

attendanceSchema.index({
  status: 1,
});

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);
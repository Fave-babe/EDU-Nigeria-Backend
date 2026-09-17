const Attendance = require("../models/Attendance.model");
const School = require("../models/School.model");
const Student = require("../models/Student.model");
const Class = require("../models/Class.model");
const AcademicSession = require("../models/AcademicSession.model");
const Teacher = require("../models/Teacher.model");
const AppError = require("../utils/AppError");

class AttendanceService {
  // Record attendance
  async recordAttendance(data) {
    const {
      school,
      student,
      class: classId,
      academicSession,
      date,
      status,
      remark,
      recordedBy,
    } = data;

    // Check school
    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    // Check student
    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      throw new AppError("Student not found", 404);
    }

    // Check class
    const existingClass = await Class.findOne({
      _id: classId,
      school,
      academicSession,
    });

    if (!existingClass) {
      throw new AppError("Class not found for this academic session", 404);
    }

    // Check academic session
    const session = await AcademicSession.findOne({
      _id: academicSession,
      school,
    });

    if (!session) {
      throw new AppError("Academic session not found for this school", 404);
    }

    // Check teacher if supplied
    if (recordedBy) {
      const teacher = await Teacher.findById(recordedBy);

      if (!teacher) {
        throw new AppError("Teacher not found", 404);
      }
    }

    // Prevent duplicate attendance
    const existingAttendance = await Attendance.findOne({
      student,
      date,
    });

    if (existingAttendance) {
      throw new AppError(
        "Attendance has already been recorded for this student on this date",
        409,
      );
    }

    const attendance = await Attendance.create({
      school,
      student,
      class: classId,
      academicSession,
      date,
      status,
      remark,
      recordedBy,
    });

    return attendance;
  }

  // Get attendance by ID
  async findById(attendanceId) {
    const attendance = await Attendance.findById(attendanceId)
      .populate("school", "name")
      .populate("student", "firstName lastName email registrationNumber")
      .populate("class", "name level arm")
      .populate("academicSession", "name startDate endDate")
      .populate("recordedBy", "firstName lastName email");

    if (!attendance) {
      throw new AppError("Attendance record not found", 404);
    }

    return attendance;
  }

  // Get student's attendance
  async findByStudent(studentId, filters = {}) {
    const student = await Student.findById(studentId);

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    const filter = {
      student: studentId,
    };

    if (filters.academicSession) {
      filter.academicSession = filters.academicSession;
    }

    if (filters.status) {
      filter.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      filter.date = {};

      if (filters.startDate) {
        filter.date.$gte = new Date(filters.startDate);
      }

      if (filters.endDate) {
        filter.date.$lte = new Date(filters.endDate);
      }
    }

    return Attendance.find(filter)
      .populate("class", "name level arm")
      .populate("academicSession", "name startDate endDate")
      .sort({ date: -1 });
  }

  // Get class attendance for a particular date
  async findByClass(classId, date, academicSession) {
    const schoolClass = await Class.findById(classId);

    if (!schoolClass) {
      throw new AppError("Class not found", 404);
    }

    const filter = {
      class: classId,
    };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    if (academicSession) {
      filter.academicSession = academicSession;
    }

    return Attendance.find(filter)
      .populate("student", "firstName lastName registrationNumber gender")
      .populate("recordedBy", "firstName lastName")
      .sort({ date: -1 });
  }

  // Update attendance
  async updateAttendance(attendanceId, data) {
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      throw new AppError("Attendance record not found", 404);
    }

    const allowedFields = ["status", "remark"];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    return updatedAttendance;
  }

  // Attendance statistics for a student
  async getStudentStats(studentId, academicSession) {
    const student = await Student.findById(studentId);

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    const filter = {
      student: studentId,
    };

    if (academicSession) {
      filter.academicSession = academicSession;
    }

    const [total, present, absent, late, excused] = await Promise.all([
      Attendance.countDocuments(filter),

      Attendance.countDocuments({
        ...filter,
        status: "present",
      }),

      Attendance.countDocuments({
        ...filter,
        status: "absent",
      }),

      Attendance.countDocuments({
        ...filter,
        status: "late",
      }),

      Attendance.countDocuments({
        ...filter,
        status: "excused",
      }),
    ]);

    const attendanceRate =
      total > 0 ? Number((((present + late) / total) * 100).toFixed(2)) : 0;

    return {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate,
    };
  }

  // Delete attendance record
  async deleteAttendance(attendanceId) {
    const attendance = await Attendance.findByIdAndDelete(attendanceId);

    if (!attendance) {
      throw new AppError("Attendance record not found", 404);
    }

    return attendance;
  }
}

module.exports = new AttendanceService();

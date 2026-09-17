const attendanceService = require("../services/attendance.service");
const api = require("../utils/apiResponse");

// Record attendance
exports.recordAttendance = async (req, res, next) => {
  try {
    const attendance =
      await attendanceService.recordAttendance({
        ...req.body,
        recordedBy: req.user._id,
      });

    api.created(
      res,
      { attendance },
      "Attendance recorded successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get attendance by ID
exports.getAttendance = async (req, res, next) => {
  try {
    const attendance =
      await attendanceService.findById(req.params.id);

    api.success(
      res,
      { attendance },
      "Attendance retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get student's attendance
exports.getStudentAttendance = async (req, res, next) => {
  try {
    const {
      academicSession,
      status,
      startDate,
      endDate,
    } = req.query;

    const attendance =
      await attendanceService.findByStudent(
        req.params.studentId,
        {
          academicSession,
          status,
          startDate,
          endDate,
        }
      );

    api.success(
      res,
      { attendance },
      "Student attendance retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get class attendance
exports.getClassAttendance = async (req, res, next) => {
  try {
    const attendance =
      await attendanceService.findByClass(
        req.params.classId,
        req.query.date,
        req.query.academicSession
      );

    api.success(
      res,
      { attendance },
      "Class attendance retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update attendance
exports.updateAttendance = async (req, res, next) => {
  try {
    const attendance =
      await attendanceService.updateAttendance(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { attendance },
      "Attendance updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get student attendance statistics
exports.getStudentStats = async (req, res, next) => {
  try {
    const stats =
      await attendanceService.getStudentStats(
        req.params.studentId,
        req.query.academicSession
      );

    api.success(
      res,
      { stats },
      "Attendance statistics retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res, next) => {
  try {
    const attendance =
      await attendanceService.deleteAttendance(
        req.params.id
      );

    api.success(
      res,
      { attendance },
      "Attendance deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
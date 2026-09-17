const timetableService = require("../services/timetable.service");
const api = require("../utils/apiResponse");

// Create timetable entry
exports.createTimetable = async (req, res, next) => {
  try {
    const timetable =
      await timetableService.createTimetable(req.body);

    api.created(
      res,
      { timetable },
      "Timetable entry created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one timetable entry
exports.getTimetable = async (req, res, next) => {
  try {
    const timetable =
      await timetableService.findById(req.params.id);

    api.success(
      res,
      { timetable },
      "Timetable entry retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get class timetable
exports.getClassTimetable = async (req, res, next) => {
  try {
    const { academicSession } = req.query;

    const timetable =
      await timetableService.findByClass(
        req.params.classId,
        academicSession
      );

    api.success(
      res,
      { timetable },
      "Class timetable retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get teacher timetable
exports.getTeacherTimetable = async (req, res, next) => {
  try {
    const { academicSession } = req.query;

    const timetable =
      await timetableService.findByTeacher(
        req.params.teacherId,
        academicSession
      );

    api.success(
      res,
      { timetable },
      "Teacher timetable retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get school timetable
exports.getSchoolTimetable = async (req, res, next) => {
  try {
    const { academicSession } = req.query;

    const timetable =
      await timetableService.findBySchool(
        req.params.schoolId,
        academicSession
      );

    api.success(
      res,
      { timetable },
      "School timetable retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update timetable
exports.updateTimetable = async (req, res, next) => {
  try {
    const timetable =
      await timetableService.updateTimetable(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { timetable },
      "Timetable updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Deactivate timetable
exports.deactivateTimetable = async (
  req,
  res,
  next
) => {
  try {
    const timetable =
      await timetableService.deactivateTimetable(
        req.params.id
      );

    api.success(
      res,
      { timetable },
      "Timetable deactivated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete timetable
exports.deleteTimetable = async (req, res, next) => {
  try {
    const timetable =
      await timetableService.deleteTimetable(
        req.params.id
      );

    api.success(
      res,
      { timetable },
      "Timetable deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
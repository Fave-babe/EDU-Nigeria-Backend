const classSubjectService = require("../services/classSubject.service");
const api = require("../utils/apiResponse");

// Create class-subject assignment
exports.createAssignment = async (req, res, next) => {
  try {
    const assignment =
      await classSubjectService.createAssignment(req.body);

    api.created(
      res,
      { assignment },
      "Class subject assignment created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one assignment
exports.getAssignment = async (req, res, next) => {
  try {
    const assignment =
      await classSubjectService.findById(req.params.id);

    api.success(
      res,
      { assignment },
      "Class subject assignment retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get all subjects assigned to a class
exports.getClassSubjects = async (req, res, next) => {
  try {
    const assignments =
      await classSubjectService.findByClass(
        req.params.classId,
        req.query.academicSession
      );

    api.success(
      res,
      { assignments },
      "Class subjects retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get all assignments for a teacher
exports.getTeacherSubjects = async (req, res, next) => {
  try {
    const assignments =
      await classSubjectService.findByTeacher(
        req.params.teacherId,
        req.query.academicSession
      );

    api.success(
      res,
      { assignments },
      "Teacher assignments retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update assignment
exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment =
      await classSubjectService.updateAssignment(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { assignment },
      "Class subject assignment updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Activate / deactivate assignment
exports.toggleStatus = async (req, res, next) => {
  try {
    const assignment =
      await classSubjectService.toggleStatus(
        req.params.id
      );

    api.success(
      res,
      { assignment },
      `Assignment ${
        assignment.isActive
          ? "activated"
          : "deactivated"
      } successfully`
    );
  } catch (err) {
    next(err);
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment =
      await classSubjectService.deleteAssignment(
        req.params.id
      );

    api.success(
      res,
      { assignment },
      "Class subject assignment deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
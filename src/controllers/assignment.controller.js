const assignmentService = require("../services/assignment.service");
const api = require("../utils/apiResponse");

// Create assignment
exports.createAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.createAssignment(
      req.body,
      req.user?._id,
    );

    api.created(res, { assignment }, "Assignment created successfully");
  } catch (err) {
    next(err);
  }
};

// Get one assignment
exports.getAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);

    api.success(res, { assignment }, "Assignment retrieved successfully");
  } catch (err) {
    next(err);
  }
};

// Get all assignments for a school
exports.getSchoolAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAssignmentsBySchool(
      req.params.schoolId,
    );

    api.success(
      res,
      { assignments },
      "School assignments retrieved successfully",
    );
  } catch (err) {
    next(err);
  }
};

// Update assignment
exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.updateAssignment(
      req.params.id,
      req.body,
    );

    api.success(res, { assignment }, "Assignment updated successfully");
  } catch (err) {
    next(err);
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.deleteAssignment(req.params.id);

    api.success(res, { assignment }, "Assignment deleted successfully");
  } catch (err) {
    next(err);
  }
};

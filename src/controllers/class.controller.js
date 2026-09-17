const classService = require("../services/class.service");
const api = require("../utils/apiResponse");

// Create class
exports.createClass = async (req, res, next) => {
  try {
    const schoolClass = await classService.createClass(
      req.body
    );

    api.created(
      res,
      { class: schoolClass },
      "Class created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one class
exports.getClass = async (req, res, next) => {
  try {
    const schoolClass = await classService.findById(
      req.params.id
    );

    api.success(
      res,
      { class: schoolClass },
      "Class retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get all classes for a school
exports.getSchoolClasses = async (req, res, next) => {
  try {
    const classes = await classService.findAllBySchool(
      req.params.schoolId,
      req.query.academicSession
    );

    api.success(
      res,
      { classes },
      "School classes retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update class
exports.updateClass = async (req, res, next) => {
  try {
    const schoolClass = await classService.updateClass(
      req.params.id,
      req.body
    );

    api.success(
      res,
      { class: schoolClass },
      "Class updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Assign class teacher
exports.assignClassTeacher = async (req, res, next) => {
  try {
    const schoolClass =
      await classService.assignClassTeacher(
        req.params.id,
        req.body.teacherId
      );

    api.success(
      res,
      { class: schoolClass },
      "Class teacher assigned successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Remove class teacher
exports.removeClassTeacher = async (req, res, next) => {
  try {
    const schoolClass =
      await classService.removeClassTeacher(
        req.params.id
      );

    api.success(
      res,
      { class: schoolClass },
      "Class teacher removed successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete class
exports.deleteClass = async (req, res, next) => {
  try {
    const schoolClass = await classService.deleteClass(
      req.params.id
    );

    api.success(
      res,
      { class: schoolClass },
      "Class deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
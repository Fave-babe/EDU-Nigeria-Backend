const subjectService = require("../services/subject.service");
const api = require("../utils/apiResponse");

// Create subject
exports.createSubject = async (req, res, next) => {
  try {
    const subject = await subjectService.createSubject(
      req.body
    );

    api.created(
      res,
      { subject },
      "Subject created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one subject
exports.getSubject = async (req, res, next) => {
  try {
    const subject = await subjectService.findById(
      req.params.id
    );

    api.success(
      res,
      { subject },
      "Subject retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get all subjects for a school
exports.getSchoolSubjects = async (req, res, next) => {
  try {
    const subjects =
      await subjectService.findAllBySchool(
        req.params.schoolId
      );

    api.success(
      res,
      { subjects },
      "Subjects retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update subject
exports.updateSubject = async (req, res, next) => {
  try {
    const subject =
      await subjectService.updateSubject(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { subject },
      "Subject updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Activate / deactivate subject
exports.toggleSubjectStatus = async (
  req,
  res,
  next
) => {
  try {
    const subject =
      await subjectService.toggleSubjectStatus(
        req.params.id
      );

    api.success(
      res,
      { subject },
      `Subject ${
        subject.isActive
          ? "activated"
          : "deactivated"
      } successfully`
    );
  } catch (err) {
    next(err);
  }
};

// Delete subject
exports.deleteSubject = async (req, res, next) => {
  try {
    const subject =
      await subjectService.deleteSubject(
        req.params.id
      );

    api.success(
      res,
      { subject },
      "Subject deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
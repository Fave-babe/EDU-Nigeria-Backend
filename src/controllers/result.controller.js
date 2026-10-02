const resultService = require("../services/result.service");
const api = require("../utils/apiResponse");

// Create result
exports.createResult = async (req, res, next) => {
  try {
    const roleMap = {
      admin: "Admin",
      super_admin: "SuperAdmin",
      teacher: "Teacher",
    };

    const recordedByModel = roleMap[req.user.role];

    const result = await resultService.createResult({
      ...req.body,
      recordedBy: req.user._id,
      recordedByModel,
    });

    api.created(res, { result }, "Result created successfully");
  } catch (err) {
    next(err);
  }
};

// Get result by ID
exports.getResult = async (req, res, next) => {
  try {
    const result = await resultService.findById(
      req.params.id
    );

    api.success(
      res,
      { result },
      "Result retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get student's results
exports.getStudentResults = async (req, res, next) => {
  try {
    const {
      academicSession,
      term,
    } = req.query;

    const results =
      await resultService.findByStudent(
        req.params.studentId,
        academicSession,
        term
      );

    api.success(
      res,
      { results },
      "Student results retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get class results
exports.getClassResults = async (req, res, next) => {
  try {
    const {
      academicSession,
      term,
    } = req.query;

    const results =
      await resultService.findByClass(
        req.params.classId,
        academicSession,
        term
      );

    api.success(
      res,
      { results },
      "Class results retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update result
exports.updateResult = async (req, res, next) => {
  try {
    const result =
      await resultService.updateResult(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { result },
      "Result updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Submit result
exports.submitResult = async (req, res, next) => {
  try {
    const result =
      await resultService.submitResult(
        req.params.id
      );

    api.success(
      res,
      { result },
      "Result submitted successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Approve result
exports.approveResult = async (req, res, next) => {
  try {
    const result =
      await resultService.approveResult(
        req.params.id
      );

    api.success(
      res,
      { result },
      "Result approved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Publish result
exports.publishResult = async (req, res, next) => {
  try {
    const result =
      await resultService.publishResult(
        req.params.id
      );

    api.success(
      res,
      { result },
      "Result published successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete result
exports.deleteResult = async (req, res, next) => {
  try {
    const result =
      await resultService.deleteResult(
        req.params.id
      );

    api.success(
      res,
      { result },
      "Result deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
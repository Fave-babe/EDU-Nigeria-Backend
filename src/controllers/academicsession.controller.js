const academicSessionService = require("../services/academicsession.service");
const api = require("../utils/apiResponse");

// Create academic session
exports.createSession = async (req, res, next) => {
  try {
    const session = await academicSessionService.createSession(
      req.body
    );

    api.created(
      res,
      { session },
      "Academic session created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one academic session
exports.getSession = async (req, res, next) => {
  try {
    const session = await academicSessionService.findById(
      req.params.id
    );

    api.success(
      res,
      { session },
      "Academic session retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get all sessions for a school
exports.getSchoolSessions = async (req, res, next) => {
  try {
    const sessions =
      await academicSessionService.findAllBySchool(
        req.params.schoolId
      );

    api.success(
      res,
      { sessions },
      "Academic sessions retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get current academic session
exports.getCurrentSession = async (req, res, next) => {
  try {
    const session =
      await academicSessionService.getCurrentSession(
        req.params.schoolId
      );

    api.success(
      res,
      { session },
      "Current academic session retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Set current academic session
exports.setCurrentSession = async (req, res, next) => {
  try {
    const session =
      await academicSessionService.setCurrentSession(
        req.params.id
      );

    api.success(
      res,
      { session },
      "Academic session set as current"
    );
  } catch (err) {
    next(err);
  }
};

// Update academic session
exports.updateSession = async (req, res, next) => {
  try {
    const session =
      await academicSessionService.updateSession(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { session },
      "Academic session updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete academic session
exports.deleteSession = async (req, res, next) => {
  try {
    const session =
      await academicSessionService.deleteSession(
        req.params.id
      );

    api.success(
      res,
      { session },
      "Academic session deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
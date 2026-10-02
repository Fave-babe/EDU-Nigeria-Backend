const enrollmentService = require("../services/enrollement.service");
const api = require("../utils/apiResponse");

// Create enrollment
exports.createEnrollment = async (req, res, next) => {
  try {
    const enrollment =
      await enrollmentService.createEnrollment(req.body);

    api.created(
      res,
      { enrollment },
      "Student enrolled successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get enrollment by ID
exports.getEnrollment = async (req, res, next) => {
  try {
    const enrollment =
      await enrollmentService.findById(req.params.id);

    api.success(
      res,
      { enrollment },
      "Enrollment retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get student's enrollment history
exports.getStudentEnrollments = async (req, res, next) => {
  try {
    const enrollments =
      await enrollmentService.findByStudent(
        req.params.studentId
      );

    api.success(
      res,
      { enrollments },
      "Student enrollments retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get current class and subjects for a student

exports.getStudentAcademicInfo = async (req, res, next) => {
  try {
    const academicInfo =
      await enrollmentService.getStudentAcademicInfo(
        req.params.studentId
      );

    api.success(
      res,
      { academicInfo },
      "Student academic information retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get students enrolled in a class
exports.getClassEnrollments = async (req, res, next) => {
  try {
    const enrollments =
      await enrollmentService.findByClass(
        req.params.classId,
        req.query.academicSession
      );

    api.success(
      res,
      { enrollments },
      "Class enrollments retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get school enrollments
exports.getSchoolEnrollments = async (req, res, next) => {
  try {
    const enrollments =
      await enrollmentService.findBySchool(
        req.params.schoolId,
        req.query.academicSession,
        req.query.class
      );

    api.success(
      res,
      { enrollments },
      "School enrollments retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update enrollment
exports.updateEnrollment = async (req, res, next) => {
  try {
    const enrollment =
      await enrollmentService.updateEnrollment(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { enrollment },
      "Enrollment updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update enrollment status
exports.updateStatus = async (req, res, next) => {
  try {
    const enrollment =
      await enrollmentService.updateStatus(
        req.params.id,
        req.body.status
      );

    api.success(
      res,
      { enrollment },
      "Enrollment status updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment =
      await enrollmentService.deleteEnrollment(
        req.params.id
      );

    api.success(
      res,
      { enrollment },
      "Enrollment deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
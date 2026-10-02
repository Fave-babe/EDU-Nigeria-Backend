const teacherService = require("../services/teacher.service");
const api = require("../utils/apiResponse");

// Create teacher
exports.createTeacher = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      school: req.user.school?._id || req.user.school,
    };

    const teacher =
      await teacherService.createTeacher(data);

    api.created(
      res,
      { teacher },
      "Teacher created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one teacher
exports.getTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.findById(
      req.params.id
    );

    api.success(
      res,
      { teacher },
      "Teacher retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get teacher dashboard
exports.getTeacherDashboard = async (req, res, next) => {
  try {
    const dashboard =
      await teacherService.getTeacherDashboard(
        req.user._id
      );

    api.success(
      res,
      dashboard,
      "Teacher dashboard retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get all teachers
exports.getTeachers = async (req, res, next) => {
  try {
    const {
      school,
      status,
      isActive,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await teacherService.findAll({
      school,
      status,
      isActive:
        isActive === undefined
          ? undefined
          : isActive === "true",
      page: Number(page),
      limit: Number(limit),
    });

    api.paginated(
      res,
      result,
      "Teachers retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get teachers by school
exports.getTeachersBySchool = async (req, res, next) => {
  try {
    const teachers =
      await teacherService.getTeachersBySchool(
        req.params.schoolId
      );

    api.success(
      res,
      { teachers },
      "School teachers retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update teacher
exports.updateTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.updateTeacher(
      req.params.id,
      req.body
    );

    api.success(
      res,
      { teacher },
      "Teacher updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Activate teacher
exports.activateTeacher = async (req, res, next) => {
  try {
    const teacher =
      await teacherService.activateTeacher(
        req.params.id
      );

    api.success(
      res,
      { teacher },
      "Teacher activated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Deactivate teacher
exports.deactivateTeacher = async (req, res, next) => {
  try {
    const teacher =
      await teacherService.deactivateTeacher(
        req.params.id
      );

    api.success(
      res,
      { teacher },
      "Teacher deactivated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res, next) => {
  try {
    const teacher =
      await teacherService.deleteTeacher(
        req.params.id
      );

    api.success(
      res,
      { teacher },
      "Teacher deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
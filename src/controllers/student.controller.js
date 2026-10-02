const studentService = require("../services/student.service");
const api = require("../utils/apiResponse");
const AppError = require("../utils/AppError");
const { ROLES } = require("../config/constant");

exports.createStudent = async (req, res, next) => {
  try {
    const school =
      req.user.role === ROLES.SUPER_ADMIN
        ? req.body.school
        : req.user.school?._id || req.user.school;

    if (!school) {
      return next(
        new AppError("School is required to create a student", 400)
      );
    }

    const data = {
      ...req.body,
      school,
    };

    const student = await studentService.createStudent(
      data,
      req.user._id
    );

    api.created(
      res,
      { student },
      "Student created successfully"
    );
  } catch (err) {
    next(err);
  }
};



exports.getStudent = async (req, res, next) => {
  try {
    const student = await studentService.findById(req.params.id);

    api.success(res, { student }, "Student retrieved successfully");
  } catch (err) {
    next(err);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const schoolId =
      req.user.school?._id || req.user.school;

    if (!schoolId) {
      return next(
        new AppError("Your account is not assigned to a school", 400)
      );
    }

    const result = await studentService.findAll({
      school: schoolId,
      status,
      page: Number(page),
      limit: Number(limit),
    });

    api.paginated(res, result);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const student = await studentService.findById(req.user._id);

    api.success(
      res,
      { student },
      "Current student retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(
      req.params.id,
      req.body,
      req.user._id
    );

    api.success(res, { student }, "Student updated successfully");
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await studentService.deleteStudent(
      req.params.id
    );

    api.success(res, { student }, "Student deleted successfully");
  } catch (err) {
    next(err);
  }
};

exports.getStudentsBySchool = async (req, res, next) => {
  try {
    const requestedSchoolId = req.params.schoolId;

    // Parents can only access students from their own school
    if (req.user.role === ROLES.PARENT) {
      const parentSchoolId =
        req.user.school?._id || req.user.school;

      if (!parentSchoolId) {
        return next(
          new AppError(
            "Your parent account is not assigned to a school",
            400
          )
        );
      }

      if (parentSchoolId.toString() !== requestedSchoolId.toString()) {
        return next(
          new AppError(
            "You can only access students from your school",
            403
          )
        );
      }
    }

    const students =
      await studentService.getStudentsBySchool(requestedSchoolId);

    api.success(
      res,
      { students },
      "School students retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};
exports.getStudentsByTeacher = async (req, res, next) => {
  try {
    const students =
      await studentService.getStudentsByTeacher(req.user._id);

    api.success(
      res,
      { students },
      "Teacher students retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};
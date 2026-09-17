const Teacher = require("../models/Teacher.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class TeacherService {
  // Create teacher
  async createTeacher(data) {
  const { email, school } = data;

  if (!school) {
    throw new AppError(
      "School is required for teacher",
      400
    );
  }

  // Check school

  const existingSchool =
    await School.findById(school);

  if (!existingSchool) {
    throw new AppError(
      "School not found",
      404
    );
  }
    // Check duplicate email
    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      throw new AppError(
        "A teacher with this email already exists",
        409
      );
    }

    const teacher = await Teacher.create(data);

    return teacher;
  }

  // Get teacher by ID
  async findById(teacherId) {
    const teacher = await Teacher.findById(teacherId)
      .populate(
        "school",
        "name schoolType email phone"
      );

    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    return teacher;
  }

  // Get all teachers
  async findAll({
    school,
    status,
    isActive,
    page = 1,
    limit = 20,
  }) {
    const filter = {};

    if (school) {
      filter.school = school;
    }

    if (status) {
      filter.registrationStatus = status;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const [teachers, total] = await Promise.all([
      Teacher.find(filter)
        .populate("school", "name schoolType")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Teacher.countDocuments(filter),
    ]);

    return {
      teachers,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // Update teacher
  async updateTeacher(teacherId, data) {
    // Check school if being changed
    if (data.school) {
      const school = await School.findById(data.school);

      if (!school) {
        throw new AppError("School not found", 404);
      }
    }

    // Check duplicate email
    if (data.email) {
      const existingTeacher = await Teacher.findOne({
        email: data.email,
        _id: { $ne: teacherId },
      });

      if (existingTeacher) {
        throw new AppError(
          "A teacher with this email already exists",
          409
        );
      }
    }

    // Don't update password through this method
    delete data.password;

    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      data,
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "school",
      "name schoolType"
    );

    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    return teacher;
  }

  // Activate teacher
  async activateTeacher(teacherId) {
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { isActive: true },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    return teacher;
  }

  // Deactivate teacher
  async deactivateTeacher(teacherId) {
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { isActive: false },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    return teacher;
  }

  // Delete teacher
  async deleteTeacher(teacherId) {
    const teacher = await Teacher.findByIdAndDelete(
      teacherId
    );

    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    return teacher;
  }

  // Get teachers belonging to a school
  async getTeachersBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const teachers = await Teacher.find({
      school: schoolId,
    })
      .populate("school", "name schoolType")
      .sort({ createdAt: -1 });

    return teachers;
  }
}

module.exports = new TeacherService();
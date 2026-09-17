const Student = require("../models/Student.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class StudentService {
  // Create a new student
  async createStudent(data, userId) {
    const { school, email } = data;

    // Make sure the school exists
    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    // Check if a student with the email already exists
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      throw new AppError(
        "A student with this email already exists",
        409
      );
    }

    const student = await Student.create({
      ...data,
      registeredBy: userId,
      lastModifiedBy: userId,
    });

    return student;
  }

  // Get a student by ID
  async findById(studentId) {
  const student = await Student.findById(studentId)
    .populate("school", "name schoolType email phone");

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return student;
}
  // Get all students
  async findAll({ school, status, page = 1, limit = 20 }) {
    const filter = {};

    if (school) {
      filter.school = school;
    }

    if (status) {
      filter.registrationStatus = status;
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate("school", "name schoolType")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Student.countDocuments(filter),
    ]);

    return {
      students,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // Update a student
  async updateStudent(studentId, data, userId) {
    // If school is being changed, make sure the new school exists
    if (data.school) {
      const school = await School.findById(data.school);

      if (!school) {
        throw new AppError("School not found", 404);
      }
    }

    // Prevent duplicate email
    if (data.email) {
      const existingStudent = await Student.findOne({
        email: data.email,
        _id: { $ne: studentId },
      });

      if (existingStudent) {
        throw new AppError(
          "A student with this email already exists",
          409
        );
      }
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        ...data,
        lastModifiedBy: userId,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("school", "name schoolType");

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    return student;
  }

  // Delete a student
  async deleteStudent(studentId) {
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    return student;
  }

  // Get students belonging to a particular school
  async getStudentsBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const students = await Student.find({
      school: schoolId,
    })
      .populate("school", "name schoolType")
      .sort({ createdAt: -1 });

    return students;
  }
}

module.exports = new StudentService();
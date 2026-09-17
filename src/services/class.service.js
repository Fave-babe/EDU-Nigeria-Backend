const Class = require("../models/Class.model");
const School = require("../models/School.model");
const AcademicSession = require("../models/AcademicSession.model");
const Teacher = require("../models/Teacher.model");
const AppError = require("../utils/AppError");

class ClassService {
  // Create a class
  async createClass(data) {
    const {
      school,
      academicSession,
      name,
      level,
      arm = "A",
      classTeacher,
      capacity = 40,
    } = data;

    // Check school
    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    // Check academic session belongs to the school
    const session = await AcademicSession.findOne({
      _id: academicSession,
      school,
    });

    if (!session) {
      throw new AppError(
        "Academic session not found for this school",
        404
      );
    }

    // Check teacher if provided
    if (classTeacher) {
      const teacher = await Teacher.findOne({
        _id: classTeacher,
        school,
      });

      if (!teacher) {
        throw new AppError(
          "Teacher not found for this school",
          404
        );
      }
    }

    // Check for duplicate class
    const existingClass = await Class.findOne({
      school,
      academicSession,
      name,
      arm,
    });

    if (existingClass) {
      throw new AppError(
        "This class already exists for this academic session",
        409
      );
    }

    // Create class
    const schoolClass = await Class.create({
      school,
      academicSession,
      name,
      level,
      arm,
      classTeacher: classTeacher || null,
      capacity,
    });

    return schoolClass;
  }

  // Get one class
  async findById(classId) {
    const schoolClass = await Class.findById(classId)
      .populate(
        "school",
        "name schoolType email phone"
      )
      .populate(
        "academicSession",
        "name startDate endDate isCurrent"
      )
      .populate(
        "classTeacher",
        "firstName lastName email"
      );

    if (!schoolClass) {
      throw new AppError("Class not found", 404);
    }

    return schoolClass;
  }

  // Get all classes belonging to a school
  async findAllBySchool(schoolId, academicSession) {
    // Check school
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const filter = {
      school: schoolId,
    };

    // Optional academic session filter
    if (academicSession) {
      const session = await AcademicSession.findOne({
        _id: academicSession,
        school: schoolId,
      });

      if (!session) {
        throw new AppError(
          "Academic session not found for this school",
          404
        );
      }

      filter.academicSession = academicSession;
    }

    const classes = await Class.find(filter)
      .populate(
        "academicSession",
        "name startDate endDate isCurrent"
      )
      .populate(
        "classTeacher",
        "firstName lastName email"
      )
      .sort({
        level: 1,
        arm: 1,
      });

    return classes;
  }

  // Update class
  async updateClass(classId, data) {
    const existingClass = await Class.findById(classId);

    if (!existingClass) {
      throw new AppError("Class not found", 404);
    }

    // Validate teacher if being changed
    if (data.classTeacher) {
      const teacher = await Teacher.findOne({
        _id: data.classTeacher,
        school: existingClass.school,
      });

      if (!teacher) {
        throw new AppError(
          "Teacher not found for this school",
          404
        );
      }
    }

    // Validate academic session if being changed
    if (data.academicSession) {
      const session = await AcademicSession.findOne({
        _id: data.academicSession,
        school: existingClass.school,
      });

      if (!session) {
        throw new AppError(
          "Academic session not found for this school",
          404
        );
      }
    }

    // Prevent duplicate class
    if (data.name || data.arm || data.academicSession) {
      const duplicateClass = await Class.findOne({
        school: existingClass.school,
        academicSession:
          data.academicSession || existingClass.academicSession,
        name: data.name || existingClass.name,
        arm: data.arm || existingClass.arm,
        _id: { $ne: classId },
      });

      if (duplicateClass) {
        throw new AppError(
          "This class already exists for this academic session",
          409
        );
      }
    }

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      data,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "school",
        "name schoolType"
      )
      .populate(
        "academicSession",
        "name startDate endDate isCurrent"
      )
      .populate(
        "classTeacher",
        "firstName lastName email"
      );

    return updatedClass;
  }

  // Assign a class teacher
  async assignClassTeacher(classId, teacherId) {
    const schoolClass = await Class.findById(classId);

    if (!schoolClass) {
      throw new AppError("Class not found", 404);
    }

    // Make sure teacher belongs to same school
    const teacher = await Teacher.findOne({
      _id: teacherId,
      school: schoolClass.school,
    });

    if (!teacher) {
      throw new AppError(
        "Teacher not found for this school",
        404
      );
    }

    schoolClass.classTeacher = teacherId;

    await schoolClass.save();

    return await Class.findById(classId)
      .populate(
        "school",
        "name schoolType"
      )
      .populate(
        "academicSession",
        "name startDate endDate isCurrent"
      )
      .populate(
        "classTeacher",
        "firstName lastName email"
      );
  }

  // Remove class teacher
  async removeClassTeacher(classId) {
    const schoolClass = await Class.findById(classId);

    if (!schoolClass) {
      throw new AppError("Class not found", 404);
    }

    schoolClass.classTeacher = null;

    await schoolClass.save();

    return schoolClass;
  }

  // Delete class
  async deleteClass(classId) {
    const schoolClass = await Class.findByIdAndDelete(classId);

    if (!schoolClass) {
      throw new AppError("Class not found", 404);
    }

    return schoolClass;
  }
}

module.exports = new ClassService();
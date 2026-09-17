const ClassSubject = require("../models/ClassSubject.model");
const School = require("../models/School.model");
const AcademicSession = require("../models/AcademicSession.model");
const Class = require("../models/Class.model");
const Subject = require("../models/Subject.model");
const Teacher = require("../models/Teacher.model");
const AppError = require("../utils/AppError");

class ClassSubjectService {
  // Assign a subject and teacher to a class
  async createAssignment(data) {
    const {
      school,
      academicSession,
      class: classId,
      subject,
      teacher,
      isCompulsory,
    } = data;

    if (!school) {
      throw new AppError("School is required", 400);
    }

    if (!academicSession) {
      throw new AppError("Academic session is required", 400);
    }

    if (!classId) {
      throw new AppError("Class is required", 400);
    }

    if (!subject) {
      throw new AppError("Subject is required", 400);
    }

    if (!teacher) {
      throw new AppError("Teacher is required", 400);
    }

    const schoolExists = await School.findById(school);

    if (!schoolExists) {
      throw new AppError("School not found", 404);
    }

    const sessionExists = await AcademicSession.findById(
      academicSession
    );

    if (!sessionExists) {
      throw new AppError("Academic session not found", 404);
    }

    const classExists = await Class.findById(classId);

    if (!classExists) {
      throw new AppError("Class not found", 404);
    }

    const subjectExists = await Subject.findById(subject);

    if (!subjectExists) {
      throw new AppError("Subject not found", 404);
    }

    const teacherExists = await Teacher.findById(teacher);

    if (!teacherExists) {
      throw new AppError("Teacher not found", 404);
    }

    const existingAssignment = await ClassSubject.findOne({
      school,
      academicSession,
      class: classId,
      subject,
    });

    if (existingAssignment) {
      throw new AppError(
        "This subject is already assigned to this class",
        409
      );
    }

    const classSubject = await ClassSubject.create({
      school,
      academicSession,
      class: classId,
      subject,
      teacher,
      isCompulsory: isCompulsory || false,
    });

    return classSubject;
  }

  // Get one class-subject assignment
  async findById(id) {
    const classSubject = await ClassSubject.findById(id)
      .populate("school", "name schoolType")
      .populate("academicSession", "name startDate endDate")
      .populate("class", "name level arm")
      .populate("subject", "name code category")
      .populate("teacher", "firstName lastName email");

    if (!classSubject) {
      throw new AppError("Class subject not found", 404);
    }

    return classSubject;
  }

  // Get all subjects assigned to a class
  async findByClass(classId, academicSession) {
    if (!classId) {
      throw new AppError("Class ID is required", 400);
    }

    const filter = {
      class: classId,
      isActive: true,
    };

    if (academicSession) {
      filter.academicSession = academicSession;
    }

    return await ClassSubject.find(filter)
      .populate("subject", "name code category isCompulsory")
      .populate("teacher", "firstName lastName email")
      .populate("academicSession", "name")
      .sort({ createdAt: -1 });
  }

  // Get all classes/subjects assigned to a teacher
  async findByTeacher(teacherId, academicSession) {
    if (!teacherId) {
      throw new AppError("Teacher ID is required", 400);
    }

    const filter = {
      teacher: teacherId,
      isActive: true,
    };

    if (academicSession) {
      filter.academicSession = academicSession;
    }

    return await ClassSubject.find(filter)
      .populate("class", "name level arm")
      .populate("subject", "name code category")
      .populate("academicSession", "name")
      .sort({ createdAt: -1 });
  }

  // Update class-subject assignment
  async updateAssignment(id, data) {
    const classSubject = await ClassSubject.findById(id);

    if (!classSubject) {
      throw new AppError("Class subject not found", 404);
    }

    const allowedFields = [
      "subject",
      "teacher",
      "isCompulsory",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        classSubject[field] = data[field];
      }
    });

    await classSubject.save();

    return classSubject;
  }

  // Toggle active/inactive
  async toggleStatus(id) {
    const classSubject = await ClassSubject.findById(id);

    if (!classSubject) {
      throw new AppError("Class subject not found", 404);
    }

    classSubject.isActive = !classSubject.isActive;

    await classSubject.save();

    return classSubject;
  }

  // Soft delete
  async deleteAssignment(id) {
    const classSubject = await ClassSubject.findById(id);

    if (!classSubject) {
      throw new AppError("Class subject not found", 404);
    }

    classSubject.isActive = false;

    await classSubject.save();

    return {
      id: classSubject._id,
      isActive: classSubject.isActive,
    };
  }
}

module.exports = new ClassSubjectService();
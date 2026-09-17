const Subject = require("../models/Subject.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class SubjectService {
  // Create subject
  async createSubject(data) {
    const {
      school,
      name,
      code,
      category,
      description,
      isCompulsory,
    } = data;

    // Check school
    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    // Check duplicate subject code
    const existingCode = await Subject.findOne({
      school,
      code: code.toUpperCase(),
    });

    if (existingCode) {
      throw new AppError(
        "A subject with this code already exists in this school",
        409
      );
    }

    // Check duplicate subject name
    const existingName = await Subject.findOne({
      school,
      name,
    });

    if (existingName) {
      throw new AppError(
        "This subject already exists in this school",
        409
      );
    }

    const subject = await Subject.create({
      school,
      name,
      code,
      category,
      description,
      isCompulsory: isCompulsory || false,
    });

    return subject;
  }

  // Get one subject
  async findById(subjectId) {
    const subject = await Subject.findById(subjectId).populate(
      "school",
      "name schoolType"
    );

    if (!subject) {
      throw new AppError("Subject not found", 404);
    }

    return subject;
  }

  // Get all subjects for a school
  async findAllBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const subjects = await Subject.find({
      school: schoolId,
    }).sort({
      name: 1,
    });

    return subjects;
  }

  // Update subject
  async updateSubject(subjectId, data) {
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      throw new AppError("Subject not found", 404);
    }

    if (data.code) {
      data.code = data.code.toUpperCase();
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      subjectId,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedSubject;
  }

  // Activate / deactivate subject
  async toggleSubjectStatus(subjectId) {
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      throw new AppError("Subject not found", 404);
    }

    subject.isActive = !subject.isActive;

    await subject.save();

    return subject;
  }

  // Delete subject
  async deleteSubject(subjectId) {
    const subject = await Subject.findByIdAndDelete(subjectId);

    if (!subject) {
      throw new AppError("Subject not found", 404);
    }

    return subject;
  }
}

module.exports = new SubjectService();
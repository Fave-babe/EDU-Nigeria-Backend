const CounsellingRecord = require("../models/CounsellingRecording.model");
const Student = require("../models/Student.model");
const Staff = require("../models/Staff.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class CounsellingRecordService {
  async createRecord(data) {
    const { student, counsellor, school } = data;

    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      throw new AppError("Student not found", 404);
    }

    const existingCounsellor = await Staff.findById(counsellor);

    if (!existingCounsellor) {
      throw new AppError("Counsellor not found", 404);
    }

    if (
      existingCounsellor.role !== "staff" ||
      existingCounsellor.staffRole?.toLowerCase() !== "counsellor"
    ) {
      throw new AppError("Selected staff member is not a counsellor", 400);
    }

    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    if (
      existingStudent.school &&
      existingStudent.school.toString() !== school.toString()
    ) {
      throw new AppError(
        "Student does not belong to this school",
        400
      );
    }

    if (
      existingCounsellor.school &&
      existingCounsellor.school.toString() !== school.toString()
    ) {
      throw new AppError(
        "Counsellor does not belong to this school",
        400
      );
    }

    return await CounsellingRecord.create(data);
  }

  async getRecord(recordId) {
    const record = await CounsellingRecord.findById(recordId)
      .populate(
        "student",
        "firstName lastName email registrationNumber gender phone"
      )
      .populate(
        "counsellor",
        "fullName email phone staffRole"
      )
      .populate(
        "school",
        "name schoolType"
      );

    if (!record) {
      throw new AppError("Counselling record not found", 404);
    }

    return record;
  }

  async getRecordsBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    return await CounsellingRecord.find({
      school: schoolId,
    })
      .populate(
        "student",
        "firstName lastName email registrationNumber gender phone"
      )
      .populate(
        "counsellor",
        "fullName email phone staffRole"
      )
      .sort({ date: -1 });
  }

 async getRecordsByCounsellor(counsellorId) {
  const counsellor = await Staff.findById(counsellorId);

  if (!counsellor) {
    throw new AppError("Counsellor not found", 404);
  }

  const records = await CounsellingRecord.find({
    counsellor: counsellorId,
  })
    .populate(
      "student",
      "firstName lastName email registrationNumber gender phone"
    )
    .populate(
      "school",
      "name schoolType"
    )
    .sort({ date: -1 });

  return records;
}

async getFollowUpsByCounsellor(counsellorId) {
  const counsellor = await Staff.findById(counsellorId);

  if (!counsellor) {
    throw new AppError("Counsellor not found", 404);
  }

  const records = await CounsellingRecord.find({
    counsellor: counsellorId,
    status: "follow_up",
  })
    .populate(
      "student",
      "firstName lastName email registrationNumber gender phone"
    )
    .populate(
      "school",
      "name schoolType"
    )
    .sort({ date: -1 });

  return records;
}

  async updateRecord(recordId, data) {
    const record = await CounsellingRecord.findByIdAndUpdate(
      recordId,
      data,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "student",
        "firstName lastName email registrationNumber gender phone"
      )
      .populate(
        "counsellor",
        "fullName email phone staffRole"
      )
      .populate(
        "school",
        "name schoolType"
      );

    if (!record) {
      throw new AppError("Counselling record not found", 404);
    }

    return record;
  }

  async deleteRecord(recordId) {
    const record = await CounsellingRecord.findByIdAndDelete(recordId);

    if (!record) {
      throw new AppError("Counselling record not found", 404);
    }

    return record;
  }
}

module.exports = new CounsellingRecordService();
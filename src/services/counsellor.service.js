const Counsellor = require("../models/Counsellor.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class CounsellorService {
  // Create counsellor
  async createCounsellor(data) {
    const { email, school } = data;

    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    const existingCounsellor = await Counsellor.findOne({ email });

    if (existingCounsellor) {
      throw new AppError(
        "A counsellor with this email already exists",
        409
      );
    }

    const counsellor = await Counsellor.create(data);

    return counsellor;
  }

  // Get counsellor by ID
  async findById(counsellorId) {
    const counsellor = await Counsellor.findById(counsellorId)
      .populate("school", "name schoolType email phone");

    if (!counsellor) {
      throw new AppError("Counsellor not found", 404);
    }

    return counsellor;
  }

  // Get all counsellors
  async findAll({
    school,
    specialization,
    isActive,
    page = 1,
    limit = 20,
  }) {
    const filter = {};

    if (school) {
      filter.school = school;
    }

    if (specialization) {
      filter.specialization = specialization;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const skip = (page - 1) * limit;

    const [counsellors, total] = await Promise.all([
      Counsellor.find(filter)
        .populate("school", "name schoolType")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Counsellor.countDocuments(filter),
    ]);

    return {
      counsellors,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // Update counsellor
  async updateCounsellor(counsellorId, data) {
    if (data.school) {
      const school = await School.findById(data.school);

      if (!school) {
        throw new AppError("School not found", 404);
      }
    }

    if (data.email) {
      const existingCounsellor = await Counsellor.findOne({
        email: data.email,
        _id: { $ne: counsellorId },
      });

      if (existingCounsellor) {
        throw new AppError(
          "A counsellor with this email already exists",
          409
        );
      }
    }

    const counsellor = await Counsellor.findByIdAndUpdate(
      counsellorId,
      data,
      {
        new: true,
        runValidators: true,
      }
    ).populate("school", "name schoolType");

    if (!counsellor) {
      throw new AppError("Counsellor not found", 404);
    }

    return counsellor;
  }

  // Delete counsellor
  async deleteCounsellor(counsellorId) {
    const counsellor = await Counsellor.findByIdAndDelete(
      counsellorId
    );

    if (!counsellor) {
      throw new AppError("Counsellor not found", 404);
    }

    return counsellor;
  }

  // Get counsellors belonging to a school
  async getCounsellorsBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const counsellors = await Counsellor.find({
      school: schoolId,
    })
      .populate("school", "name schoolType")
      .sort({ createdAt: -1 });

    return counsellors;
  }
}

module.exports = new CounsellorService();
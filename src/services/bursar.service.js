const Bursar = require("../models/Bursar.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class BursarService {
  // Create bursar
  async createBursar(data) {
    const { email, school } = data;

    // Check that the school exists
    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    // Check for duplicate email
    const existingBursar = await Bursar.findOne({ email });

    if (existingBursar) {
      throw new AppError(
        "A bursar with this email already exists",
        409
      );
    }

    const bursar = await Bursar.create(data);

    return bursar;
  }

  // Get bursar by ID
  async findById(bursarId) {
    const bursar = await Bursar.findById(bursarId).populate(
      "school",
      "name schoolType email phone"
    );

    if (!bursar) {
      throw new AppError("Bursar not found", 404);
    }

    return bursar;
  }

  // Get all bursars
  async findAll({ school, isActive, page = 1, limit = 20 }) {
    const filter = {};

    if (school) {
      filter.school = school;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const skip = (page - 1) * limit;

    const [bursars, total] = await Promise.all([
      Bursar.find(filter)
        .populate("school", "name schoolType")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Bursar.countDocuments(filter),
    ]);

    return {
      bursars,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // Update bursar
  async updateBursar(bursarId, data) {
    // Verify school if it is being changed
    if (data.school) {
      const school = await School.findById(data.school);

      if (!school) {
        throw new AppError("School not found", 404);
      }
    }

    // Prevent duplicate email
    if (data.email) {
      const existingBursar = await Bursar.findOne({
        email: data.email,
        _id: { $ne: bursarId },
      });

      if (existingBursar) {
        throw new AppError(
          "A bursar with this email already exists",
          409
        );
      }
    }

    const bursar = await Bursar.findByIdAndUpdate(
      bursarId,
      data,
      {
        new: true,
        runValidators: true,
      }
    ).populate("school", "name schoolType");

    if (!bursar) {
      throw new AppError("Bursar not found", 404);
    }

    return bursar;
  }

  // Delete bursar
  async deleteBursar(bursarId) {
    const bursar = await Bursar.findByIdAndDelete(bursarId);

    if (!bursar) {
      throw new AppError("Bursar not found", 404);
    }

    return bursar;
  }

  // Get bursars belonging to a school
  async getBursarsBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const bursars = await Bursar.find({
      school: schoolId,
    })
      .populate("school", "name schoolType")
      .sort({ createdAt: -1 });

    return bursars;
  }
}

module.exports = new BursarService();
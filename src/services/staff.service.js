const Staff = require("../models/Staff.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class StaffService {
  // Create staff
  async createStaff(data) {
    const { email, school } = data;

    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    const existingStaff = await Staff.findOne({ email });

    if (existingStaff) {
      throw new AppError(
        "A staff member with this email already exists",
        409
      );
    }

    const staff = await Staff.create(data);

    return staff;
  }

  // Get staff by ID
  async findById(staffId) {
    const staff = await Staff.findById(staffId).populate(
      "school",
      "name schoolType email phone"
    );

    if (!staff) {
      throw new AppError("Staff member not found", 404);
    }

    return staff;
  }

  // Get all staff
  async findAll({ school, role, staffRole, page = 1, limit = 20 }) {
    const filter = {};

    if (school) {
      filter.school = school;
    }

    if (role) {
      filter.role = role;
    }

    if (staffRole) {
      filter.staffRole = staffRole;
    }

    const skip = (page - 1) * limit;

    const [staff, total] = await Promise.all([
      Staff.find(filter)
        .populate("school", "name schoolType")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Staff.countDocuments(filter),
    ]);

    return {
      staff,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // Update staff
  async updateStaff(staffId, data) {
    if (data.school) {
      const school = await School.findById(data.school);

      if (!school) {
        throw new AppError("School not found", 404);
      }
    }

    if (data.email) {
      const existingStaff = await Staff.findOne({
        email: data.email,
        _id: { $ne: staffId },
      });

      if (existingStaff) {
        throw new AppError(
          "A staff member with this email already exists",
          409
        );
      }
    }

    const staff = await Staff.findByIdAndUpdate(
      staffId,
      data,
      {
        new: true,
        runValidators: true,
      }
    ).populate("school", "name schoolType");

    if (!staff) {
      throw new AppError("Staff member not found", 404);
    }

    return staff;
  }

  // Delete staff
  async deleteStaff(staffId) {
    const staff = await Staff.findByIdAndDelete(staffId);

    if (!staff) {
      throw new AppError("Staff member not found", 404);
    }

    return staff;
  }

  // Get staff belonging to a school
  async getStaffBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const staff = await Staff.find({
      school: schoolId,
    })
      .populate("school", "name schoolType")
      .sort({ createdAt: -1 });

    return staff;
  }
}

module.exports = new StaffService();
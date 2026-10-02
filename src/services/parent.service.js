const Parent = require("../models/Parent.model");
const Student = require("../models/Student.model");
const Enrollment = require("../models/Enrollement.model");
const Assignment = require("../models/Assignment.model");
const Attendance = require("../models/Attendance.model");
const Result = require("../models/Result.model");
const AppError = require("../utils/AppError");
// const School = require("../models/School.model");


class ParentService {
  // Create a parent
  async createParent(data) {
    const { email } = data;

    const existingParent = await Parent.findOne({ email });

    if (existingParent) {
      throw new AppError(
        "A parent with this email already exists",
        409
      );
    }

    const parent = await Parent.create(data);

    return parent;
  }

  // Get parent by ID
 async findById(parentId) {
  const parent = await Parent.findById(parentId)
    .populate("school", "name schoolType email phone")
    .populate({
      path: "children",
      select: "-password",
      populate: {
        path: "school",
        select: "name schoolType",
      },
    });

  if (!parent) {
    throw new AppError("Parent not found", 404);
  }

  return parent;
}

  // Get all parents
  async findAll({ page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [parents, total] = await Promise.all([
      Parent.find()
  .populate("school", "name schoolType email phone")
  .populate("children", "firstName lastName email registrationNumber")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Parent.countDocuments(),
    ]);

    return {
      parents,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // Update parent
  async updateParent(parentId, data) {
    if (data.email) {
      const existingParent = await Parent.findOne({
        email: data.email,
        _id: { $ne: parentId },
      });

      if (existingParent) {
        throw new AppError(
          "A parent with this email already exists",
          409
        );
      }
    }

    const parent = await Parent.findByIdAndUpdate(
      parentId,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!parent) {
      throw new AppError("Parent not found", 404);
    }

    return parent;
  }

  // Add a student to a parent
 async addChild(parentId, studentId) {
  const parent = await Parent.findById(parentId);

  if (!parent) {
    throw new AppError("Parent not found", 404);
  }

  const student = await Student.findById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  // Parent can only link students from the same school
  if (
    parent.school &&
    student.school &&
    parent.school.toString() !== student.school.toString()
  ) {
    throw new AppError(
      "You can only link a student from your school",
      403
    );
  }

  // Prevent duplicate links
  const alreadyLinked = parent.children.some(
    (childId) => childId.toString() === studentId.toString()
  );

  if (alreadyLinked) {
    throw new AppError(
      "This student is already linked to the parent",
      400
    );
  }

  parent.children.push(studentId);

  await parent.save();

  return parent.populate({
    path: "children",
    select: "-password",
    populate: {
      path: "school",
      select: "name schoolType",
    },
  });
}

  // Remove a student from a parent
  async removeChild(parentId, studentId) {
    const parent = await Parent.findById(parentId);

    if (!parent) {
      throw new AppError("Parent not found", 404);
    }

    parent.children = parent.children.filter(
      (childId) => childId.toString() !== studentId
    );

    await parent.save();

    return parent;
  }

    // Get logged-in parent's dashboard
async getMyDashboard(parentId) {
  const parent = await Parent.findById(parentId)
    .select("-password")
    .populate("school", "name schoolType email phone address city state country")
    .populate({
      path: "children",
      select: "-password",
      populate: {
        path: "school",
        select: "name schoolType",
      },
    });

  if (!parent) {
    throw new AppError("Parent not found", 404);
  }

  return {
    parent: {
      _id: parent._id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      school: parent.school,
    },
    children: parent.children,
  };
}

  // Delete parent
  async deleteParent(parentId) {
    const parent = await Parent.findByIdAndDelete(parentId);

    if (!parent) {
      throw new AppError("Parent not found", 404);
    }

    return parent;
  }
}

module.exports = new ParentService();
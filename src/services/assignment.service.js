const Assignment = require("../models/Assignment.model");
const AppError = require("../utils/AppError");

const createAssignment = async (data, userId) => {
  const {
    school,
    teacher,
    class: classId,
    subject,
    academicSession,
    title,
    description,
    instructions,
    dueDate,
    totalMarks,
    status,
  } = data;

  if (!school) {
    throw new AppError("School is required", 400);
  }

  if (!teacher) {
    throw new AppError("Teacher is required", 400);
  }

  if (!classId) {
    throw new AppError("Class is required", 400);
  }

  if (!subject) {
    throw new AppError("Subject is required", 400);
  }

  if (!academicSession) {
    throw new AppError("Academic session is required", 400);
  }

  if (!title) {
    throw new AppError("Assignment title is required", 400);
  }

  if (!dueDate) {
    throw new AppError("Due date is required", 400);
  }

  if (!totalMarks) {
    throw new AppError("Total marks are required", 400);
  }

  const assignment = await Assignment.create({
    school,
    teacher,
    class: classId,
    subject,
    academicSession,
    title,
    description,
    instructions,
    dueDate,
    totalMarks,
    status: status || "draft",
  });

  return assignment;
};

const getAssignmentById = async (assignmentId) => {
  const assignment = await Assignment.findById(assignmentId)
    .populate("school", "name")
    .populate("teacher", "firstName lastName email")
    .populate("class", "name level arm")
    .populate("subject", "name code")
    .populate("academicSession", "name");

  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  return assignment;
};

const getAssignmentsBySchool = async (schoolId) => {
  return Assignment.find({
    school: schoolId,
    isActive: true,
  })
    .populate("teacher", "firstName lastName")
    .populate("class", "name level arm")
    .populate("subject", "name code")
    .populate("academicSession", "name")
    .sort({ createdAt: -1 });
};

const updateAssignment = async (assignmentId, data) => {
  const assignment = await Assignment.findByIdAndUpdate(
    assignmentId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  return assignment;
};

const deleteAssignment = async (assignmentId) => {
  const assignment = await Assignment.findByIdAndUpdate(
    assignmentId,
    { isActive: false },
    { new: true }
  );

  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  return assignment;
};

module.exports = {
  createAssignment,
  getAssignmentById,
  getAssignmentsBySchool,
  updateAssignment,
  deleteAssignment,
};
const School = require("../models/School.model");
const Student = require("../models/Student.model");
const Teacher = require("../models/Teacher.model");
const Staff = require("../models/Staff.model");
const Parent = require("../models/Parent.model");
const Admin = require("../models/Admin.model");
const Class = require("../models/Class.model");
const AcademicSession = require("../models/AcademicSession.model");
const Enrollment = require("../models/Enrollement.model");
const Attendance = require("../models/attendance.model");
const { ROLES } = require("../config/constant");
const createSchool = async (data, userId) => {
  const {
    adminFullName,
    adminEmail,
    adminPassword,
    ...schoolData
  } = data;

  // ---------------------------------------------
  // CREATE SCHOOL
  // ---------------------------------------------

  const school = await School.create({
    ...schoolData,
    createdBy: userId,
    lastModifiedBy: userId,
  });

  // ---------------------------------------------
  // CREATE ADMIN FOR THE SCHOOL
  // ---------------------------------------------

  if (adminFullName && adminEmail && adminPassword) {
    const normalizedEmail = adminEmail
      .toLowerCase()
      .trim();

    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      // Remove the school we just created because
      // the Admin could not be created.
      await School.findByIdAndDelete(school._id);

      const error = new Error(
        "An admin with this email already exists"
      );

      error.statusCode = 409;
      throw error;
    }

    await Admin.create({
      fullName: adminFullName.trim(),
      email: normalizedEmail,
      password: adminPassword,
      school: school._id,
      role: ROLES.ADMIN,
    });
  }

  return school;
};

const getSchoolById = async (schoolId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    const error = new Error("School not found");
    error.statusCode = 404;
    throw error;
  }

  return school;
};

const getSchoolDetails = async (schoolId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    const error = new Error("School not found");
    error.statusCode = 404;
    throw error;
  }

  const [
    students,
    teachers,
    staff,
    parents,
    admins,
    classes,
    academicSessions,
    enrollments,
    attendance,
  ] = await Promise.all([
    Student.find({ school: schoolId }).select(
      "-password -emailVerifyToken -emailVerifyExpires"
    ),

    Teacher.find({ school: schoolId }).select(
      "-password -emailVerifyToken -emailVerifyExpires"
    ),

    Staff.find({ school: schoolId }).select("-password"),

    Parent.find({ school: schoolId }).select(
      "-password -emailVerifyToken -emailVerifyExpires"
    ),

    Admin.find({ school: schoolId }).select(
      "-password -passwordResetToken -passwordResetExpires"
    ),

    Class.find({ school: schoolId })
      .populate("classTeacher", "firstName lastName email")
      .populate("academicSession", "name isCurrent"),

    AcademicSession.find({ school: schoolId }).sort({
      startDate: -1,
    }),

    Enrollment.find({ school: schoolId })
      .populate("student", "firstName lastName email registrationNumber")
      .populate("class", "name level arm")
      .populate("academicSession", "name"),

    Attendance.find({ school: schoolId })
      .populate("student", "firstName lastName registrationNumber")
      .populate("class", "name level arm")
      .populate("academicSession", "name")
      .populate("recordedBy", "firstName lastName")
      .sort({ date: -1 }),
  ]);

  return {
    school,

    stats: {
      students: students.length,
      teachers: teachers.length,
      staff: staff.length,
      parents: parents.length,
      admins: admins.length,
      classes: classes.length,
      academicSessions: academicSessions.length,
      enrollments: enrollments.length,
      attendanceRecords: attendance.length,
    },

    students,
    teachers,
    staff,
    parents,
    admins,
    classes,
    academicSessions,
    enrollments,
    attendance,
  };
};

const getAllSchools = async () => {
  const schools = await School.find()
    .sort({ createdAt: -1 });

  return schools;
};

const toggleSchoolStatus = async (schoolId, userId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    const error = new Error("School not found");
    error.statusCode = 404;
    throw error;
  }

  school.isActive = !school.isActive;
  school.lastModifiedBy = userId;

  await school.save();

  return school;
};

const updateSchool = async (schoolId, data, userId) => {
  const school = await School.findByIdAndUpdate(
    schoolId,
    {
      ...data,
      lastModifiedBy: userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!school) {
    const error = new Error("School not found");
    error.statusCode = 404;
    throw error;
  }

  return school;
};

module.exports = {
  createSchool,
  getSchoolById,
  getSchoolDetails,
  getAllSchools,
  updateSchool,
  toggleSchoolStatus,
};
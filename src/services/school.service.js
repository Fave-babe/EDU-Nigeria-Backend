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

// ======================================================
// PUBLIC SCHOOL REGISTRATION
// ======================================================

const registerSchoolApplication = async (data) => {
  const {
    adminFullName,
    adminEmail,
    adminPassword,
    ...schoolData
  } = data;

  if (!adminFullName || !adminEmail || !adminPassword) {
    const error = new Error(
      "Proprietor/Admin name, email and password are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedAdminEmail = adminEmail.toLowerCase().trim();

  const existingAdmin = await Admin.findOne({
    email: normalizedAdminEmail,
  });

  if (existingAdmin) {
    const error = new Error(
      "An account with this admin email already exists"
    );
    error.statusCode = 409;
    throw error;
  }

  const normalizedSchoolEmail = schoolData.email
    ?.toLowerCase()
    .trim();

  const existingSchool = await School.findOne({
    email: normalizedSchoolEmail,
  });

  if (existingSchool) {
    const error = new Error(
      "A school with this email already exists"
    );
    error.statusCode = 409;
    throw error;
  }

  // Create school application as pending
  const school = await School.create({
    ...schoolData,
    email: normalizedSchoolEmail,
    status: "pending",
    isActive: false,
  });

  try {
    // Create the school administrator account,
    // but keep it inactive until the school is approved.
    await Admin.create({
      fullName: adminFullName.trim(),
      email: normalizedAdminEmail,
      password: adminPassword,
      school: school._id,
      role: ROLES.ADMIN,
      isActive: false,
    });
  } catch (err) {
    // Roll back the school if admin creation fails
    await School.findByIdAndDelete(school._id);
    throw err;
  }

  return school;
};

// ======================================================
// GET SCHOOL
// ======================================================

const getSchoolById = async (schoolId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    const error = new Error("School not found");
    error.statusCode = 404;
    throw error;
  }

  return school;
};

// ======================================================
// GET SCHOOL DETAILS
// ======================================================

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
      .populate(
        "student",
        "firstName lastName email registrationNumber"
      )
      .populate("class", "name level arm")
      .populate("academicSession", "name"),

    Attendance.find({ school: schoolId })
      .populate(
        "student",
        "firstName lastName registrationNumber"
      )
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

// ======================================================
// GET ALL SCHOOLS
// ======================================================

const getAllSchools = async () => {
  const schools = await School.find().sort({
    createdAt: -1,
  });

  return schools;
};

// ======================================================
// GET PENDING SCHOOL APPLICATIONS
// ======================================================

const getPendingSchoolApplications = async () => {
  const schools = await School.find({
    status: "pending",
  }).sort({
    createdAt: -1,
  });

  return schools;
};

// ======================================================
// APPROVE SCHOOL
// ======================================================

const approveSchool = async (schoolId, userId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    const error = new Error("School not found");
    error.statusCode = 404;
    throw error;
  }

  if (school.status !== "pending") {
    const error = new Error(
      "Only pending school applications can be approved"
    );
    error.statusCode = 400;
    throw error;
  }

  school.status = "approved";
  school.isActive = true;
  school.lastModifiedBy = userId;

  await school.save();

  // Activate the school's administrator account
  await Admin.updateMany(
    { school: school._id },
    {
      $set: {
        isActive: true,
      },
    }
  );

  return school;
};

// ======================================================
// REJECT SCHOOL
// ======================================================

const rejectSchool = async (schoolId, userId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    const error = new Error("School not found");
    error.statusCode = 404;
    throw error;
  }

  if (school.status !== "pending") {
    const error = new Error(
      "Only pending school applications can be rejected"
    );
    error.statusCode = 400;
    throw error;
  }

  school.status = "rejected";
  school.isActive = false;
  school.lastModifiedBy = userId;

  await school.save();

  // Keep the admin account but prevent login
  await Admin.updateMany(
    { school: school._id },
    {
      $set: {
        isActive: false,
      },
    }
  );

  return school;
};

// ======================================================
// TOGGLE SCHOOL STATUS
// ======================================================

const toggleSchoolStatus = async (schoolId, userId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    const error = new Error("School not found");
    error.statusCode = 404;
    throw error;
  }

  if (school.status !== "approved") {
    const error = new Error(
      "Only approved schools can be activated or deactivated"
    );
    error.statusCode = 400;
    throw error;
  }

  school.isActive = !school.isActive;
  school.lastModifiedBy = userId;

  await school.save();

  return school;
};

// ======================================================
// UPDATE SCHOOL
// ======================================================

const updateSchool = async (schoolId, data, userId) => {
  // Prevent normal school editing from changing approval state
  const { status, isActive, ...schoolData } = data;

  const school = await School.findByIdAndUpdate(
    schoolId,
    {
      ...schoolData,
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

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  registerSchoolApplication,
  getSchoolById,
  getSchoolDetails,
  getAllSchools,
  getPendingSchoolApplications,
  approveSchool,
  rejectSchool,
  updateSchool,
  toggleSchoolStatus,
};
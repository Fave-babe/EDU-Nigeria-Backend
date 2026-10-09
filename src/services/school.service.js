
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
// HELPER: CREATE SERVICE ERROR
// ======================================================

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// ======================================================
// PUBLIC SCHOOL REGISTRATION
// ======================================================

const registerSchoolApplication = async (data) => {
  const {
    name,
    schoolType,
    email,
    password,
    phone,
    address,
    city,
    state,
    country,
    logo,
  } = data;

  if (
    !name?.trim() ||
    !schoolType ||
    !email?.trim() ||
    !password ||
    !phone?.trim() ||
    !address?.trim()
  ) {
    throw createError(
      "School name, type, email, password, phone and address are required."
    );
  }

  if (password.length < 8) {
    throw createError(
      "School password must be at least 8 characters long."
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingSchool = await School.findOne({
    email: normalizedEmail,
  });

  if (existingSchool) {
    throw createError(
      "A school with this email already exists.",
      409
    );
  }

  const school = await School.create({
    name: name.trim(),
    schoolType,
    email: normalizedEmail,
    password,
    phone: phone.trim(),
    address: address.trim(),
    city: city?.trim(),
    state: state?.trim(),
    country: country?.trim() || "Nigeria",
    logo: logo || null,
    status: "pending",
    isActive: false,
  });

  return school;
};

// ======================================================
// GET SCHOOL BY ID
// ======================================================

const getSchoolById = async (schoolId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    throw createError("School not found.", 404);
  }

  return school;
};

// ======================================================
// GET SCHOOL DETAILS
// ======================================================

const getSchoolDetails = async (schoolId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    throw createError("School not found.", 404);
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
// SUPER ADMIN
// ======================================================

const getAllSchools = async () => {
  return School.find().sort({ createdAt: -1 });
};

// ======================================================
// GET PLATFORM OVERVIEW
// SUPER ADMIN ONLY
// ======================================================

const getPlatformOverview = async () => {
  const Bursar = require("../models/Bursar.model");

  // Get all schools without exposing school passwords.
  const schools = await School.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  // Get statistics for each school.
  const schoolsWithStats = await Promise.all(
    schools.map(async (school) => {
      const [
        students,
        teachers,
        staff,
        parents,
        admins,
        bursars,
        classes,
        academicSessions,
        enrollments,
        attendanceRecords,
      ] = await Promise.all([
        Student.countDocuments({ school: school._id }),
        Teacher.countDocuments({ school: school._id }),
        Staff.countDocuments({ school: school._id }),
        Parent.countDocuments({ school: school._id }),
        Admin.countDocuments({ school: school._id }),
        Bursar.countDocuments({ school: school._id }),
        Class.countDocuments({ school: school._id }),
        AcademicSession.countDocuments({ school: school._id }),
        Enrollment.countDocuments({ school: school._id }),
        Attendance.countDocuments({ school: school._id }),
      ]);

      return {
        ...school,

        statistics: {
          students,
          teachers,
          staff,
          parents,
          admins,
          bursars,
          classes,
          academicSessions,
          enrollments,
          attendanceRecords,
        },
      };
    })
  );

  // Calculate platform-wide totals.
  const summary = {
    totalSchools: schoolsWithStats.length,

    approvedSchools: schoolsWithStats.filter(
      (school) => school.status === "approved"
    ).length,

    pendingSchools: schoolsWithStats.filter(
      (school) => school.status === "pending"
    ).length,

    rejectedSchools: schoolsWithStats.filter(
      (school) => school.status === "rejected"
    ).length,

    activeSchools: schoolsWithStats.filter(
      (school) => school.isActive === true
    ).length,

    inactiveSchools: schoolsWithStats.filter(
      (school) => school.isActive !== true
    ).length,

    totalStudents: 0,
    totalTeachers: 0,
    totalStaff: 0,
    totalParents: 0,
    totalAdmins: 0,
    totalBursars: 0,
    totalClasses: 0,
    totalAcademicSessions: 0,
    totalEnrollments: 0,
    totalAttendanceRecords: 0,
  };

  schoolsWithStats.forEach((school) => {
    summary.totalStudents += school.statistics.students;
    summary.totalTeachers += school.statistics.teachers;
    summary.totalStaff += school.statistics.staff;
    summary.totalParents += school.statistics.parents;
    summary.totalAdmins += school.statistics.admins;
    summary.totalBursars += school.statistics.bursars;
    summary.totalClasses += school.statistics.classes;

    summary.totalAcademicSessions +=
      school.statistics.academicSessions;

    summary.totalEnrollments +=
      school.statistics.enrollments;

    summary.totalAttendanceRecords +=
      school.statistics.attendanceRecords;
  });

  return {
    summary,
    schools: schoolsWithStats,
  };
};

// ======================================================
// GET PENDING SCHOOL APPLICATIONS
// SUPER ADMIN
// ======================================================

const getPendingSchoolApplications = async () => {
  return School.find({ status: "pending" }).sort({
    createdAt: -1,
  });
};

// ======================================================
// APPROVE SCHOOL
// SUPER ADMIN ONLY
// ======================================================

const approveSchool = async (schoolId, userId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    throw createError("School not found.", 404);
  }

  if (school.status !== "pending") {
    throw createError(
      "Only pending school applications can be approved."
    );
  }

  school.status = "approved";
  school.isActive = true;
  school.lastModifiedBy = userId;

  await school.save();

  return school;
};

// ======================================================
// SET UP SCHOOL ADMIN CREDENTIALS
// SUPER ADMIN ONLY
// ======================================================

const setupSchoolAdminCredentials = async (
  schoolId,
  fullName,
  email,
  password
) => {
  // Find the school.
  const school = await School.findById(schoolId);

  if (!school) {
    throw createError("School not found.", 404);
  }

  // Only approved schools can have administrator accounts.
  if (school.status !== "approved") {
    throw createError(
      "Only approved schools can have administrator accounts."
    );
  }

  if (school.isActive !== true) {
    throw createError("This school is currently inactive.");
  }

  // Validate the administrator's information.
  if (
    typeof fullName !== "string" ||
    !fullName.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    throw createError(
      "Administrator name, email and password are required."
    );
  }

  if (password.length < 8) {
    throw createError(
      "Administrator password must be at least 8 characters long."
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  // The administrator must use a separate email from the school.
  if (
    normalizedEmail ===
    String(school.email || "").toLowerCase().trim()
  ) {
    throw createError(
      "Use a separate email address for the school administrator."
    );
  }

  // Find an existing Admin account belonging to this school.
  const existingAdmin = await Admin.findOne({
    school: school._id,
  });

  // Check whether another Admin account already uses this email.
  // Exclude the current school's Admin from the duplicate check.
  const adminEmailQuery = {
    email: normalizedEmail,
  };

  if (existingAdmin) {
    adminEmailQuery._id = {
      $ne: existingAdmin._id,
    };
  }

  const duplicateAdmin = await Admin.findOne(adminEmailQuery);

  if (duplicateAdmin) {
    throw createError(
      "This email address is already registered to another administrator. Please use a different email.",
      409
    );
  }

  // Check the other account types.
  // These are separate models because the project has no generic User model.
  const otherAccountModels = [
    Teacher,
    Parent,
    Student,
    Staff,
    require("../models/Bursar.model"),
    require("../models/SuperAdmin.model"),
    require("../models/Counsellor.model"),
  ];

  for (const Model of otherAccountModels) {
    const existingAccount = await Model.findOne({
      email: normalizedEmail,
    });

    if (existingAccount) {
      throw createError(
        "This email address is already registered to another account. Please use a different email.",
        409
      );
    }
  }

  // Update the existing administrator if the school already has one.
  if (existingAdmin) {
    existingAdmin.fullName = fullName.trim();
    existingAdmin.email = normalizedEmail;
    existingAdmin.password = password;
    existingAdmin.role = ROLES.ADMIN;
    existingAdmin.isActive = true;

    // Save so the Admin model's password-hashing hook can run.
    await existingAdmin.save();

    return existingAdmin;
  }

  // Otherwise, create a new administrator account.
  const admin = await Admin.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    school: school._id,
    role: ROLES.ADMIN,
    isActive: true,
  });

  return admin;
};

// ======================================================
// REJECT SCHOOL APPLICATION
// SUPER ADMIN ONLY
// ======================================================

const rejectSchool = async (schoolId, userId, reason = "") => {
  const school = await School.findById(schoolId);

  if (!school) {
    throw createError("School not found.", 404);
  }

  if (school.status !== "pending") {
    throw createError(
      "Only pending school applications can be rejected."
    );
  }

  school.status = "rejected";
  school.isActive = false;
  school.lastModifiedBy = userId;

  // Save the reason only if the School schema defines this field.
  if (school.schema.path("rejectionReason")) {
    school.rejectionReason = reason;
  }

  await school.save();

  // Deactivate any existing administrators for this school.
  await Admin.updateMany(
    { school: school._id },
    { $set: { isActive: false } }
  );

  return school;
};

// ======================================================
// TOGGLE SCHOOL STATUS
// SUPER ADMIN ONLY
// ======================================================

const toggleSchoolStatus = async (schoolId, userId) => {
  const school = await School.findById(schoolId);

  if (!school) {
    throw createError("School not found.", 404);
  }

  if (school.status !== "approved") {
    throw createError(
      "Only approved schools can have their status changed."
    );
  }

  school.isActive = !school.isActive;
  school.lastModifiedBy = userId;

  await school.save();

  // Keep administrators' active status in sync with the school.
  await Admin.updateMany(
    { school: school._id },
    { $set: { isActive: school.isActive } }
  );

  return school;
};

// ======================================================
// UPDATE SCHOOL
// ======================================================

const updateSchool = async (schoolId, data, userId) => {
  // Approval, activation and password changes are handled separately.
  const {
    status,
    isActive,
    password,
    ...schoolData
  } = data;

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
    throw createError("School not found.", 404);
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
    getPlatformOverview,
  getPendingSchoolApplications,
  approveSchool,
  rejectSchool,
  updateSchool,
  toggleSchoolStatus,
  setupSchoolAdminCredentials,
};


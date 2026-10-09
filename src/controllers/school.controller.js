const schoolService = require("../services/school.service");
const api = require("../utils/apiResponse");
const School = require("../models/School.model");

// ======================================================
// PUBLIC SCHOOL REGISTRATION
// ======================================================

exports.registerSchoolApplication = async (req, res, next) => {
  try {
    const school = await schoolService.registerSchoolApplication(
      req.body
    );

    api.created(
      res,
      { school },
      "School application submitted successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// GET SCHOOL
// ======================================================

exports.getSchool = async (req, res, next) => {
  try {
    const school = await schoolService.getSchoolById(
      req.params.id
    );

    api.success(
      res,
      { school },
      "School retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// GET SCHOOL DETAILS
// ======================================================

exports.getSchoolDetails = async (req, res, next) => {
  try {
    const details = await schoolService.getSchoolDetails(
      req.params.id
    );

    api.success(
      res,
      { details },
      "School details retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// UPDATE SCHOOL
// ======================================================

exports.updateSchool = async (req, res, next) => {
  try {
    const school = await schoolService.updateSchool(
      req.params.id,
      req.body,
      req.user._id
    );

    api.success(
      res,
      { school },
      "School updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// GET ALL SCHOOLS
// SUPER ADMIN ONLY
// ======================================================

exports.getAllSchools = async (req, res, next) => {
  try {
    const schools = await schoolService.getAllSchools();

    api.success(
      res,
      { schools },
      "Schools retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// GET PLATFORM OVERVIEW
// SUPER ADMIN ONLY
// ======================================================

exports.getPlatformOverview = async (req, res, next) => {
  try {
    const overview = await schoolService.getPlatformOverview();

    api.success(
      res,
      { overview },
      "Platform overview retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// GET PENDING SCHOOL APPLICATIONS
// SUPER ADMIN ONLY
// ======================================================

exports.getPendingSchoolApplications = async (
  req,
  res,
  next
) => {
  try {
    const schools =
      await schoolService.getPendingSchoolApplications();

    api.success(
      res,
      { schools },
      "Pending school applications retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// APPROVE SCHOOL
// SUPER ADMIN ONLY
// ======================================================

exports.approveSchool = async (req, res, next) => {
  try {
    const school = await schoolService.approveSchool(
      req.params.id,
      req.user._id
    );

    api.success(
      res,
      { school },
      "School approved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// REJECT SCHOOL
// SUPER ADMIN ONLY
// ======================================================

exports.rejectSchool = async (req, res, next) => {
  try {
    const school = await schoolService.rejectSchool(
      req.params.id,
      req.user._id
    );

    api.success(
      res,
      { school },
      "School application rejected"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// ACTIVATE / DEACTIVATE SCHOOL
// SUPER ADMIN ONLY
// ======================================================

exports.toggleSchoolStatus = async (req, res, next) => {
  try {
    const school =
      await schoolService.toggleSchoolStatus(
        req.params.id,
        req.user._id
      );

    api.success(
      res,
      { school },
      "School status updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// SET SCHOOL ADMIN CREDENTIALS
// SUPER ADMIN ONLY
// ======================================================

exports.setupSchoolAdminCredentials = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const admin =
      await schoolService.setupSchoolAdminCredentials(
        req.params.id,
        fullName,
        email,
        password
      );

    api.success(
      res,
      {
        admin: {
          _id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          school: admin.school,
          role: admin.role,
          isActive: admin.isActive,
        },
      },
      "School login credentials set successfully"
    );
  } catch (err) {
    next(err);
  }
};

// ======================================================
// PUBLIC SCHOOL LIST
// ======================================================

exports.getPublicSchools = async (req, res, next) => {
  try {
    const schools = await School.find(
      {
        isActive: true,
        $or: [
          { status: "approved" },
          { status: { $exists: false } },
        ],
      },
      {
        name: 1,
        schoolType: 1,
      }
    ).sort({
      name: 1,
    });

    api.success(
      res,
      { schools },
      "Schools retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};
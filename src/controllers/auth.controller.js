const Admin = require("../models/Admin.model");
const Teacher = require("../models/Teacher.model");
const Parent = require("../models/Parent.model");
const Student = require("../models/Student.model");
const Bursar = require("../models/Bursar.model");
const SuperAdmin = require("../models/SuperAdmin.model");
const Staff = require("../models/Staff.model");
const Counsellor = require("../models/Counsellor.model");
const School = require("../models/School.model");

const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const api = require("../utils/apiResponse");

const { ROLES } = require("../config/constant");

// =========================================================
// MODELS BY ROLE
// =========================================================

const MODELS_BY_ROLE = {
  [ROLES.ADMIN]: Admin,
  [ROLES.TEACHER]: Teacher,
  [ROLES.PARENT]: Parent,
  [ROLES.STUDENT]: Student,
  [ROLES.SUPER_ADMIN]: SuperAdmin,
  [ROLES.BURSAR]: Bursar,
  [ROLES.COUNSELLOR]: Counsellor,
  [ROLES.STAFF]: Staff,
};

// =========================================================
// SCHOOL-BASED ROLES
// =========================================================

const SCHOOL_ROLES = [
  ROLES.ADMIN,
  ROLES.TEACHER,
  ROLES.PARENT,
  ROLES.STUDENT,
  ROLES.BURSAR,
  ROLES.COUNSELLOR,
  ROLES.STAFF,
];

// =========================================================
// SIGN JWT
// =========================================================

const signToken = (id, role) =>
  jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

// =========================================================
// REGISTER
// =========================================================

exports.register = async (req, res, next) => {
  try {
    const { role, email, password, school, ...rest } = req.body;
    const normalizedRole = role?.toLowerCase().trim();

    // Students cannot create their own accounts
    if (normalizedRole === ROLES.STUDENT) {
      return next(
        new AppError(
          "Students cannot register themselves. Please contact your school administrator.",
          403,
        ),
      );
    }

    const Model = MODELS_BY_ROLE[normalizedRole];

    if (!Model) {
      return next(new AppError("Invalid role", 400));
    }

    // Admin and Super Admin cannot register publicly
    if (
      normalizedRole === ROLES.ADMIN ||
      normalizedRole === ROLES.SUPER_ADMIN
    ) {
      return next(
        new AppError(
          "Admin and Super Admin accounts cannot be created through public registration",
          403,
        ),
      );
    }

    // Validate school for school-based roles
    if (SCHOOL_ROLES.includes(normalizedRole)) {
      if (!school) {
        return next(new AppError("School is required for registration", 400));
      }

      const schoolExists = await School.findOne({
        _id: school,
        status: { $ne: "inactive" },
      });

      if (!schoolExists) {
        return next(new AppError("School not found or is inactive", 400));
      }
    }

    // Normalize email
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return next(new AppError("Email is required", 400));
    }

    // Password validation
    if (!password) {
      return next(new AppError("Password is required", 400));
    }

    // Check duplicate email
    const existing = await Model.findOne({
      email: normalizedEmail,
    });

    if (existing) {
      return next(new AppError("Email already in use", 409));
    }

    // Build user data
    const userData = {
      email: normalizedEmail,
      password,
      role: normalizedRole,
      ...rest,
    };

    // Assign school
    if (SCHOOL_ROLES.includes(normalizedRole)) {
      userData.school = school;
    }

    // Staff validation
    if (normalizedRole === ROLES.STAFF) {
      if (!userData.fullName) {
        return next(
          new AppError("Full name is required for staff registration", 400),
        );
      }
    }

    // Create user
    const user = await Model.create(userData);

    // Create token
    const token = signToken(user._id, normalizedRole);

    // Populate school only for school-based roles
    if (SCHOOL_ROLES.includes(normalizedRole) && user.school) {
      await user.populate("school");
    }

    // Response
    api.created(
      res,
      {
        token,
        user,
        role: normalizedRole,
      },
      `${normalizedRole} account created`,
    );
  } catch (err) {
    if (err?.code === 11000) {
      return next(new AppError("Email already in use", 409));
    }

    next(err);
  }
};

// =========================================================
// LOGIN
// =========================================================

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("=================================");
    console.log("LOGIN ATTEMPT");
    console.log("Email:", email);
    console.log("Password provided:", !!password);

    // Validation
    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Search all user models
    const results = await Promise.all(
      Object.entries(MODELS_BY_ROLE).map(async ([roleName, Model]) => {
        try {
          const found = await Model.findOne({
            email: normalizedEmail,
          }).select("+password");

          return {
            roleName,
            found,
          };
        } catch (err) {
          console.error(`Error checking ${roleName}:`, err.message);

          return {
            roleName,
            found: null,
          };
        }
      }),
    );

    const match = results.find((result) => result.found);

    const user = match?.found || null;
    const role = match?.roleName || null;

    console.log("User found:", !!user);
    console.log("Role:", role);

    // User not found
    if (!user) {
      console.log("NO USER FOUND WITH THIS EMAIL");

      return next(new AppError("Invalid email or password", 401));
    }

    // Password
    if (!user.password) {
      console.log("PASSWORD WAS NOT LOADED FROM DATABASE");

      return next(new AppError("Invalid email or password", 401));
    }

    // Password method
    if (typeof user.comparePassword !== "function") {
      console.error("comparePassword METHOD DOES NOT EXIST");

      return next(new AppError("Authentication configuration error", 500));
    }

    // Check password
    const passwordMatch = await user.comparePassword(password);

    console.log("Password matches:", passwordMatch);

    if (!passwordMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Active account
    if (user.isActive === false) {
      return next(new AppError("Account deactivated. Contact support.", 401));
    }

    // Update last login
    user.lastLogin = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    // Populate school only for school-based roles
    if (SCHOOL_ROLES.includes(role) && user.school) {
      await user.populate("school");
    }

    // Create token
    const token = signToken(user._id, role);

    // Remove password
    const userData = user.toJSON();

    delete userData.password;

    // Success
    console.log("LOGIN SUCCESSFUL");
    console.log("Role:", role);
    console.log("School:", user.school?.name || "N/A");
    console.log("=================================");

    api.success(
      res,
      {
        token,
        user: {
          ...userData,
          role,
        },
      },
      "Login successful",
    );
  } catch (err) {
    console.error("LOGIN CONTROLLER ERROR:", err);

    next(err);
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current password",
      });
    }

    const Model = MODELS_BY_ROLE[req.user.role];

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const user = await Model.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;

    if (user.schema.path("passwordChangedAt")) {
      user.passwordChangedAt = new Date();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// =========================================================
// GET CURRENT USER
// =========================================================

exports.getMe = async (req, res, next) => {
  try {
    const role = req.user.role;

    const Model = MODELS_BY_ROLE[role];

    if (!Model) {
      return next(new AppError("Invalid role", 400));
    }

    // Build query
    let query = Model.findById(req.user._id);

    // Only populate school for school-based roles
    if (SCHOOL_ROLES.includes(role)) {
      query = query.populate("school");
    }

    // Get user
    const user = await query;

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Remove password
    const userData = user.toJSON();

    delete userData.password;

    // Success
    api.success(
      res,
      {
        user: {
          ...userData,
          role,
        },
        role,
      },
      "Profile retrieved",
    );
  } catch (err) {
    console.error("GET ME ERROR:", err);

    next(err);
  }
};

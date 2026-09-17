
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");

const Student = require("../models/Student.model");
const Parent = require("../models/Parent.model");
const Teacher = require("../models/Teacher.model");
const Staff = require("../models/Staff.model");
const Bursar = require("../models/Bursar.model");
const Counsellor = require("../models/Counsellor.model");
const Admin = require("../models/Admin.model");
const SuperAdmin = require("../models/SuperAdmin.model");

const { ROLES } = require("../config/constant");

// Map each role to its corresponding model
const MODELS_BY_ROLE = {
  [ROLES.STUDENT]: Student,
  [ROLES.PARENT]: Parent,
  [ROLES.TEACHER]: Teacher,
  [ROLES.STAFF]: Staff,
  [ROLES.BURSAR]: Bursar,
  [ROLES.COUNSELLOR]: Counsellor,
  [ROLES.ADMIN]: Admin,
  [ROLES.SUPER_ADMIN]: SuperAdmin,
};


// ==========================================
// PROTECT
// ==========================================

const protect = async (req, res, next) => {
  try {
    // 1. Get authorization header
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return next(
        new AppError("Not authenticated. Please log in.", 401)
      );
    }

    // 2. Extract token
    const token = auth.split(" ")[1];

    if (!token) {
      return next(
        new AppError("Authentication token is missing.", 401)
      );
    }

    // 3. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4. Find model based on role
    const Model = MODELS_BY_ROLE[decoded.role];

    if (!Model) {
      return next(
        new AppError("Invalid role in token.", 401)
      );
    }

    // 5. Find user
   let userQuery = Model.findById(decoded.id)
  .select("+passwordChangedAt");

if (Model.schema.path("school")) {
  userQuery = userQuery.populate(
    "school",
    "name schoolType email phone address city state country"
  );
}

const user = await userQuery;

    if (!user) {
      return next(
        new AppError("User no longer exists.", 404)
      );
    }

    // 6. Check account status
    if (user.isActive === false) {
      return next(
        new AppError("Account has been deactivated.", 401)
      );
    }

    // 7. Check whether password was changed
    if (
      typeof user.changePasswordAfter === "function" &&
      user.changePasswordAfter(decoded.iat)
    ) {
      return next(
        new AppError(
          "Password recently changed. Please log in again.",
          401
        )
      );
    }

    // 8. Attach authenticated user to request
    req.user = user;

    // Always trust the role from the verified JWT
    req.user.role = decoded.role;

    // 9. Continue
    next();

  } catch (err) {

    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
      return next(
        new AppError("Invalid token.", 401)
      );
    }

    // Expired JWT
    if (err.name === "TokenExpiredError") {
      return next(
        new AppError(
          "Token expired. Please log in again.",
          401
        )
      );
    }

    // Any other error
    next(err);
  }
};


// ==========================================
// RESTRICT TO ROLES
// ==========================================

const RestrictTo = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return next(
        new AppError(
          "Not authenticated. Please log in.",
          401
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You are not permitted to perform this operation.",
          403
        )
      );
    }

    next();
  };
};


// ==========================================
// ROLE SHORTCUTS
// ==========================================

const adminOnly = RestrictTo(
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN
);

const superAdminOnly = RestrictTo(
  ROLES.SUPER_ADMIN
);


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  protect,
  RestrictTo,
  adminOnly,
  superAdminOnly,
};


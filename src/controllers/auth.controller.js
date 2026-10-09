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
}
);

// =========================================================
// REGISTER
// Public registration: Student, Parent, Teacher, Staff
// =========================================================

exports.register = async (req, res, next) => {
try {
const {
role,
email,
password,
school,
...rest
} = req.body;


const normalizedRole = role?.toLowerCase().trim();

const PUBLIC_REGISTRATION_ROLES = [
  ROLES.STUDENT,
  ROLES.PARENT,
  ROLES.TEACHER,
  ROLES.STAFF,
];

if (!PUBLIC_REGISTRATION_ROLES.includes(normalizedRole)) {
  return next(
    new AppError(
      "You cannot register this account type through the public registration page.",
      403
    )
  );
}

const Model = MODELS_BY_ROLE[normalizedRole];

if (!Model) {
  return next(new AppError("Invalid registration role.", 400));
}

const normalizedEmail = email?.toLowerCase().trim();

if (!normalizedEmail) {
  return next(new AppError("Email is required.", 400));
}

if (!password || password.length < 8) {
  return next(
    new AppError(
      "Password must be at least 8 characters long.",
      400
    )
  );
}

if (!school) {
  return next(new AppError("School is required.", 400));
}

const schoolExists = await School.findOne({
  _id: school,
  status: "approved",
  isActive: true,
});

if (!schoolExists) {
  return next(
    new AppError(
      "School not found, not approved, or inactive.",
      400
    )
  );
}

if (
  [ROLES.STUDENT, ROLES.PARENT, ROLES.TEACHER].includes(
    normalizedRole
  )
) {
  if (!rest.firstName?.trim() || !rest.lastName?.trim()) {
    return next(
      new AppError(
        "First name and last name are required.",
        400
      )
    );
  }
}

if (normalizedRole === ROLES.STUDENT && !rest.gender) {
  return next(
    new AppError("Gender is required for student registration.", 400)
  );
}

if (normalizedRole === ROLES.STAFF && !rest.fullName?.trim()) {
  return next(
    new AppError("Full name is required for staff registration.", 400)
  );
}

const existing = await Model.findOne({
  email: normalizedEmail,
});

if (existing) {
  return next(new AppError("Email already in use.", 409));
}

const userData = {
  email: normalizedEmail,
  password,
  school: schoolExists._id,
};

if (normalizedRole === ROLES.STUDENT) {
  Object.assign(userData, {
    firstName: rest.firstName.trim(),
    lastName: rest.lastName.trim(),
    gender: rest.gender,
    previousSchool: rest.previousSchool?.trim() || undefined,
  });
}

if (normalizedRole === ROLES.PARENT) {
  Object.assign(userData, {
    firstName: rest.firstName.trim(),
    lastName: rest.lastName.trim(),
  });
}

if (normalizedRole === ROLES.TEACHER) {
  Object.assign(userData, {
    firstName: rest.firstName.trim(),
    lastName: rest.lastName.trim(),
  });
}

if (normalizedRole === ROLES.STAFF) {
  Object.assign(userData, {
    fullName: rest.fullName.trim(),
    phone: rest.phone?.trim() || undefined,
    staffRole: rest.staffRole?.trim() || undefined,
    role: ROLES.STAFF,
  });
}

const user = await Model.create(userData);

await user.populate("school");

const userDataResponse = user.toJSON();
delete userDataResponse.password;

return api.created(
  res,
  {
    user: {
      ...userDataResponse,
      role: normalizedRole,
    },
    role: normalizedRole,
  },
  `${normalizedRole} registration successful.`
);

} catch (err) {
if (err?.code === 11000) {
return next(new AppError("Email already in use.", 409));
}


return next(err);


}
};

// =========================================================
// LOGIN
// Supports SuperAdmin and school-based accounts.
// Admins use their own email and password.
// =========================================================

exports.login = async (req, res, next) => {
try {
const { email, password } = req.body;


if (!email?.trim() || !password) {
  return next(
    new AppError("Email and password are required.", 400)
  );
}

const normalizedEmail = email.toLowerCase().trim();

const LOGIN_ORDER = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.TEACHER,
  ROLES.BURSAR,
  ROLES.COUNSELLOR,
  ROLES.STAFF,
  ROLES.PARENT,
  ROLES.STUDENT,
];

let user = null;
let role = null;

for (const currentRole of LOGIN_ORDER) {
  const Model = MODELS_BY_ROLE[currentRole];

  if (!Model) {
    continue;
  }

  let query = Model.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (SCHOOL_ROLES.includes(currentRole)) {
    query = query.populate("school");
  }

  const found = await query;

  if (found) {
    user = found;
    role = currentRole;
    break;
  }
}

if (!user || !role) {
  return next(
    new AppError("Invalid email or password.", 401)
  );
}

if (user.isActive === false) {
  return next(
    new AppError("This account is deactivated.", 403)
  );
}

if (
  !user.password ||
  typeof user.comparePassword !== "function"
) {
  return next(
    new AppError("Invalid email or password.", 401)
  );
}

const passwordMatches = await user.comparePassword(password);

if (!passwordMatches) {
  return next(
    new AppError("Invalid email or password.", 401)
  );
}

if (SCHOOL_ROLES.includes(role)) {
  if (!user.school) {
    return next(
      new AppError(
        "This account is not linked to a school.",
        403
      )
    );
  }

  if (user.school.status !== "approved") {
    return next(
      new AppError(
        "This school has not been approved yet.",
        403
      )
    );
  }

  if (user.school.isActive !== true) {
    return next(
      new AppError(
        "This school account is inactive.",
        403
      )
    );
  }
}

if (user.schema.path("lastLogin")) {
  user.lastLogin = new Date();

  await user.save({
    validateBeforeSave: false,
  });
}

const token = signToken(user._id, role);

const userData = user.toJSON();
delete userData.password;

return api.success(
  res,
  {
    token,
    user: {
      ...userData,
      role,
    },
  },
  "Login successful"
);


} catch (err) {
console.error("LOGIN CONTROLLER ERROR:", err.message);
return next(err);
}
};

// =========================================================
// CHANGE PASSWORD
// =========================================================

exports.changePassword = async (req, res) => {
try {
const { currentPassword, newPassword } = req.body;


if (!currentPassword || !newPassword) {
  return res.status(400).json({
    success: false,
    message: "Current password and new password are required.",
  });
}

if (newPassword.length < 8) {
  return res.status(400).json({
    success: false,
    message: "New password must be at least 8 characters.",
  });
}

if (currentPassword === newPassword) {
  return res.status(400).json({
    success: false,
    message: "New password must be different from your current password.",
  });
}

const Model = MODELS_BY_ROLE[req.user.role];

if (!Model) {
  return res.status(400).json({
    success: false,
    message: "Invalid user role.",
  });
}

const user = await Model.findById(req.user.id).select("+password");

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User account not found.",
  });
}

const isPasswordCorrect =
  await user.comparePassword(currentPassword);

if (!isPasswordCorrect) {
  return res.status(401).json({
    success: false,
    message: "Current password is incorrect.",
  });
}

user.password = newPassword;

if (user.schema.path("passwordChangedAt")) {
  user.passwordChangedAt = new Date();
}

await user.save();

return res.status(200).json({
  success: true,
  message: "Password changed successfully.",
});


} catch (error) {
console.error("CHANGE PASSWORD ERROR:", error.message);


return res.status(500).json({
  success: false,
  message: "Failed to change password.",
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
  return next(new AppError("Invalid role.", 400));
}

// The auth middleware may expose either id or _id.
const userId = req.user.id || req.user._id;

let query = Model.findById(userId);

if (SCHOOL_ROLES.includes(role)) {
  query = query.populate("school");
}

const user = await query;

if (!user) {
  return next(new AppError("User not found.", 404));
}

const userData = user.toJSON();
delete userData.password;

return api.success(
  res,
  {
    user: {
      ...userData,
      role,
    },
    role,
  },
  "Profile retrieved"
);


} catch (err) {
console.error("GET ME ERROR:", err.message);
return next(err);
}
};

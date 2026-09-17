
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../config/constant");

const superAdminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please fill a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: [ROLES.SUPER_ADMIN],
      default: ROLES.SUPER_ADMIN,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    passwordChangedAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// HASH PASSWORD BEFORE SAVING
// ==========================================
superAdminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);

  // Only set this when an existing user's password is changed
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});


// ==========================================
// COMPARE LOGIN PASSWORD
// ==========================================

superAdminSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};


// ==========================================
// CHECK PASSWORD CHANGE AFTER JWT
// ==========================================

superAdminSchema.methods.changePasswordAfter = function (
  jwtTimestamp
) {
  if (this.passwordChangedAt) {
    return (
      parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      ) > jwtTimestamp
    );
  }

  return false;
};


// ==========================================
// REMOVE SENSITIVE FIELDS FROM JSON
// ==========================================

superAdminSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;

    return ret;
  },
});


module.exports = mongoose.model(
  "SuperAdmin",
  superAdminSchema
);


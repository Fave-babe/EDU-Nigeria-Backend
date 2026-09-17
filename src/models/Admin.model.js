const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../config/constant");

const adminSchema = new mongoose.Schema(
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

    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "Admin school is required"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: [ROLES.ADMIN],
      default: ROLES.ADMIN,
      required: true,
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

// =========================================================
// HASH PASSWORD BEFORE SAVING
// =========================================================

adminSchema.pre("save", async function () {
  // Do nothing if password has not changed
  if (!this.isModified("password")) {
    return;
  }

  // Hash password
  this.password = await bcrypt.hash(this.password, 12);

  // Don't set passwordChangedAt when account is first created
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});

// =========================================================
// COMPARE PASSWORD
// =========================================================

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// =========================================================
// CHECK WHETHER PASSWORD WAS CHANGED AFTER JWT WAS ISSUED
// =========================================================

adminSchema.methods.changePasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    return (
      parseInt(this.passwordChangedAt.getTime() / 1000, 10) >
      jwtTimestamp
    );
  }

  return false;
};

// =========================================================
// REMOVE SENSITIVE FIELDS FROM JSON RESPONSES
// =========================================================

adminSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;

    return ret;
  },
});

module.exports =
  mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { REGISTRATION_STATUS } = require("../config/constant");

const teacherSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
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
        "Please provide a valid email address",
      ],
    },

    emailVerifyToken: String,

    emailVerifyExpires: Date,

    registrationStatus: {
      type: String,
      enum: Object.values(REGISTRATION_STATUS),
      default: REGISTRATION_STATUS.INITIATED,
    },

    completedSteps: {
      personalInfo: {
        type: Boolean,
        default: false,
      },

      academicInfo: {
        type: Boolean,
        default: false,
      },
    },

    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "Teacher school is required"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },

    passwordChangedAt: Date,

    passwordResetToken: String,

    passwordResetExpires: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Full name
teacherSchema.virtual("fullName").get(function () {
  return `${this.lastName} ${this.firstName}`;
});

// Hash password before saving
teacherSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
teacherSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
teacherSchema.index({ email: 1 });
teacherSchema.index({ registrationStatus: 1 });
teacherSchema.index({ school: 1 });

// JSON transformation
teacherSchema.set("toJSON", {
  virtuals: true,

  transform: (_, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports =
  mongoose.models.Teacher ||
  mongoose.model("Teacher", teacherSchema);
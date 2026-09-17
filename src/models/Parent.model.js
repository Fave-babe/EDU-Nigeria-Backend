const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { REGISTRATION_STATUS } = require("../config/constant");

const parentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    // School this parent belongs to
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "Parent school is required"],
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
    },

    payment: {
      status: {
        type: String,
        enum: ["paid", "unpaid", "refunded"],
        default: "unpaid",
      },

      reference: String,

      amount: Number,

      paidAt: Date,

      method: String,

      rr: String,
    },

    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Full name
parentSchema.virtual("fullName").get(function () {
  return `${this.lastName} ${this.firstName}`;
});

// Hash password before saving
parentSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password during login
parentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
parentSchema.index({ registrationStatus: 1 });
parentSchema.index({ "payment.status": 1 });
parentSchema.index({ school: 1 });

// JSON response
parentSchema.set("toJSON", {
  virtuals: true,

  transform: (_, ret) => {
    delete ret.password;
    delete ret.emailVerifyToken;
    delete ret.emailVerifyExpires;

    return ret;
  },
});

module.exports = mongoose.model("Parent", parentSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
    },

    schoolType: {
      type: String,
      required: [true, "School type is required"],
      enum: ["Primary", "Secondary", "Primary & Secondary"],
    },

    email: {
      type: String,
      required: [true, "School email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    // School login password
    password: {
      type: String,
      minlength: 8,
      select: false,
    },

    phone: {
      type: String,
      required: [true, "School phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "School address is required"],
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      default: "Nigeria",
      trim: true,
    },

    logo: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },

    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password only when it has been changed.
schoolSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

// Verify a submitted password.
schoolSchema.methods.comparePassword = async function (
  candidatePassword
) {
  if (!this.password || !candidatePassword) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};

// Never return a password in JSON.
schoolSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

schoolSchema.index({ name: 1 });
schoolSchema.index({ schoolType: 1 });
schoolSchema.index({ status: 1 });
schoolSchema.index({ isActive: 1 });

module.exports =
  mongoose.models.School ||
  mongoose.model("School", schoolSchema);
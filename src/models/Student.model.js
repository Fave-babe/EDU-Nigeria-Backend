// const { required } = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  O_LEVEL_QUALIFICATIONS,
  O_LEVEL_GRADES,
  EXAM_TYPES,
  REGISTRATION_STATUS,
} = require("../config/constant");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      // required: [true, 'First name is required'],
      trim: true,
    },
    gender: {
      type: String,
      // required:   [true, 'Gender is required'],
      enum: ["Male", "Female"],
    },
    previousSchool: {
      type: String,
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
      personalInfo: { type: Boolean, default: false },
      academicInfo: { type: Boolean, default: false },
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
    setNumber: String,
    biometricVerification: { type: Boolean, default: false },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    notes: [
      {
        text: String,
        addedBy: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],

    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    school: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "School",
 required: [true, "Student school is required"],
},
admissionNo: {
  type: String,
  unique: true,
  sparse: true,
  uppercase: true,
  trim: true,
},

dob: {
  type: Date,
},

address: {
  type: String,
  trim: true,
},

session: {
  type: String,
  trim: true,
},

medicalNotes: {
  type: String,
  trim: true,
},
    password: {
      type: String,
      minlength: [6, "password must be atleast 6 characters"],
      select: false,
    },
  },
  { timestamps: true },
);

studentSchema.virtual("fullName").get(function () {
  return `${this.lastName} ${this.firstName}`;
});
studentSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});
studentSchema.methods.comparePassword = async function (student) {
  return bcrypt.compare(student, this.password);
};
studentSchema.index({ registrationNumber: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ registrationStatus: 1 });
studentSchema.index({ "payment.status": 1 });

studentSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.password;
    return ret;
  },
});
module.exports = mongoose.model("Student", studentSchema);

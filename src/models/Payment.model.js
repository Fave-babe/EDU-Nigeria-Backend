
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },

    bursar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bursar",
      required: [true, "Bursar is required"],
    },

    feeType: {
      type: String,
      enum: [
        "School Fees",
        "Transport Fee",
        "Uniform Fee",
        "Examination Fee",
        "Other",
      ],
      required: [true, "Fee type is required"],
    },

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Payment amount cannot be negative"],
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "POS", "Online"],
      required: [true, "Payment method is required"],
    },

    reference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "Refunded"],
      default: "Paid",
    },

    description: {
      type: String,
      trim: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ school: 1, paymentDate: -1 });
paymentSchema.index({ student: 1, paymentDate: -1 });
paymentSchema.index({ bursar: 1, paymentDate: -1 });

module.exports = mongoose.model("Payment", paymentSchema);


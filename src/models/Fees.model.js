const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
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

    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: [true, "Academic session is required"],
    },

    term: {
      type: String,
      enum: ["First Term", "Second Term", "Third Term"],
      required: [true, "Term is required"],
    },

    title: {
      type: String,
      required: [true, "Fee title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Fee amount is required"],
      min: [0, "Fee amount cannot be negative"],
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },

    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },

    status: {
      type: String,
      enum: [
        "unpaid",
        "partial",
        "paid",
        "overdue",
      ],
      default: "unpaid",
    },

    dueDate: {
      type: Date,
    },

    paymentReference: {
      type: String,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "bank_transfer",
        "card",
        "online",
        "other",
      ],
    },

    paidAt: {
      type: Date,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bursar",
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes
feeSchema.index({
  school: 1,
  student: 1,
});

feeSchema.index({
  student: 1,
  academicSession: 1,
  term: 1,
});

feeSchema.index({
  status: 1,
});

feeSchema.index({
  dueDate: 1,
});

// Automatically calculate balance and status
feeSchema.pre("save", function (next) {
  this.balance = Math.max(
    this.amount - this.amountPaid,
    0
  );

  if (this.amountPaid <= 0) {
    this.status = "unpaid";
  } else if (this.amountPaid < this.amount) {
    this.status = "partial";
  } else {
    this.status = "paid";
    this.paidAt = this.paidAt || new Date();
  }

  next();
});

module.exports = mongoose.model("Fee", feeSchema);
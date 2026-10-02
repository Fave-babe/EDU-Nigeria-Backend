const Fee = require("../models/Fees.model");
const School = require("../models/School.model");
const Student = require("../models/Student.model");
const AcademicSession = require("../models/AcademicSession.model");
const AppError = require("../utils/AppError");

class FeeService {
  // Create a fee
  async createFee(data) {
    const {
      school,
      student,
      academicSession,
      term,
      title,
      description,
      amount,
      dueDate,
      recordedBy,
    } = data;

    // Check school
    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    // Check student
    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      throw new AppError("Student not found", 404);
    }

    // Check academic session
    const session = await AcademicSession.findOne({
      _id: academicSession,
      school,
    });

    if (!session) {
      throw new AppError(
        "Academic session not found for this school",
        404
      );
    }

    if (amount <= 0) {
      throw new AppError(
        "Fee amount must be greater than zero",
        400
      );
    }

    const fee = await Fee.create({
      school,
      student,
      academicSession,
      term,
      title,
      description,
      amount,
      amountPaid: 0,
      balance: amount,
      status: "unpaid",
      dueDate,
      recordedBy,
    });

    return fee;
  }

  // Get fee by ID
  async findById(feeId) {
    const fee = await Fee.findById(feeId)
      .populate("school", "name")
      .populate(
        "student",
        "firstName lastName registrationNumber email"
      )
      .populate(
        "academicSession",
        "name startDate endDate"
      )
      .populate(
        "recordedBy",
        "fullName email"
      );

    if (!fee) {
      throw new AppError("Fee record not found", 404);
    }

    return fee;
  }

  // Get fees belonging to a student
  async findByStudent(studentId, filters = {}) {
    const student = await Student.findById(studentId);

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    const filter = {
      student: studentId,
    };

    if (filters.academicSession) {
      filter.academicSession = filters.academicSession;
    }

    if (filters.term) {
      filter.term = filters.term;
    }

    if (filters.status) {
      filter.status = filters.status;
    }

    return Fee.find(filter)
      .populate(
        "academicSession",
        "name startDate endDate"
      )
      .sort({ dueDate: 1, createdAt: -1 });
  }

  // Record a payment
  async recordPayment(feeId, data) {
    const fee = await Fee.findById(feeId);

    if (!fee) {
      throw new AppError("Fee record not found", 404);
    }

    const {
      amount,
      paymentReference,
      paymentMethod,
    } = data;

    if (!amount || amount <= 0) {
      throw new AppError(
        "Payment amount must be greater than zero",
        400
      );
    }

    if (amount > fee.balance) {
      throw new AppError(
        "Payment cannot be greater than the outstanding balance",
        400
      );
    }

    fee.amountPaid += Number(amount);
    fee.paymentReference = paymentReference;
    fee.paymentMethod = paymentMethod;

    fee.balance = Math.max(
      fee.amount - fee.amountPaid,
      0
    );

    if (fee.amountPaid === 0) {
      fee.status = "unpaid";
    } else if (fee.amountPaid < fee.amount) {
      fee.status = "partial";
    } else {
      fee.status = "paid";
      fee.paidAt = new Date();
    }

    await fee.save();

    return fee;
  }

  // Update fee
  async updateFee(feeId, data) {
    const fee = await Fee.findById(feeId);

    if (!fee) {
      throw new AppError("Fee record not found", 404);
    }

    const allowedFields = [
      "title",
      "description",
      "amount",
      "dueDate",
      "term",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        fee[field] = data[field];
      }
    });

    if (fee.amountPaid > fee.amount) {
      throw new AppError(
        "Fee amount cannot be less than amount already paid",
        400
      );
    }

    fee.balance = Math.max(
      fee.amount - fee.amountPaid,
      0
    );

    if (fee.amountPaid === 0) {
      fee.status = "unpaid";
    } else if (fee.amountPaid < fee.amount) {
      fee.status = "partial";
    } else {
      fee.status = "paid";
    }

    await fee.save();

    return fee;
  }

  // Get student's outstanding balance
  async getStudentBalance(studentId, academicSession, term) {
    const filter = {
      student: studentId,
    };

    if (academicSession) {
      filter.academicSession = academicSession;
    }

    if (term) {
      filter.term = term;
    }

    const result = await Fee.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: null,
          totalFees: {
            $sum: "$amount",
          },
          totalPaid: {
            $sum: "$amountPaid",
          },
          totalBalance: {
            $sum: "$balance",
          },
        },
      },
    ]);

    return (
      result[0] || {
        totalFees: 0,
        totalPaid: 0,
        totalBalance: 0,
      }
    );
  }

  // Get all fees
  async getAllFees(filters = {}) {
    const filter = {};

    if (filters.school) {
      filter.school = filters.school;
    }

    if (filters.student) {
      filter.student = filters.student;
    }

    if (filters.academicSession) {
      filter.academicSession =
        filters.academicSession;
    }

    if (filters.term) {
      filter.term = filters.term;
    }

    if (filters.status) {
      filter.status = filters.status;
    }

    return Fee.find(filter)
      .populate(
        "student",
        "firstName lastName registrationNumber"
      )
      .populate(
        "academicSession",
        "name"
      )
      .sort({ createdAt: -1 });
  }

  // Delete fee
  async deleteFee(feeId) {
    const fee = await Fee.findById(feeId);

    if (!fee) {
      throw new AppError("Fee record not found", 404);
    }

    if (fee.amountPaid > 0) {
      throw new AppError(
        "A fee with an existing payment cannot be deleted",
        400
      );
    }

    await fee.deleteOne();

    return fee;
  }
}

module.exports = new FeeService();
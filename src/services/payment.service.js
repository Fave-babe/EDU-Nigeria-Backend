
const Payment = require("../models/Payment.model");
const Student = require("../models/Student.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");
const Parent = require("../models/Parent.model");

class PaymentService {
 async createPayment(data) {
  const {
    school,
    student,
    bursar,
    amount,
    feeType,
    paymentMethod,
    reference,
    status,
    description,
    paymentDate,
  } = data;

  // Check school
  const existingSchool = await School.findById(school);

  if (!existingSchool) {
    throw new AppError("School not found", 404);
  }

  // Find student by MongoDB ID
  const existingStudent = await Student.findById(student);

  if (!existingStudent) {
    throw new AppError("Student not found", 404);
  }

  // Validate amount
  if (!amount || Number(amount) <= 0) {
    throw new AppError(
      "Payment amount must be greater than zero",
      400
    );
  }

  // Make sure the student belongs to the selected school
  if (
    existingStudent.school &&
    existingStudent.school.toString() !== school.toString()
  ) {
    throw new AppError(
      "This student does not belong to the selected school",
      400
    );
  }

  // Store the actual MongoDB student _id
  const paymentData = {
    school,
    student: existingStudent._id,
    bursar,
    amount: Number(amount),
    feeType,
    paymentMethod,
    status,
    description,
  };

  if (reference) {
    paymentData.reference = reference;
  }

  if (paymentDate) {
    paymentData.paymentDate = paymentDate;
  }

  const payment = await Payment.create(paymentData);

  return payment;
}
  async findById(paymentId) {
    const payment = await Payment.findById(paymentId)
      .populate("student", "firstName lastName registrationNumber")
      .populate("bursar", "fullName email")
      .populate("school", "name schoolType");

    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    return payment;
  }

  async findAll({
    school,
    student,
    status,
    page = 1,
    limit = 20,
  }) {
    const filter = {};

    if (school) {
      filter.school = school;
    }

    if (student) {
      filter.student = student;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate(
          "student",
          "firstName lastName registrationNumber"
        )
        .populate("bursar", "fullName")
        .populate("school", "name")
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(limit),

      Payment.countDocuments(filter),
    ]);

    return {
      payments,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getParentPayments(parentId) {
  const parent = await Parent.findById(parentId).populate("children");

  if (!parent) {
    throw new AppError("Parent not found", 404);
  }

  const studentIds = parent.children.map((child) => child._id);

  if (studentIds.length === 0) {
    return [];
  }

  return Payment.find({
    student: { $in: studentIds },
  })
    .populate(
      "student",
      "firstName lastName registrationNumber"
    )
    .populate("school", "name")
    .sort({ paymentDate: -1 });
}

async getParentRevenue(parentId) {
  const parent = await Parent.findById(parentId);

  if (!parent) {
    throw new AppError("Parent not found", 404);
  }

  const studentIds = parent.children || [];

  if (studentIds.length === 0) {
    return 0;
  }

  const result = await Payment.aggregate([
    {
      $match: {
        student: { $in: studentIds },
        status: "Paid",
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return result[0]?.total || 0;
}

  async getPaymentsBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    return Payment.find({ school: schoolId })
      .populate(
        "student",
        "firstName lastName registrationNumber"
      )
      .populate("bursar", "fullName")
      .sort({ paymentDate: -1 });
  }

  async getPaymentsByStudent(studentId) {
    const student = await Student.findById(studentId);

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    return Payment.find({ student: studentId })
      .populate("school", "name")
      .populate("bursar", "fullName")
      .sort({ paymentDate: -1 });
  }

  async getTodayPayments(schoolId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return Payment.find({
      school: schoolId,
      paymentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate(
        "student",
        "firstName lastName registrationNumber"
      )
      .sort({ paymentDate: -1 });
  }

  async getTotalRevenue(schoolId) {
    const result = await Payment.aggregate([
      {
        $match: {
          school: schoolId,
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return result[0]?.total || 0;
  }

  async getTodayRevenue(schoolId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Payment.aggregate([
      {
        $match: {
          school: schoolId,
          status: "Paid",
          paymentDate: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    return {
      total: result[0]?.total || 0,
      count: result[0]?.count || 0,
    };
  }
}

module.exports = new PaymentService();


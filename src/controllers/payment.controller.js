
const paymentService = require("../services/payment.service");

class PaymentController {
  // Create payment
  async createPayment(req, res, next) {
    try {
      const payment = await paymentService.createPayment(req.body);

      res.status(201).json({
        success: true,
        message: "Payment recorded successfully",
        payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getParentPayments(req, res, next) {
  try {
    const payments = await paymentService.getParentPayments(
      req.user._id
    );

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    next(error);
  }
}

async getParentRevenue(req, res, next) {
  try {
    const total = await paymentService.getParentRevenue(
      req.user._id
    );

    res.status(200).json({
      success: true,
      total,
    });
  } catch (error) {
    next(error);
  }
}
  // Get payment by ID
  async getPayment(req, res, next) {
    try {
      const payment = await paymentService.findById(req.params.id);

      res.status(200).json({
        success: true,
        payment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all payments
  async getPayments(req, res, next) {
    try {
      const {
        school,
        student,
        status,
        page = 1,
        limit = 20,
      } = req.query;

      const result = await paymentService.findAll({
        school,
        student,
        status,
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get payments for a school
  async getSchoolPayments(req, res, next) {
    try {
      const payments = await paymentService.getPaymentsBySchool(
        req.params.schoolId
      );

      res.status(200).json({
        success: true,
        payments,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get payments for a student
  async getStudentPayments(req, res, next) {
    try {
      const payments = await paymentService.getPaymentsByStudent(
        req.params.studentId
      );

      res.status(200).json({
        success: true,
        payments,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get today's payments
  async getTodayPayments(req, res, next) {
    try {
      const payments = await paymentService.getTodayPayments(
        req.params.schoolId
      );

      res.status(200).json({
        success: true,
        payments,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get total revenue
  async getTotalRevenue(req, res, next) {
    try {
      const total = await paymentService.getTotalRevenue(
        req.params.schoolId
      );

      res.status(200).json({
        success: true,
        total,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get today's revenue
  async getTodayRevenue(req, res, next) {
    try {
      const result = await paymentService.getTodayRevenue(
        req.params.schoolId
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();


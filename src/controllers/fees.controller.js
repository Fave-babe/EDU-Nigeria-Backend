const feeService = require("../services/fee.service");
const api = require("../utils/apiResponse");

// Create fee
exports.createFee = async (req, res, next) => {
  try {
    const fee = await feeService.createFee({
      ...req.body,
      recordedBy: req.user._id,
    });

    api.created(
      res,
      { fee },
      "Fee created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one fee
exports.getFee = async (req, res, next) => {
  try {
    const fee = await feeService.findById(
      req.params.id
    );

    api.success(
      res,
      { fee },
      "Fee retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get student's fees
exports.getStudentFees = async (req, res, next) => {
  try {
    const {
      academicSession,
      term,
      status,
    } = req.query;

    const fees = await feeService.findByStudent(
      req.params.studentId,
      {
        academicSession,
        term,
        status,
      }
    );

    api.success(
      res,
      { fees },
      "Student fees retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Record payment
exports.recordPayment = async (req, res, next) => {
  try {
    const fee = await feeService.recordPayment(
      req.params.id,
      req.body
    );

    api.success(
      res,
      { fee },
      "Payment recorded successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update fee
exports.updateFee = async (req, res, next) => {
  try {
    const fee = await feeService.updateFee(
      req.params.id,
      req.body
    );

    api.success(
      res,
      { fee },
      "Fee updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get student's balance
exports.getStudentBalance = async (
  req,
  res,
  next
) => {
  try {
    const {
      academicSession,
      term,
    } = req.query;

    const balance =
      await feeService.getStudentBalance(
        req.params.studentId,
        academicSession,
        term
      );

    api.success(
      res,
      { balance },
      "Student balance retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get all fees
exports.getAllFees = async (req, res, next) => {
  try {
    const {
      school,
      student,
      academicSession,
      term,
      status,
    } = req.query;

    const fees = await feeService.getAllFees({
      school,
      student,
      academicSession,
      term,
      status,
    });

    api.success(
      res,
      { fees },
      "Fees retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete fee
exports.deleteFee = async (req, res, next) => {
  try {
    const fee = await feeService.deleteFee(
      req.params.id
    );

    api.success(
      res,
      { fee },
      "Fee deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
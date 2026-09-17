const router = require("express").Router();

const feeController = require("../controllers/fee.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// All fee routes require authentication
router.use(protect);

// Create fee
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR
  ),
  feeController.createFee
);

// Get all fees
router.get(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR,
    ROLES.STAFF
  ),
  feeController.getAllFees
);

// Get student's balance
// Must come before /:id
router.get(
  "/student/:studentId/balance",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR,
    ROLES.STAFF,
    ROLES.PARENT
  ),
  feeController.getStudentBalance
);

// Get student's fees
router.get(
  "/student/:studentId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR,
    ROLES.STAFF,
    ROLES.PARENT
  ),
  feeController.getStudentFees
);

// Record payment
router.patch(
  "/:id/payment",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR
  ),
  feeController.recordPayment
);

// Update fee
router.patch(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR
  ),
  feeController.updateFee
);

// Get one fee
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR,
    ROLES.STAFF,
    ROLES.PARENT
  ),
  feeController.getFee
);

// Delete fee
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  feeController.deleteFee
);

module.exports = router;
const router = require("express").Router();

const paymentController = require("../controllers/payment.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Protect all payment routes
router.use(protect);

// =====================================================
// RECORD PAYMENT
// =====================================================

router.post(
  "/",
  RestrictTo(
    ROLES.BURSAR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  paymentController.createPayment
);

// =====================================================
// GET ALL PAYMENTS
// =====================================================

router.get(
  "/",
  RestrictTo(
    ROLES.BURSAR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.PARENT
  ),
  paymentController.getPayments
);

// =====================================================
// GET PAYMENT BY ID
// =====================================================

router.get(
  "/:id",
  RestrictTo(
    ROLES.BURSAR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.PARENT
  ),
  paymentController.getPayment
);

// =====================================================
// SCHOOL PAYMENTS
// =====================================================

router.get(
  "/school/:schoolId",
  RestrictTo(
    ROLES.BURSAR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.PARENT
  ),
  paymentController.getSchoolPayments
);

// =====================================================
// STUDENT PAYMENTS
// =====================================================

router.get(
  "/student/:studentId",
  RestrictTo(
    ROLES.BURSAR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.PARENT
  ),
  paymentController.getStudentPayments
);

// =====================================================
// PARENT PAYMENTS
// =====================================================

router.get(
  "/parent/me",
  RestrictTo(ROLES.PARENT),
  paymentController.getParentPayments
);

router.get(
  "/parent/me/revenue",
  RestrictTo(ROLES.PARENT),
  paymentController.getParentRevenue
);

// =====================================================
// TODAY'S PAYMENTS
// =====================================================

router.get(
  "/school/:schoolId/today",
  RestrictTo(
    ROLES.BURSAR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.PARENT
  ),
  paymentController.getTodayPayments
);

// =====================================================
// TOTAL REVENUE
// =====================================================

router.get(
  "/school/:schoolId/revenue",
  RestrictTo(
    ROLES.BURSAR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.PARENT
  ),
  paymentController.getTotalRevenue
);

// =====================================================
// TODAY'S REVENUE
// =====================================================

router.get(
  "/school/:schoolId/today-revenue",
  RestrictTo(
    ROLES.BURSAR,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.PARENT
  ),
  paymentController.getTodayRevenue
);

module.exports = router;
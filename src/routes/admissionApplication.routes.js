
const router = require("express").Router();

const admissionApplicationController = require("../controllers/admissionApplication.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// =====================================================
// PUBLIC APPLICANT ROUTES
// =====================================================

// Applicant submits admission application
router.post(
  "/",
  admissionApplicationController.createApplication
);

// Applicant submits entrance exam result
router.post(
  "/:id/exam",
  admissionApplicationController.saveExamResult
);

// =====================================================
// PROTECTED ADMIN ROUTES
// =====================================================

router.use(protect);

router.use(
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  )
);

// Get all applications
router.get(
  "/",
  admissionApplicationController.getApplications
);

// Get applications for a specific school
router.get(
  "/school/:schoolId",
  admissionApplicationController.getApplicationsBySchool
);

// Get one application
router.get(
  "/:id",
  admissionApplicationController.getApplication
);

// Approve application
router.patch(
  "/:id/approve",
  admissionApplicationController.approveApplication
);

// Reject application
router.patch(
  "/:id/reject",
  admissionApplicationController.rejectApplication
);

module.exports = router;


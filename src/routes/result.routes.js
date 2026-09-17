const router = require("express").Router();

const resultController = require("../controllers/result.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// All result routes require authentication
router.use(protect);

// Create result
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  resultController.createResult
);

// IMPORTANT:
// More specific routes must come before /:id

// Get student's results
router.get(
  "/student/:studentId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.PARENT
  ),
  resultController.getStudentResults
);

// Get class results
router.get(
  "/class/:classId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  resultController.getClassResults
);

// Submit result
router.patch(
  "/:id/submit",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  resultController.submitResult
);

// Approve result
router.patch(
  "/:id/approve",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  resultController.approveResult
);

// Publish result
router.patch(
  "/:id/publish",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  resultController.publishResult
);

// Update result
router.patch(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  resultController.updateResult
);

// Get one result
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.PARENT
  ),
  resultController.getResult
);

// Delete result
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  resultController.deleteResult
);

module.exports = router;
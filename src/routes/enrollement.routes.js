const router = require("express").Router();

const enrollmentController = require(
  "../controllers/enrollement.controller"
);

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Every enrollment route requires authentication
router.use(protect);

// Create enrollment
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  enrollmentController.createEnrollment
);

// Get one enrollment
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER
  ),
  enrollmentController.getEnrollment
);

// Get student's enrollment history
router.get(
  "/student/:studentId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER
  ),
  enrollmentController.getStudentEnrollments
);

// Get students enrolled in a class
router.get(
  "/class/:classId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER
  ),
  enrollmentController.getClassEnrollments
);

// Get all school enrollments
router.get(
  "/school/:schoolId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER
  ),
  enrollmentController.getSchoolEnrollments
);

// Get student's current class and subjects

router.get(
  "/student/:studentId/academic-info",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.STUDENT
  ),
  enrollmentController.getStudentAcademicInfo
);
// Update enrollment
router.put(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  enrollmentController.updateEnrollment
);

// Update enrollment status
router.patch(
  "/:id/status",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  enrollmentController.updateStatus
);

// Delete enrollment
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  enrollmentController.deleteEnrollment
);

module.exports = router;
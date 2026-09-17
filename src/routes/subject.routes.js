const router = require("express").Router();

const subjectController = require(
  "../controllers/subject.controller"
);

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// All subject routes require authentication
router.use(protect);

// Create subject
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  subjectController.createSubject
);

// Get all subjects for a school
router.get(
  "/school/:schoolId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  subjectController.getSchoolSubjects
);

// Get one subject
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  subjectController.getSubject
);

// Update subject
router.put(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  subjectController.updateSubject
);

// Activate / deactivate subject
router.patch(
  "/:id/status",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  subjectController.toggleSubjectStatus
);

// Delete subject
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  subjectController.deleteSubject
);

module.exports = router;
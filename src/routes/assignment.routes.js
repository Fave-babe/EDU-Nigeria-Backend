const router = require("express").Router();

const classSubjectController = require(
  "../controllers/classSubject.controller"
);

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// All routes require authentication
router.use(protect);

// Create class-subject assignment
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classSubjectController.createAssignment
);

// Get all subjects assigned to a class
router.get(
  "/class/:classId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  classSubjectController.getClassSubjects
);

// Get all assignments for a teacher
router.get(
  "/teacher/:teacherId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  classSubjectController.getTeacherSubjects
);

// Get one assignment
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  classSubjectController.getAssignment
);

// Update assignment
router.put(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classSubjectController.updateAssignment
);

// Activate / deactivate assignment
router.patch(
  "/:id/status",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classSubjectController.toggleStatus
);

// Delete assignment
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classSubjectController.deleteAssignment
);

module.exports = router;
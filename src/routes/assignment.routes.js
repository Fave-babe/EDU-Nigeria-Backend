const router = require("express").Router();

const assignmentController = require("../controllers/assignment.controller");

const { protect, RestrictTo } = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// All assignment routes require authentication
router.use(protect);

// Create assignment
router.post(
  "/",
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER),
  assignmentController.createAssignment,
);

// Get one assignment
router.get(
  "/:id",
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER, ROLES.STUDENT),
  assignmentController.getAssignment,
);

// Get all assignments for a school
router.get(
  "/school/:schoolId",
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER, ROLES.STUDENT),
  assignmentController.getSchoolAssignments,
);

// Update assignment
router.put(
  "/:id",
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER),
  assignmentController.updateAssignment,
);

// Delete assignment
router.delete(
  "/:id",
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TEACHER),
  assignmentController.deleteAssignment,
);

module.exports = router;

const router = require("express").Router();

const teacherController = require("../controllers/teacher.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Create teacher
router.post(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  teacherController.createTeacher
);

// Get all teachers
router.get(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER
  ),
  teacherController.getTeachers
);

// Get teachers belonging to a school
router.get(
  "/school/:schoolId",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  teacherController.getTeachersBySchool
);

router.get(
  "/dashboard",
  protect,
  RestrictTo("admin", "super_admin", "staff", "teacher"),
  teacherController.getTeacherDashboard
);


// Get one teacher
router.get(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER
  ),
  teacherController.getTeacher
);

// Update teacher
router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  teacherController.updateTeacher
);

// Activate teacher
router.patch(
  "/:id/activate",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  teacherController.activateTeacher
);

// Deactivate teacher
router.patch(
  "/:id/deactivate",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  teacherController.deactivateTeacher
);

// Delete teacher
router.delete(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  teacherController.deleteTeacher
);

module.exports = router;
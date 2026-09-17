const router = require("express").Router();

const studentController = require("../controllers/student.controller");

const { protect, RestrictTo } = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Create student
router.post(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER
  ),
  studentController.createStudent
);
// Get all students
router.get(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER
  ),
  studentController.getStudents
);

// Get students belonging to a school
router.get(
  "/school/:schoolId",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER
  ),
  studentController.getStudentsBySchool
);

// Get currently logged-in student
router.get(
  "/me",
  protect,
  RestrictTo(ROLES.STUDENT),
  studentController.getMe
);

// Get one student
router.get(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.STUDENT
  ),
  studentController.getStudent
);
// Update student
router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  studentController.updateStudent
);

// Delete student
router.delete(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  studentController.deleteStudent
);

module.exports = router;
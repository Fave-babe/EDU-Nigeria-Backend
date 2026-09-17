const router = require("express").Router();

const attendanceController = require(
  "../controllers/attendance.controller"
);

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Every attendance route requires authentication
router.use(protect);

// Record attendance
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  attendanceController.recordAttendance
);

// Get one attendance record
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  attendanceController.getAttendance
);

// Get student's attendance
router.get(
  "/student/:studentId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  attendanceController.getStudentAttendance
);

// Get student's attendance statistics
router.get(
  "/student/:studentId/stats",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  attendanceController.getStudentStats
);

// Get class attendance
router.get(
  "/class/:classId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  attendanceController.getClassAttendance
);

// Update attendance
router.patch(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  attendanceController.updateAttendance
);

// Delete attendance
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  attendanceController.deleteAttendance
);

module.exports = router;
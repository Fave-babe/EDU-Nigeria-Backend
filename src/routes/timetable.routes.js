const router = require("express").Router();

const timetableController = require("../controllers/timetable.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Every timetable route requires authentication
router.use(protect);

// Create timetable
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  timetableController.createTimetable
);

// Get school timetable
router.get(
  "/school/:schoolId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.PARENT,
    ROLES.STUDENT
  ),
  timetableController.getSchoolTimetable
);

// Get class timetable
router.get(
  "/class/:classId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.PARENT,
    ROLES.STUDENT
  ),
  timetableController.getClassTimetable
);

// Get teacher timetable
router.get(
  "/teacher/:teacherId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  timetableController.getTeacherTimetable
);

// Update timetable
router.patch(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  timetableController.updateTimetable
);

// Deactivate timetable
router.patch(
  "/:id/deactivate",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  timetableController.deactivateTimetable
);

// Get one timetable entry
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.PARENT,
    ROLES.STUDENT
  ),
  timetableController.getTimetable
);

// Delete timetable
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  timetableController.deleteTimetable
);

module.exports = router;
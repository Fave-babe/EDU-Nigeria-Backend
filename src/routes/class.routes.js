const router = require("express").Router();

const classController = require("../controllers/class.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// All class routes require authentication
router.use(protect);

// Create class
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classController.createClass
);

// Get all classes for a school
router.get(
  "/school/:schoolId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.STUDENT,
    ROLES.PARENT
  ),
  classController.getSchoolClasses
);

// Get one class
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.STUDENT,
    ROLES.PARENT
  ),
  classController.getClass
);

// Update class
router.put(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classController.updateClass
);

// Assign class teacher
router.patch(
  "/:id/teacher",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classController.assignClassTeacher
);

// Remove class teacher
router.patch(
  "/:id/remove-teacher",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classController.removeClassTeacher
);

// Delete class
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classController.deleteClass
);

module.exports = router;
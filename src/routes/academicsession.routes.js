const router = require("express").Router();

const academicSessionController = require(
  "../controllers/academicSession.controller"
);

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// All academic session routes require authentication
router.use(protect);

// Create academic session
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  academicSessionController.createSession
);

// Get all sessions for a school
router.get(
  "/school/:schoolId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  academicSessionController.getSchoolSessions
);

// Get current session for a school
router.get(
  "/school/:schoolId/current",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.STUDENT,
    ROLES.PARENT
  ),
  academicSessionController.getCurrentSession
);

// Get one academic session
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  academicSessionController.getSession
);

// Set session as current
router.patch(
  "/:id/current",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  academicSessionController.setCurrentSession
);

// Update academic session
router.put(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  academicSessionController.updateSession
);

// Delete academic session
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  academicSessionController.deleteSession
);

module.exports = router;
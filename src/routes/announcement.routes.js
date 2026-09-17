const router = require("express").Router();

const announcementController = require(
  "../controllers/announcement.controller"
);

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// All announcement routes require authentication
router.use(protect);

// Create announcement
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  announcementController.createAnnouncement
);

// Get school announcements
router.get(
  "/school/:schoolId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.BURSAR,
    ROLES.COUNSELLOR,
    ROLES.PARENT,
    ROLES.STUDENT
  ),
  announcementController.getSchoolAnnouncements
);

// Get announcements for a specific audience
router.get(
  "/school/:schoolId/audience/:audience",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.BURSAR,
    ROLES.COUNSELLOR,
    ROLES.PARENT,
    ROLES.STUDENT
  ),
  announcementController.getAudienceAnnouncements
);

// Publish announcement
router.patch(
  "/:id/publish",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  announcementController.publishAnnouncement
);

// Unpublish announcement
router.patch(
  "/:id/unpublish",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  announcementController.unpublishAnnouncement
);

// Update announcement
router.patch(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  announcementController.updateAnnouncement
);

// Get one announcement
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.BURSAR,
    ROLES.COUNSELLOR,
    ROLES.PARENT,
    ROLES.STUDENT
  ),
  announcementController.getAnnouncement
);

// Delete announcement
router.delete(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  announcementController.deleteAnnouncement
);

module.exports = router;
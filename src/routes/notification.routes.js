const router = require("express").Router();

const notificationController = require(
  "../controllers/notification.controller"
);

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Every notification route requires authentication
router.use(protect);

// Create notification
router.post(
  "/",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.BURSAR,
    ROLES.COUNSELLOR
  ),
  notificationController.createNotification
);

// IMPORTANT:
// Specific routes must come before /:id

// Get current user's notifications
router.get(
  "/me",
  notificationController.getMyNotifications
);

// Get unread notifications
router.get(
  "/unread",
  notificationController.getUnreadNotifications
);

// Get unread notification count
router.get(
  "/unread/count",
  notificationController.getUnreadCount
);

// Mark all notifications as read
router.patch(
  "/read-all",
  notificationController.markAllAsRead
);

// Delete all notifications
router.delete(
  "/all",
  notificationController.deleteAllNotifications
);

// Mark one notification as read
router.patch(
  "/:id/read",
  notificationController.markAsRead
);

// Get one notification
router.get(
  "/:id",
  notificationController.getNotification
);

// Delete one notification
router.delete(
  "/:id",
  notificationController.deleteNotification
);

module.exports = router;
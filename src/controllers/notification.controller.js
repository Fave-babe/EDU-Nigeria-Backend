const notificationService = require("../services/notification.service");
const api = require("../utils/apiResponse");

// Create notification
exports.createNotification = async (req, res, next) => {
  try {
    const notification =
      await notificationService.createNotification({
        ...req.body,
        createdBy: req.user._id,
      });

    api.created(
      res,
      { notification },
      "Notification created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one notification
exports.getNotification = async (req, res, next) => {
  try {
    const notification =
      await notificationService.findById(
        req.params.id
      );

    api.success(
      res,
      { notification },
      "Notification retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get current user's notifications
exports.getMyNotifications = async (
  req,
  res,
  next
) => {
  try {
    const {
      isRead,
      type,
    } = req.query;

   const recipientModel =
  req.user.role.charAt(0).toUpperCase() +
  req.user.role.slice(1);

const notifications =
  await notificationService.getUserNotifications(
    req.user._id,
    recipientModel,
    {
      isRead:
        isRead !== undefined
          ? isRead === "true"
          : undefined,
      type,
    }
  );

    api.success(
      res,
      { notifications },
      "Notifications retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get unread notifications
exports.getUnreadNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await notificationService.getUnreadNotifications(
        req.user._id,
        req.user.role
      );

    api.success(
      res,
      { notifications },
      "Unread notifications retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get unread notification count
exports.getUnreadCount = async (
  req,
  res,
  next
) => {
  try {
    const count =
      await notificationService.getUnreadCount(
        req.user._id,
        req.user.role
      );

    api.success(
      res,
      { count },
      "Unread notification count retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification =
      await notificationService.markAsRead(
        req.params.id,
        req.user._id
      );

    api.success(
      res,
      { notification },
      "Notification marked as read"
    );
  } catch (err) {
    next(err);
  }
};

// Mark all as read
exports.markAllAsRead = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await notificationService.markAllAsRead(
        req.user._id,
        req.user.role
      );

    api.success(
      res,
      { result },
      "All notifications marked as read"
    );
  } catch (err) {
    next(err);
  }
};

// Delete notification
exports.deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await notificationService.deleteNotification(
        req.params.id,
        req.user._id
      );

    api.success(
      res,
      { notification },
      "Notification deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete all notifications
exports.deleteAllNotifications = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await notificationService.deleteAllNotifications(
        req.user._id,
        req.user.role
      );

    api.success(
      res,
      { result },
      "All notifications deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
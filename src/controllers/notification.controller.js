
const notificationService = require("../services/notification.service");
const api = require("../utils/apiResponse");

// =========================================================
// GET RECIPIENT MODEL
// =========================================================
// The Notification model uses the actual Mongoose model name.
// Counsellor can be stored as a staff account in some parts
// of the application, so staff + counsellor stays Staff.

const getRecipientModel = (user) => {
  const role = String(user?.role || "")
    .toLowerCase()
    .trim();

  const staffRole = String(user?.staffRole || "")
    .toLowerCase()
    .trim();

  if (role === "staff") {
    return "Staff";
  }

  switch (role) {
    case "admin":
      return "Admin";

    case "super_admin":
    case "superadmin":
      return "SuperAdmin";

    case "teacher":
      return "Teacher";

    case "student":
      return "Student";

    case "parent":
      return "Parent";

    case "bursar":
      return "Bursar";

    case "counsellor":
      return "Counsellor";

    default:
      return null;
  }
};

// =========================================================
// CREATE NOTIFICATION
// =========================================================

exports.createNotification = async (req, res, next) => {
  try {
    const recipientModel = getRecipientModel(req.body);

    const notification = await notificationService.createNotification({
      ...req.body,
      createdBy: req.user._id,
      recipientModel:
        req.body.recipientModel || recipientModel,
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

// =========================================================
// GET ONE NOTIFICATION
// =========================================================

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

// =========================================================
// GET CURRENT USER'S NOTIFICATIONS
// =========================================================

exports.getMyNotifications = async (
  req,
  res,
  next
) => {
  try {
    const recipientModel =
      getRecipientModel(req.user);

    if (!recipientModel) {
      return next(
        new Error("Unable to determine recipient model")
      );
    }

    const { isRead, type } = req.query;

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
      {
        notifications,
        unreadCount:
          notifications.filter(
            (notification) =>
              notification.isRead === false
          ).length,
      },
      "Notifications retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// =========================================================
// GET UNREAD NOTIFICATIONS
// =========================================================

exports.getUnreadNotifications = async (
  req,
  res,
  next
) => {
  try {
    const recipientModel =
      getRecipientModel(req.user);

    if (!recipientModel) {
      return next(
        new Error("Unable to determine recipient model")
      );
    }

    const notifications =
      await notificationService.getUnreadNotifications(
        req.user._id,
        recipientModel
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

// =========================================================
// GET UNREAD NOTIFICATION COUNT
// =========================================================

exports.getUnreadCount = async (
  req,
  res,
  next
) => {
  try {
    const recipientModel =
      getRecipientModel(req.user);

    if (!recipientModel) {
      return next(
        new Error("Unable to determine recipient model")
      );
    }

    const count =
      await notificationService.getUnreadCount(
        req.user._id,
        recipientModel
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

// =========================================================
// MARK ONE NOTIFICATION AS READ
// =========================================================

exports.markAsRead = async (
  req,
  res,
  next
) => {
  try {
    const recipientModel =
      getRecipientModel(req.user);

    if (!recipientModel) {
      return next(
        new Error("Unable to determine recipient model")
      );
    }

    const notification =
      await notificationService.markAsRead(
        req.params.id,
        req.user._id,
        recipientModel
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

// =========================================================
// MARK ALL AS READ
// =========================================================

exports.markAllAsRead = async (
  req,
  res,
  next
) => {
  try {
    const recipientModel =
      getRecipientModel(req.user);

    if (!recipientModel) {
      return next(
        new Error("Unable to determine recipient model")
      );
    }

    const result =
      await notificationService.markAllAsRead(
        req.user._id,
        recipientModel
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

// =========================================================
// DELETE ONE NOTIFICATION
// =========================================================

exports.deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    const recipientModel =
      getRecipientModel(req.user);

    if (!recipientModel) {
      return next(
        new Error("Unable to determine recipient model")
      );
    }

    const notification =
      await notificationService.deleteNotification(
        req.params.id,
        req.user._id,
        recipientModel
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

// =========================================================
// DELETE ALL NOTIFICATIONS
// =========================================================

exports.deleteAllNotifications = async (
  req,
  res,
  next
) => {
  try {
    const recipientModel =
      getRecipientModel(req.user);

    if (!recipientModel) {
      return next(
        new Error("Unable to determine recipient model")
      );
    }

    const result =
      await notificationService.deleteAllNotifications(
        req.user._id,
        recipientModel
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


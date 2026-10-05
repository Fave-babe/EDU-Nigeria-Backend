const Notification = require("../models/Notification.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class NotificationService {
  // =========================================================
  // CREATE NOTIFICATION
  // =========================================================

  async createNotification(data) {
    const {
      school,
      recipient,
      recipientModel,
      title,
      message,
      type,
      createdBy,
    } = data;

    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    if (!recipient) {
      throw new AppError("Recipient is required", 400);
    }

    if (!recipientModel) {
      throw new AppError("Recipient model is required", 400);
    }

    if (!title || !message) {
      throw new AppError(
        "Notification title and message are required",
        400
      );
    }

    const notification = await Notification.create({
      school,
      recipient,
      recipientModel,
      title,
      message,
      type,
      createdBy,
    });

    return notification;
  }

  // =========================================================
  // GET ONE NOTIFICATION
  // =========================================================

  async findById(notificationId) {
    const notification = await Notification.findById(
      notificationId
    ).populate("school", "name");

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return notification;
  }

  // =========================================================
  // GET USER NOTIFICATIONS
  // =========================================================

  async getUserNotifications(
    recipient,
    recipientModel,
    filters = {}
  ) {
    const query = {
      recipient,
      recipientModel,
    };

    if (filters.isRead !== undefined) {
      query.isRead = filters.isRead;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    return Notification.find(query)
      .populate("school", "name")
      .sort({
        createdAt: -1,
      });
  }

  // =========================================================
  // GET UNREAD NOTIFICATIONS
  // =========================================================

  async getUnreadNotifications(
    recipient,
    recipientModel
  ) {
    return Notification.find({
      recipient,
      recipientModel,
      isRead: false,
    })
      .populate("school", "name")
      .sort({
        createdAt: -1,
      });
  }

  // =========================================================
  // GET UNREAD COUNT
  // =========================================================

  async getUnreadCount(
    recipient,
    recipientModel
  ) {
    return Notification.countDocuments({
      recipient,
      recipientModel,
      isRead: false,
    });
  }

  // =========================================================
  // MARK ONE AS READ
  // =========================================================

  async markAsRead(
    notificationId,
    recipient,
    recipientModel
  ) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient,
      recipientModel,
    });

    if (!notification) {
      throw new AppError(
        "Notification not found",
        404
      );
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();

    return notification;
  }

  // =========================================================
  // MARK ALL AS READ
  // =========================================================

  async markAllAsRead(
    recipient,
    recipientModel
  ) {
    return Notification.updateMany(
      {
        recipient,
        recipientModel,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );
  }

  // =========================================================
  // DELETE ONE NOTIFICATION
  // =========================================================

  async deleteNotification(
    notificationId,
    recipient,
    recipientModel
  ) {
    const notification =
      await Notification.findOneAndDelete({
        _id: notificationId,
        recipient,
        recipientModel,
      });

    if (!notification) {
      throw new AppError(
        "Notification not found",
        404
      );
    }

    return notification;
  }

  // =========================================================
  // DELETE ALL NOTIFICATIONS
  // =========================================================

  async deleteAllNotifications(
    recipient,
    recipientModel
  ) {
    return Notification.deleteMany({
      recipient,
      recipientModel,
    });
  }
}

module.exports = new NotificationService();
const Notification = require("../models/Notification.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class NotificationService {
  // Create a notification
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

    if (!title || !message) {
      throw new AppError(
        "Notification title and message are required",
        400
      );
    }

    const notification =
      await Notification.create({
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

  // Get one notification
  async findById(notificationId) {
    const notification =
      await Notification.findById(
        notificationId
      ).populate("school", "name");

    if (!notification) {
      throw new AppError(
        "Notification not found",
        404
      );
    }

    return notification;
  }

  // Get notifications for a user
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

  // Get unread notifications
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

  // Get unread count
  async getUnreadCount(
    recipient,
    recipientModel
  ) {
    const count =
      await Notification.countDocuments({
        recipient,
        recipientModel,
        isRead: false,
      });

    return count;
  }

  // Mark one notification as read
  async markAsRead(
    notificationId,
    recipient
  ) {
    const notification =
      await Notification.findOne({
        _id: notificationId,
        recipient,
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

  // Mark all notifications as read
  async markAllAsRead(
    recipient,
    recipientModel
  ) {
    const result =
      await Notification.updateMany(
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

    return result;
  }

  // Delete notification
  async deleteNotification(
    notificationId,
    recipient
  ) {
    const notification =
      await Notification.findOneAndDelete({
        _id: notificationId,
        recipient,
      });

    if (!notification) {
      throw new AppError(
        "Notification not found",
        404
      );
    }

    return notification;
  }

  // Delete all notifications for a user
  async deleteAllNotifications(
    recipient,
    recipientModel
  ) {
    const result =
      await Notification.deleteMany({
        recipient,
        recipientModel,
      });

    return result;
  }
}

module.exports = new NotificationService();
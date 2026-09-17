const Announcement = require("../models/Announcement.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class AnnouncementService {
  // Create announcement
  async createAnnouncement(data) {
    const {
      school,
      title,
      message,
      type,
      audience,
      priority,
      expiresAt,
      createdBy,
      createdByModel,
    } = data;

    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    if (!title || !message) {
      throw new AppError(
        "Announcement title and message are required",
        400
      );
    }

    const announcement = await Announcement.create({
      school,
      title,
      message,
      type,
      audience,
      priority,
      expiresAt,
      createdBy,
      createdByModel,
      published: false,
    });

    return announcement;
  }

  // Get announcement by ID
  async findById(id) {
    const announcement = await Announcement.findById(id)
      .populate("school", "name");

    if (!announcement) {
      throw new AppError(
        "Announcement not found",
        404
      );
    }

    return announcement;
  }

  // Get all announcements for a school
  async getSchoolAnnouncements(
    schoolId,
    filters = {}
  ) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const query = {
      school: schoolId,
    };

    if (filters.published !== undefined) {
      query.published = filters.published;
    }

    if (filters.audience) {
      query.audience = {
        $in: ["all", filters.audience],
      };
    }

    if (filters.type) {
      query.type = filters.type;
    }

    // Don't show expired announcements
    if (filters.includeExpired !== true) {
      query.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ];
    }

    return Announcement.find(query)
      .populate("school", "name")
      .sort({
        priority: -1,
        createdAt: -1,
      });
  }

  // Get announcements for a specific audience
  async getAudienceAnnouncements(
    schoolId,
    audience
  ) {
    return this.getSchoolAnnouncements(
      schoolId,
      {
        published: true,
        audience,
      }
    );
  }

  // Publish announcement
  async publishAnnouncement(id) {
    const announcement =
      await Announcement.findById(id);

    if (!announcement) {
      throw new AppError(
        "Announcement not found",
        404
      );
    }

    announcement.published = true;
    announcement.publishedAt = new Date();

    await announcement.save();

    return announcement;
  }

  // Unpublish announcement
  async unpublishAnnouncement(id) {
    const announcement =
      await Announcement.findById(id);

    if (!announcement) {
      throw new AppError(
        "Announcement not found",
        404
      );
    }

    announcement.published = false;

    await announcement.save();

    return announcement;
  }

  // Update announcement
  async updateAnnouncement(id, data) {
    const announcement =
      await Announcement.findById(id);

    if (!announcement) {
      throw new AppError(
        "Announcement not found",
        404
      );
    }

    const allowedFields = [
      "title",
      "message",
      "type",
      "audience",
      "priority",
      "expiresAt",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        announcement[field] = data[field];
      }
    });

    await announcement.save();

    return announcement;
  }

  // Delete announcement
  async deleteAnnouncement(id) {
    const announcement =
      await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      throw new AppError(
        "Announcement not found",
        404
      );
    }

    return announcement;
  }
}

module.exports = new AnnouncementService();

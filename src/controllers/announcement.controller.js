const announcementService = require("../services/announcement.service");
const AppError = require("../utils/AppError");
const api = require("../utils/apiResponse");

// Create announcement
exports.createAnnouncement = async (req, res, next) => {
  try {
    const roleMap = {
      admin: "Admin",
      super_admin: "Admin",
      teacher: "Teacher",
      staff: "Staff",
      bursar: "Bursar",
      counsellor: "Counsellor",
    };

    const createdByModel = roleMap[req.user.role];

    if (!createdByModel) {
      return next(
        new AppError("Invalid user role for announcement", 400)
      );
    }

    const announcement =
      await announcementService.createAnnouncement({
        ...req.body,
        createdBy: req.user._id,
        createdByModel,
      });

    api.created(
      res,
      { announcement },
      "Announcement created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one announcement
exports.getAnnouncement = async (
  req,
  res,
  next
) => {
  try {
    const announcement =
      await announcementService.findById(
        req.params.id
      );

    api.success(
      res,
      { announcement },
      "Announcement retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get school announcements
exports.getSchoolAnnouncements = async (
  req,
  res,
  next
) => {
  try {
    const {
      published,
      audience,
      type,
      includeExpired,
    } = req.query;

    const announcements =
      await announcementService.getSchoolAnnouncements(
        req.params.schoolId,
        {
          published:
            published !== undefined
              ? published === "true"
              : undefined,

          audience,

          type,

          includeExpired:
            includeExpired === "true",
        }
      );

    api.success(
      res,
      { announcements },
      "School announcements retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get announcements for an audience
exports.getAudienceAnnouncements = async (
  req,
  res,
  next
) => {
  try {
    const announcements =
      await announcementService.getAudienceAnnouncements(
        req.params.schoolId,
        req.params.audience
      );

    api.success(
      res,
      { announcements },
      "Announcements retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Publish announcement
exports.publishAnnouncement = async (
  req,
  res,
  next
) => {
  try {
    const announcement =
      await announcementService.publishAnnouncement(
        req.params.id
      );

    api.success(
      res,
      { announcement },
      "Announcement published successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Unpublish announcement
exports.unpublishAnnouncement = async (
  req,
  res,
  next
) => {
  try {
    const announcement =
      await announcementService.unpublishAnnouncement(
        req.params.id
      );

    api.success(
      res,
      { announcement },
      "Announcement unpublished successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update announcement
exports.updateAnnouncement = async (
  req,
  res,
  next
) => {
  try {
    const announcement =
      await announcementService.updateAnnouncement(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { announcement },
      "Announcement updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete announcement
exports.deleteAnnouncement = async (
  req,
  res,
  next
) => {
  try {
    const announcement =
      await announcementService.deleteAnnouncement(
        req.params.id
      );

    api.success(
      res,
      { announcement },
      "Announcement deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
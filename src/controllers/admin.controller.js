
const adminService = require("../services/admin.service");
const api = require("../utils/apiResponse");

exports.createAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    api.created(res, { admin }, "Admin created successfully");
  } catch (err) {
    next(err);
  }
};

exports.getAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.findById(req.params.id);
    api.success(res, { admin }, "Admin retrieved successfully");
  } catch (err) {
    next(err);
  }
};

exports.getAdmins = async (req, res, next) => {
  try {
    const {
      school,
      isActive,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await adminService.findAll({
      school,
      isActive:
        isActive === undefined
          ? undefined
          : isActive === "true",
      page: Number(page),
      limit: Number(limit),
    });

    api.success(
      res,
      result,
      "Admins retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.updateAdmin(
      req.params.id,
      req.body,
      req.user
    );

    api.success(
      res,
      { admin },
      "Admin updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.deleteAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.deleteAdmin(
      req.params.id
    );

    api.success(
      res,
      { admin },
      "Admin deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getAdminsBySchool = async (
  req,
  res,
  next
) => {
  try {
    const admins =
      await adminService.getAdminsBySchool(
        req.params.schoolId
      );

    api.success(
      res,
      { admins },
      "School admins retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};
exports.getDashboardOverview = async (req, res, next) => {
  try {
    const dashboard = await adminService.getDashboardOverview(req.user);

    api.success(
      res,
      dashboard,
      "Admin dashboard retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};


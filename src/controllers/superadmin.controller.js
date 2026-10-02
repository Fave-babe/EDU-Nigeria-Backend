const superAdminService = require("../services/superadmin.service");
const api = require("../utils/apiResponse");

exports.createSuperAdmin = async (req, res, next) => {
  try {
    const superAdmin = await superAdminService.createSuperAdmin(req.body);

    api.created(
      res,
      { superAdmin },
      "SuperAdmin created successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getSuperAdmin = async (req, res, next) => {
  try {
    const superAdmin = await superAdminService.getSuperAdmin(
      req.params.id
    );

    api.success(
      res,
      { superAdmin },
      "SuperAdmin retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getAllSuperAdmins = async (req, res, next) => {
  try {
    const superAdmins =
      await superAdminService.getAllSuperAdmins();

    api.success(
      res,
      { superAdmins },
      "SuperAdmins retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.updateSuperAdmin = async (req, res, next) => {
  try {
    const superAdmin =
      await superAdminService.updateSuperAdmin(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { superAdmin },
      "SuperAdmin updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.deactivateSuperAdmin = async (req, res, next) => {
  try {
    const superAdmin =
      await superAdminService.deactivateSuperAdmin(
        req.params.id
      );

    api.success(
      res,
      { superAdmin },
      "SuperAdmin deactivated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.activateSuperAdmin = async (req, res, next) => {
  try {
    const superAdmin =
      await superAdminService.activateSuperAdmin(
        req.params.id
      );

    api.success(
      res,
      { superAdmin },
      "SuperAdmin activated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.deleteSuperAdmin = async (req, res, next) => {
  try {
    const superAdmin =
      await superAdminService.deleteSuperAdmin(
        req.params.id
      );

    api.success(
      res,
      { superAdmin },
      "SuperAdmin deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
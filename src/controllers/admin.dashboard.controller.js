
const adminDashboardService = require("../services/admin.dashboard.service");
const api = require("../utils/apiResponse");

exports.getOverview = async (req, res, next) => {
  try {
    const dashboard =
      await adminDashboardService.getDashboardOverview(req.user);

    api.success(
      res,
      dashboard,
      "Admin dashboard retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};
exports.getDashboardOverview = async (req, res, next) => {
  try {
    const dashboard =
      await adminService.getDashboardOverview(req.user);

    api.success(
      res,
      dashboard,
      "Admin dashboard retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

const staffService = require("../services/staff.service");

const api = require("../utils/apiResponse");

// Create staff
exports.createStaff = async (req, res, next) => {
  try {
    const staff = await staffService.createStaff(req.body);

    api.created(
      res,
      { staff },
      "Staff created successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get one staff member
exports.getStaff = async (req, res, next) => {
  try {
    const staff = await staffService.findById(req.params.id);

    api.success(
      res,
      { staff },
      "Staff member retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get all staff
exports.getAllStaff = async (req, res, next) => {
  try {
    const {
      school,
      role,
      staffRole,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await staffService.findAll({
      school,
      role,
      staffRole,
      page: Number(page),
      limit: Number(limit),
    });

    api.paginated(
      res,
      result,
      "Staff retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Update staff
exports.updateStaff = async (req, res, next) => {
  try {
    const staff = await staffService.updateStaff(
      req.params.id,
      req.body
    );

    api.success(
      res,
      { staff },
      "Staff updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Delete staff
exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await staffService.deleteStaff(
      req.params.id
    );

    api.success(
      res,
      { staff },
      "Staff deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get staff belonging to a school
exports.getStaffBySchool = async (req, res, next) => {
  try {
    const staff = await staffService.getStaffBySchool(
      req.params.schoolId
    );

    api.success(
      res,
      { staff },
      "School staff retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};
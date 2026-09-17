const parentService = require("../services/parent.service");
const api = require("../utils/apiResponse");

exports.createParent = async (req, res, next) => {
  try {
    const parent = await parentService.createParent(req.body);

    api.created(
      res,
      { parent },
      "Parent created successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getParent = async (req, res, next) => {
  try {
    const parent = await parentService.findById(req.params.id);

    api.success(
      res,
      { parent },
      "Parent retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getParents = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
    } = req.query;

    const result = await parentService.findAll({
      page: Number(page),
      limit: Number(limit),
    });

    api.paginated(
      res,
      result,
      "Parents retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Get logged-in parent's dashboard
exports.getMyDashboard = async (req, res, next) => {
  try {
    const dashboard = await parentService.getMyDashboard(
      req.user._id
    );

    api.success(
      res,
      { dashboard },
      "Parent dashboard retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.updateParent = async (req, res, next) => {
  try {
    const parent = await parentService.updateParent(
      req.params.id,
      req.body
    );

    api.success(
      res,
      { parent },
      "Parent updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.addChild = async (req, res, next) => {
  try {
    const parent = await parentService.addChild(
      req.params.id,
      req.body.studentId
    );

    api.success(
      res,
      { parent },
      "Student linked to parent successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.removeChild = async (req, res, next) => {
  try {
    const parent = await parentService.removeChild(
      req.params.id,
      req.params.studentId
    );

    api.success(
      res,
      { parent },
      "Student removed from parent successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.deleteParent = async (req, res, next) => {
  try {
    const parent = await parentService.deleteParent(
      req.params.id
    );

    api.success(
      res,
      { parent },
      "Parent deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
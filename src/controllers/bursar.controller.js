const bursarService = require("../services/bursar.service");
const api = require("../utils/apiResponse");

exports.createBursar = async (req, res, next) => {
  try {
    const bursar = await bursarService.createBursar(req.body);

    api.created(
      res,
      { bursar },
      "Bursar created successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getBursar = async (req, res, next) => {
  try {
    const bursar = await bursarService.findById(req.params.id);

    api.success(
      res,
      { bursar },
      "Bursar retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getBursars = async (req, res, next) => {
  try {
    const {
      school,
      isActive,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await bursarService.findAll({
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
      "Bursars retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.updateBursar = async (req, res, next) => {
  try {
    const bursar = await bursarService.updateBursar(
      req.params.id,
      req.body
    );

    api.success(
      res,
      { bursar },
      "Bursar updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.deleteBursar = async (req, res, next) => {
  try {
    const bursar = await bursarService.deleteBursar(
      req.params.id
    );

    api.success(
      res,
      { bursar },
      "Bursar deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getBursarsBySchool = async (req, res, next) => {
  try {
    const bursars = await bursarService.getBursarsBySchool(
      req.params.schoolId
    );

    api.success(
      res,
      { bursars },
      "School bursars retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};
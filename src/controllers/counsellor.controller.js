const counsellorService = require("../services/counsellor.service");
const api = require("../utils/apiResponse");

exports.createCounsellor = async (req, res, next) => {
  try {
    const counsellor = await counsellorService.createCounsellor(
      req.body
    );

    api.created(
      res,
      { counsellor },
      "Counsellor created successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getCounsellor = async (req, res, next) => {
  try {
    const counsellor = await counsellorService.findById(
      req.params.id
    );

    api.success(
      res,
      { counsellor },
      "Counsellor retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getCounsellors = async (req, res, next) => {
  try {
    const {
      school,
      specialization,
      isActive,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await counsellorService.findAll({
      school,
      specialization,
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
      "Counsellors retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.updateCounsellor = async (req, res, next) => {
  try {
    const counsellor =
      await counsellorService.updateCounsellor(
        req.params.id,
        req.body
      );

    api.success(
      res,
      { counsellor },
      "Counsellor updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.deleteCounsellor = async (req, res, next) => {
  try {
    const counsellor =
      await counsellorService.deleteCounsellor(
        req.params.id
      );

    api.success(
      res,
      { counsellor },
      "Counsellor deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getCounsellorsBySchool = async (req, res, next) => {
  try {
    const counsellors =
      await counsellorService.getCounsellorsBySchool(
        req.params.schoolId
      );

    api.success(
      res,
      { counsellors },
      "School counsellors retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};
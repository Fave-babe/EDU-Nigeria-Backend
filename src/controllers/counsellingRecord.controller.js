const counsellingRecordService = require("../services/CounsellingRecord.service");
const api = require("../utils/apiResponse");

exports.createRecord = async (req, res, next) => {
  try {
    const record = await counsellingRecordService.createRecord(req.body);

    return api.success(
      res,
      { record },
      "Counselling record created successfully",
      201
    );
  } catch (err) {
    next(err);
  }
};

exports.getRecord = async (req, res, next) => {
  try {
    const record = await counsellingRecordService.getRecord(
      req.params.id
    );

    return api.success(
      res,
      { record },
      "Counselling record retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getRecordsBySchool = async (req, res, next) => {
  try {
    const records =
      await counsellingRecordService.getRecordsBySchool(
        req.params.schoolId
      );

    return api.success(
      res,
      { records },
      "Counselling records retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getRecordsByCounsellor = async (req, res, next) => {
  try {
    const records =
      await counsellingRecordService.getRecordsByCounsellor(
        req.params.counsellorId
      );

    return api.success(
      res,
      { records },
      "Counselling records retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getFollowUpsByCounsellor = async (req, res, next) => {
  try {
    const records =
      await counsellingRecordService.getFollowUpsByCounsellor(
        req.params.counsellorId
      );

    return api.success(
      res,
      { records },
      "Counselling follow-ups retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.updateRecord = async (req, res, next) => {
  try {
    const record =
      await counsellingRecordService.updateRecord(
        req.params.id,
        req.body
      );

    return api.success(
      res,
      { record },
      "Counselling record updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.deleteRecord = async (req, res, next) => {
  try {
    await counsellingRecordService.deleteRecord(
      req.params.id
    );

    return api.success(
      res,
      {},
      "Counselling record deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};
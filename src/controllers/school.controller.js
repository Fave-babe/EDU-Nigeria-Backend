const schoolService = require("../services/school.service");
const api = require("../utils/apiResponse");
const School = require("../models/School.model");

exports.createSchool = async (req, res, next) => {
  try {
    const school = await schoolService.createSchool(
      req.body,
      req.user._id
    );

    api.created(
      res,
      { school },
      "School created successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getSchool = async (req, res, next) => {
  try {
    const school = await schoolService.getSchoolById(
      req.params.id
    );

    api.success(
      res,
      { school },
      "School retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

/*
|--------------------------------------------------------------------------
| COMPLETE SCHOOL DETAILS
|--------------------------------------------------------------------------
*/

exports.getSchoolDetails = async (req, res, next) => {
  try {
    const details = await schoolService.getSchoolDetails(
      req.params.id
    );

    api.success(
      res,
      { details },
      "School details retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.updateSchool = async (req, res, next) => {
  try {
    const school = await schoolService.updateSchool(
      req.params.id,
      req.body,
      req.user._id
    );

    api.success(
      res,
      { school },
      "School updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getAllSchools = async (req, res, next) => {
  try {
    const schools = await schoolService.getAllSchools();

    api.success(
      res,
      { schools },
      "Schools retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.toggleSchoolStatus = async (req, res, next) => {
  try {
    const school = await schoolService.toggleSchoolStatus(
      req.params.id,
      req.user._id
    );

    api.success(
      res,
      { school },
      "School status updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

exports.getPublicSchools = async (req, res, next) => {
  try {
    const schools = await School.find(
      { isActive: true },
      {
        name: 1,
        schoolType: 1,
      }
    ).sort({ name: 1 });

    api.success(
      res,
      { schools },
      "Schools retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};
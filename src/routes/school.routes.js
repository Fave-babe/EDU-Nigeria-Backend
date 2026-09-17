const express = require("express");

const router = express.Router();

const schoolController = require("../controllers/school.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Create school
router.post(
  "/",
  protect,
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  schoolController.createSchool
);

// Get all schools
router.get(
  "/",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.getAllSchools
);

// Public schools
router.get(
  "/public",
  schoolController.getPublicSchools
);

// Complete school details
router.get(
  "/:id/details",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.getSchoolDetails
);

// Get single school
router.get(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  schoolController.getSchool
);

// Update school
router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  schoolController.updateSchool
);

// Activate / deactivate school
router.patch(
  "/:id/status",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.toggleSchoolStatus
);

module.exports = router;
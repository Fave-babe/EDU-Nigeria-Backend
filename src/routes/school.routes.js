const express = require("express");

const router = express.Router();

const schoolController = require("../controllers/school.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// =========================================================
// PUBLIC SCHOOL REGISTRATION
// =========================================================

router.post(
  "/register",
  schoolController.registerSchoolApplication
);

// =========================================================
// PUBLIC ACTIVE SCHOOLS
// =========================================================

router.get(
  "/public",
  schoolController.getPublicSchools
);

// =========================================================
// GET ALL SCHOOLS
// SUPER ADMIN ONLY
// =========================================================

router.get(
  "/",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.getAllSchools
);

// SuperAdmin platform overview
router.get(
  "/overview",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.getPlatformOverview
);

// =========================================================
// GET PENDING SCHOOL APPLICATIONS
// SUPER ADMIN ONLY
// =========================================================

router.get(
  "/applications/pending",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.getPendingSchoolApplications
);

// =========================================================
// APPROVE SCHOOL APPLICATION
// SUPER ADMIN ONLY
// =========================================================

router.patch(
  "/:id/approve",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.approveSchool
);

// =========================================================
// REJECT SCHOOL APPLICATION
// SUPER ADMIN ONLY
// =========================================================

router.patch(
  "/:id/reject",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.rejectSchool
);

// =========================================================
// COMPLETE SCHOOL DETAILS
// SUPER ADMIN ONLY
// =========================================================

router.get(
  "/:id/details",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.getSchoolDetails
);

// =========================================================
// GET SINGLE SCHOOL
// =========================================================

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

// =========================================================
// UPDATE SCHOOL
// =========================================================

router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  schoolController.updateSchool
);

// =========================================================
// ACTIVATE / DEACTIVATE SCHOOL
// SUPER ADMIN ONLY
// =========================================================

router.patch(
  "/:id/status",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.toggleSchoolStatus
);

router.post(
  "/:id/admin-credentials",
  protect,
  RestrictTo(ROLES.SUPER_ADMIN),
  schoolController.setupSchoolAdminCredentials
);

module.exports = router;
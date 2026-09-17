const router = require("express").Router();

const admin = require("../controllers/admin.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const {
  ROLES,
} = require("../config/constant");

// =====================================================
// PROTECT ALL ADMIN ROUTES
// =====================================================

router.use(protect);

// =====================================================
// SUPER ADMIN
// =====================================================

// Create admin
router.post(
  "/",
  RestrictTo(ROLES.SUPER_ADMIN),
  admin.createAdmin
);

// Get all admins
router.get(
  "/",
  RestrictTo(ROLES.SUPER_ADMIN),
  admin.getAdmins
);

// Get admins by school
router.get(
  "/school/:schoolId",
  RestrictTo(ROLES.SUPER_ADMIN),
  admin.getAdminsBySchool
);

// Delete admin
router.delete(
  "/:id",
  RestrictTo(ROLES.SUPER_ADMIN),
  admin.deleteAdmin
);

// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
  "/dashboard/overview",
  RestrictTo(ROLES.ADMIN),
  admin.getDashboardOverview
);

// =====================================================
// ADMIN + SUPER ADMIN
// =====================================================

// Get specific admin
router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  admin.getAdmin
);

// Update admin
router.patch(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  admin.updateAdmin
);

module.exports = router;
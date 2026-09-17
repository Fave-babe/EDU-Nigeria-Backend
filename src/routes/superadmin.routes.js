const router = require("express").Router();

const ctrl = require("../controllers/superAdmin.controller");

const {
  protect,
  superAdminOnly,
} = require("../middleware/auth.middlware");

// All SuperAdmin routes require authentication
router.use(protect);

// All SuperAdmin routes require SuperAdmin role
router.use(superAdminOnly);

// Create SuperAdmin
router.post("/", ctrl.createSuperAdmin);

// Get all SuperAdmins
router.get("/", ctrl.getAllSuperAdmins);

// Get one SuperAdmin
router.get("/:id", ctrl.getSuperAdmin);

// Update SuperAdmin
router.patch("/:id", ctrl.updateSuperAdmin);

// Deactivate SuperAdmin
router.patch("/:id/deactivate", ctrl.deactivateSuperAdmin);

// Activate SuperAdmin
router.patch("/:id/activate", ctrl.activateSuperAdmin);

// Delete SuperAdmin
router.delete("/:id", ctrl.deleteSuperAdmin);

module.exports = router;
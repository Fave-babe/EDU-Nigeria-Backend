const router = require("express").Router();

const staffController = require("../controllers/staff.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Create staff
router.post(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  staffController.createStaff
);

// Get all staff
router.get(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  staffController.getAllStaff
);

// Get staff by school
router.get(
  "/school/:schoolId",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  staffController.getStaffBySchool
);

// Get one staff member
router.get(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  staffController.getStaff
);

// Update staff
router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  staffController.updateStaff
);

// Delete staff
router.delete(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  staffController.deleteStaff
);

module.exports = router;
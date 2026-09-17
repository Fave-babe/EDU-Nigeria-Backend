const router = require("express").Router();

const bursarController = require("../controllers/bursar.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Create bursar
router.post(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  bursarController.createBursar
);

// Get all bursars
router.get(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR
  ),
  bursarController.getBursars
);

// Get bursars by school
router.get(
  "/school/:schoolId",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR
  ),
  bursarController.getBursarsBySchool
);

// Get one bursar
router.get(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.BURSAR
  ),
  bursarController.getBursar
);

// Update bursar
router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  bursarController.updateBursar
);

// Delete bursar
router.delete(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  bursarController.deleteBursar
);

module.exports = router;
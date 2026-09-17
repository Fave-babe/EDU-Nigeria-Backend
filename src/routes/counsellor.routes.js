const router = require("express").Router();

const counsellorController = require("../controllers/counsellor.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Create counsellor
router.post(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  counsellorController.createCounsellor
);

// Get all counsellors
router.get(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.COUNSELLOR
  ),
  counsellorController.getCounsellors
);

// Get counsellors by school
router.get(
  "/school/:schoolId",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.COUNSELLOR
  ),
  counsellorController.getCounsellorsBySchool
);

// Get one counsellor
router.get(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.COUNSELLOR
  ),
  counsellorController.getCounsellor
);

// Update counsellor
router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  counsellorController.updateCounsellor
);

// Delete counsellor
router.delete(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  counsellorController.deleteCounsellor
);

module.exports = router;
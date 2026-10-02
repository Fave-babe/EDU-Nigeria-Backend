const router = require("express").Router();

const parentController = require("../controllers/parent.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// Create parent
router.post(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  parentController.createParent
);

// Get all parents
router.get(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  parentController.getParents
);

// Get logged-in parent's dashboard
router.get(
  "/me/dashboard",
  protect,
  RestrictTo(ROLES.PARENT),
  parentController.getMyDashboard
);

// Get one parent
router.get(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.PARENT
  ),
  parentController.getParent
);

// Update parent
router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.PARENT
  ),
  parentController.updateParent
);

// Add child to parent
router.post(
  "/:id/children",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF,
    ROLES.PARENT
  ),
  parentController.addChild
);

// Remove child from parent
router.delete(
  "/:id/children/:studentId",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.STAFF
  ),
  parentController.removeChild
);

// Delete parent
router.delete(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  parentController.deleteParent
);

module.exports = router;
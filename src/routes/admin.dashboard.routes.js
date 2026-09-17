
const router = require("express").Router();

const adminDashboardController = require(
  "../controllers/admin.dashboard.controller"
);

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

router.get(
  "/overview",
  protect,
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  adminDashboardController.getOverview
);

module.exports = router;


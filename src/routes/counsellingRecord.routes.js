const router = require("express").Router();

const counsellingRecordController = require("../controllers/counsellingRecord.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// =====================================================
// COUNSELLING RECORD ROUTES
// =====================================================

// Create counselling record
router.post(
  "/",
  protect,
  RestrictTo(ROLES.STAFF, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  counsellingRecordController.createRecord
);

// Get records for a school
router.get(
  "/school/:schoolId",
  protect,
  RestrictTo(
    ROLES.STAFF,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  counsellingRecordController.getRecordsBySchool
);

// Get records for a counsellor
router.get(
  "/counsellor/:counsellorId",
  protect,
  RestrictTo(
    ROLES.STAFF,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  counsellingRecordController.getRecordsByCounsellor
);

router.get(
  "/counsellor/:counsellorId/followups",
  protect,
  RestrictTo(
    ROLES.STAFF,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  counsellingRecordController.getFollowUpsByCounsellor
);

// Get one counselling record
router.get(
  "/:id",
  protect,
  RestrictTo(
    ROLES.STAFF,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  counsellingRecordController.getRecord
);

// Update counselling record
router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.STAFF,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  counsellingRecordController.updateRecord
);

// Delete counselling record
router.delete(
  "/:id",
  protect,
  RestrictTo(
    ROLES.STAFF,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  counsellingRecordController.deleteRecord
);

module.exports = router;
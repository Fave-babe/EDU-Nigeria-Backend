const router = require("express").Router();

const classSubjectController = require("../controllers/classsubject.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

// =========================================================
// CREATE CLASS SUBJECT
// =========================================================

router.post(
  "/",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classSubjectController.createClassSubject
);

// =========================================================
// GET ONE CLASS SUBJECT
// =========================================================

router.get(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  classSubjectController.getClassSubject
);

// =========================================================
// GET SUBJECTS BY CLASS
// =========================================================

router.get(
  "/class/:classId",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  classSubjectController.getClassSubjectsByClass
);

// =========================================================
// GET CLASSES BY TEACHER
// =========================================================

router.get(
  "/teacher/:teacherId",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER
  ),
  classSubjectController.getClassSubjectsByTeacher
);

// =========================================================
// UPDATE CLASS SUBJECT
// =========================================================

router.put(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classSubjectController.updateClassSubject
);

// =========================================================
// TOGGLE STATUS
// =========================================================

router.patch(
  "/:id/status",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classSubjectController.toggleClassSubject
);

// =========================================================
// DELETE CLASS SUBJECT
// =========================================================

router.delete(
  "/:id",
  protect,
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  ),
  classSubjectController.deleteClassSubject
);

module.exports = router;
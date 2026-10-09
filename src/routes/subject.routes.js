const router = require("express").Router();

const subjectController = require("../controllers/subject.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

const { ROLES } = require("../config/constant");

router.use(protect);

router.post(
  "/",
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  subjectController.createSubject
);

router.get(
  "/school/:schoolId",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF,
    ROLES.STUDENT
  ),
  subjectController.getSchoolSubjects
);

router.get(
  "/:id",
  RestrictTo(
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.TEACHER,
    ROLES.STAFF
  ),
  subjectController.getSubject
);

router.put(
  "/:id",
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  subjectController.updateSubject
);

router.patch(
  "/:id/status",
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  subjectController.toggleSubjectStatus
);

router.delete(
  "/:id",
  RestrictTo(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  subjectController.deleteSubject
);

module.exports = router;
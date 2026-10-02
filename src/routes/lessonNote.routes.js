const router = require("express").Router();

const lessonNoteController = require("../controllers/lessonNote.controller");

const {
  protect,
  RestrictTo,
} = require("../middleware/auth.middlware");

// =====================================================
// PROTECT ALL LESSON NOTE ROUTES
// =====================================================

router.use(protect);

// =====================================================
// STUDENT LESSON NOTES
// GET /api/v1/lesson-note/student
// =====================================================

router.get(
  "/student",
  RestrictTo("student"),
  lessonNoteController.getStudentLessonNotes
);

// =====================================================
// TEACHER LESSON NOTES
// =====================================================

router.get(
  "/teacher",
  RestrictTo("teacher"),
  lessonNoteController.getTeacherLessonNotes
);

router.post(
  "/",
  RestrictTo("teacher"),
  lessonNoteController.createLessonNote
);

router.get(
  "/:id",
  lessonNoteController.getLessonNote
);

router.patch(
  "/:id",
  RestrictTo("teacher"),
  lessonNoteController.updateLessonNote
);

router.delete(
  "/:id",
  RestrictTo("teacher"),
  lessonNoteController.deleteLessonNote
);

module.exports = router;
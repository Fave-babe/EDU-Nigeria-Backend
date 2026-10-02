const LessonNote = require("../models/LessonNote.model");
const Class = require("../models/Class.model");
const Enrollment = require("../models/Enrollement.model");

// =====================================================
// CREATE LESSON NOTE
// =====================================================

exports.createLessonNote = async (req, res) => {
  try {
    const {
      title,
      subject,
      class: classId,
      content,
      academicSession,
      term,
      isPublished,
    } = req.body;

    // Get logged-in teacher
    const teacherId = req.user._id;

    // Find teacher's class
    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Make sure the class belongs to the teacher's school
    if (classData.school.toString() !== req.user.school.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot create a lesson note for this class",
      });
    }

    const lessonNote = await LessonNote.create({
      title,
      subject,
      class: classId,
      content,
      teacher: teacherId,
      school: req.user.school,
      academicSession,
      term,
      isPublished: isPublished ?? false,
    });

    return res.status(201).json({
      success: true,
      message: "Lesson note created successfully",
      lessonNote,
    });
  } catch (error) {
    console.error("CREATE LESSON NOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create lesson note",
      error: error.message,
    });
  }
};


// =====================================================
// GET TEACHER LESSON NOTES
// =====================================================

exports.getTeacherLessonNotes = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const lessonNotes = await LessonNote.find({
      teacher: teacherId,
      school: req.user.school,
    })
      .populate("class", "name level arm")
      .populate("academicSession", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: lessonNotes.length,
      lessonNotes,
    });
  } catch (error) {
    console.error("GET TEACHER LESSON NOTES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lesson notes",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE LESSON NOTE
// =====================================================

exports.getLessonNote = async (req, res) => {
  try {
    const lessonNote = await LessonNote.findOne({
      _id: req.params.id,
      school: req.user.school,
    })
      .populate("teacher", "firstName lastName email")
      .populate("class", "name level arm")
      .populate("academicSession", "name");

    if (!lessonNote) {
      return res.status(404).json({
        success: false,
        message: "Lesson note not found",
      });
    }

    return res.status(200).json({
      success: true,
      lessonNote,
    });
  } catch (error) {
    console.error("GET LESSON NOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lesson note",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE LESSON NOTE
// =====================================================

exports.updateLessonNote = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const lessonNote = await LessonNote.findOne({
      _id: req.params.id,
      teacher: teacherId,
      school: req.user.school,
    });

    if (!lessonNote) {
      return res.status(404).json({
        success: false,
        message: "Lesson note not found",
      });
    }

    const allowedFields = [
      "title",
      "subject",
      "class",
      "content",
      "academicSession",
      "term",
      "isPublished",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        lessonNote[field] = req.body[field];
      }
    });

    await lessonNote.save();

    return res.status(200).json({
      success: true,
      message: "Lesson note updated successfully",
      lessonNote,
    });
  } catch (error) {
    console.error("UPDATE LESSON NOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update lesson note",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE LESSON NOTE
// =====================================================

exports.deleteLessonNote = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const lessonNote = await LessonNote.findOneAndDelete({
      _id: req.params.id,
      teacher: teacherId,
      school: req.user.school,
    });

    if (!lessonNote) {
      return res.status(404).json({
        success: false,
        message: "Lesson note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lesson note deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LESSON NOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lesson note",
      error: error.message,
    });
  }
};

// =====================================================
// GET PUBLISHED LESSON NOTES FOR STUDENT
// =====================================================

exports.getStudentLessonNotes = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Find the student's active enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      status: "active",
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "No active class enrollment found for this student",
      });
    }

    // Find published lesson notes for the student's class
    const lessonNotes = await LessonNote.find({
      school: enrollment.school,
      class: enrollment.class,
      academicSession: enrollment.academicSession,
      isPublished: true,
    })
      .populate("teacher", "firstName lastName")
      .populate("class", "name level arm")
      .populate("academicSession", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: lessonNotes.length,
      lessonNotes,
    });
  } catch (error) {
    console.error("GET STUDENT LESSON NOTES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lesson notes",
      error: error.message,
    });
  }
};
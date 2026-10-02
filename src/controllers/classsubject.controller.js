const classSubjectService = require("../services/classsubject.service");

const createClassSubject = async (req, res, next) => {
  try {
    const classSubject = await classSubjectService.createAssignment(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Subject assigned to class successfully",
      data: classSubject,
    });
  } catch (error) {
    next(error);
  }
};

const getClassSubject = async (req, res, next) => {
  try {
    const classSubject = await classSubjectService.findById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: classSubject,
    });
  } catch (error) {
    next(error);
  }
};

const getClassSubjectsByClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { academicSession } = req.query;

    const classSubjects =
      await classSubjectService.findByClass(
        classId,
        academicSession
      );

    res.status(200).json({
      success: true,
      data: classSubjects,
    });
  } catch (error) {
    next(error);
  }
};

const getClassSubjectsByTeacher = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const { academicSession } = req.query;

    const classSubjects =
      await classSubjectService.findByTeacher(
        teacherId,
        academicSession
      );

    res.status(200).json({
      success: true,
      data: classSubjects,
    });
  } catch (error) {
    next(error);
  }
};

const updateClassSubject = async (req, res, next) => {
  try {
    const classSubject =
      await classSubjectService.updateAssignment(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Class subject updated successfully",
      data: classSubject,
    });
  } catch (error) {
    next(error);
  }
};

const toggleClassSubject = async (req, res, next) => {
  try {
    const classSubject =
      await classSubjectService.toggleStatus(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Class subject status updated successfully",
      data: classSubject,
    });
  } catch (error) {
    next(error);
  }
};

const deleteClassSubject = async (req, res, next) => {
  try {
    const result =
      await classSubjectService.deleteAssignment(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Class subject deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClassSubject,
  getClassSubject,
  getClassSubjectsByClass,
  getClassSubjectsByTeacher,
  updateClassSubject,
  toggleClassSubject,
  deleteClassSubject,
};
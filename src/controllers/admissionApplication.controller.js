
const admissionApplicationService = require("../services/admissionApplication.service");

class AdmissionApplicationController {
  // ==========================================
  // CREATE APPLICATION
  // ==========================================
  async createApplication(req, res, next) {
    try {
      const application =
        await admissionApplicationService.createApplication(req.body);

      res.status(201).json({
        success: true,
        message: "Admission application created successfully",
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // GET ONE APPLICATION
  // ==========================================
  async getApplication(req, res, next) {
    try {
      const application =
        await admissionApplicationService.getApplicationById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // GET ALL APPLICATIONS
  // ==========================================
  async getApplications(req, res, next) {
    try {
      const {
        school,
        applicationStatus,
        examStatus,
        page = 1,
        limit = 20,
      } = req.query;

      const result =
        await admissionApplicationService.getApplications({
          school,
          applicationStatus,
          examStatus,
          page: Number(page),
          limit: Number(limit),
        });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // GET APPLICATIONS BY SCHOOL
  // ==========================================
  async getApplicationsBySchool(req, res, next) {
    try {
      const applications =
        await admissionApplicationService.getApplicationsBySchool(
          req.params.schoolId
        );

      res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // SAVE EXAM RESULT
  // ==========================================
  async saveExamResult(req, res, next) {
    try {
      const application =
        await admissionApplicationService.saveExamResult(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "Entrance examination result saved successfully",
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // APPROVE APPLICATION
  // ==========================================
  async approveApplication(req, res, next) {
    try {
      const result =
        await admissionApplicationService.approveApplication(
          req.params.id,
          req.user._id
        );

      res.status(200).json({
        success: true,
        message: "Applicant approved and enrolled successfully",
        application: result.application,
        student: result.student,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // REJECT APPLICATION
  // ==========================================
  async rejectApplication(req, res, next) {
    try {
      const { rejectionReason } = req.body;

      const application =
        await admissionApplicationService.rejectApplication(
          req.params.id,
          req.user._id,
          rejectionReason
        );

      res.status(200).json({
        success: true,
        message: "Admission application rejected",
        application,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdmissionApplicationController();


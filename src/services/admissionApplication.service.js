
const AdmissionApplication = require("../models/AdmissionApplication.model");
const School = require("../models/School.model");
const Student = require("../models/Student.model");
const AppError = require("../utils/AppError");
const notificationService = require("./notification.service");
const { REGISTRATION_STATUS } = require("../config/constant");
const {
  sendAdmissionAcceptanceEmail,
} = require("./email.service");

class AdmissionApplicationService {
  // =====================================================
  // CREATE ADMISSION APPLICATION
  // =====================================================

 async createApplication(data) {
  const {
    firstName,
    lastName,
    gender,
    dob,
    email,
    password,
    phone,
    address,
    previousSchool,
    school,
    applyingForClass,
  } = data;

  if (!password) {
    throw new AppError("Password is required", 400);
  }

  const existingSchool = await School.findById(school);

  if (!existingSchool) {
    throw new AppError("School not found", 404);
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check existing admission application
  const existingApplication = await AdmissionApplication.findOne({
    email: normalizedEmail,
    school,
    applicationStatus: {
      $in: [
        "pending",
        "exam_pending",
        "exam_completed",
        "under_review",
        "approved",
        "enrolled",
      ],
    },
  });

  if (existingApplication) {
    throw new AppError(
      "An admission application already exists for this email.",
      409
    );
  }

  // Check if a student already exists with this email
  const existingStudent = await Student.findOne({
    email: normalizedEmail,
  });

  if (existingStudent) {
    throw new AppError(
      "A student account already exists with this email.",
      409
    );
  }

  // Create admission application
  const application = await AdmissionApplication.create({
    firstName,
    lastName,
    gender,
    dob,
    email: normalizedEmail,
    password,
    phone,
    address,
    previousSchool,
    school,
    applyingForClass,

    applicationStatus: "exam_pending",
    examStatus: "not_started",
  });

  return application;
}

  // =====================================================
  // GET SINGLE APPLICATION
  // =====================================================

  async getApplicationById(applicationId) {
    const application = await AdmissionApplication.findById(applicationId)
      .populate("school", "name schoolType")
      .populate(
        "student",
        "firstName lastName registrationNumber admissionNo email"
      );

    if (!application) {
      throw new AppError("Admission application not found", 404);
    }

    return application;
  }

  // =====================================================
  // GET APPLICATIONS
  // =====================================================

  async getApplications({
    school,
    applicationStatus,
    examStatus,
    page = 1,
    limit = 20,
  }) {
    const filter = {};

    if (school) {
      filter.school = school;
    }

    if (applicationStatus) {
      filter.applicationStatus = applicationStatus;
    }

    if (examStatus) {
      filter.examStatus = examStatus;
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      AdmissionApplication.find(filter)
        .populate("school", "name schoolType")
        .populate(
          "student",
          "firstName lastName registrationNumber admissionNo email"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      AdmissionApplication.countDocuments(filter),
    ]);

    return {
      applications,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // =====================================================
  // GET APPLICATIONS BY SCHOOL
  // =====================================================

  async getApplicationsBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    return AdmissionApplication.find({
      school: schoolId,
    })
      .populate("school", "name schoolType")
      .populate(
        "student",
        "firstName lastName registrationNumber admissionNo email"
      )
      .sort({ createdAt: -1 });
  }

  // =====================================================
  // SAVE ENTRANCE EXAM RESULT
  // =====================================================

  async saveExamResult(applicationId, data) {
    const {
      examScore,
      examTotal,
      examPercentage,
      examPassed,
      examAnswers,
    } = data;

    const application = await AdmissionApplication.findById(applicationId);

    if (!application) {
      throw new AppError("Admission application not found", 404);
    }

    if (application.applicationStatus === "rejected") {
      throw new AppError(
        "This admission application has already been rejected.",
        400
      );
    }

    if (application.applicationStatus === "enrolled") {
      throw new AppError(
        "This applicant has already been enrolled.",
        400
      );
    }

    application.examScore = Number(examScore);
    application.examTotal = Number(examTotal);
    application.examPercentage = Number(examPercentage);
    application.examPassed = Boolean(examPassed);

    application.examAnswers = Array.isArray(examAnswers)
      ? examAnswers
      : [];

    application.examDate = new Date();

    application.examStatus = "completed";
    application.applicationStatus = "under_review";

    await application.save();

    return application;
  }

  // =====================================================
  // APPROVE APPLICATION + CREATE STUDENT ACCOUNT
  // =====================================================

  async approveApplication(applicationId, adminId) {
  /*
   * password has select:false in the AdmissionApplication model.
   * +password explicitly includes it for this query.
   */
  const application = await AdmissionApplication.findById(
    applicationId
  ).select("+password");

  if (!application) {
    throw new AppError("Admission application not found", 404);
  }

  if (application.applicationStatus === "enrolled") {
    throw new AppError(
      "This applicant has already been enrolled.",
      400
    );
  }

  if (application.applicationStatus === "rejected") {
    throw new AppError(
      "A rejected application cannot be approved.",
      400
    );
  }

  if (application.examStatus !== "completed") {
    throw new AppError(
      "The applicant must complete the entrance examination before approval.",
      400
    );
  }

  // Password must exist before creating the student account
  if (!application.password) {
    throw new AppError(
      "This admission application does not contain a password. Please submit a new admission application.",
      400
    );
  }

  // Check if another student was already created
  const existingStudent = await Student.findOne({
    email: application.email,
  });

  if (existingStudent) {
    throw new AppError(
      "A student account already exists with this email.",
      409
    );
  }

  /*
   * CREATE STUDENT ACCOUNT
   *
   * Student model hashes the password in its pre-save hook.
   */
  const student = await Student.create({
    firstName: application.firstName,
    lastName: application.lastName,
    gender: application.gender,
    dob: application.dob,
    email: application.email,

    password: application.password,

    previousSchool: application.previousSchool,
    school: application.school,
    address: application.address,

    registrationStatus: REGISTRATION_STATUS.INITIATED,

    registeredBy: adminId,
    lastModifiedBy: adminId,
  });

  // Update admission application
  application.applicationStatus = "enrolled";
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();
  application.student = student._id;

  await application.save();

  // Send acceptance email
  const school = await School.findById(application.school).select(
    "name schoolType"
  );
  try {
  await notificationService.createNotification({
    school: application.school,
    recipient: student._id,
    recipientModel: "Student",
    title: "Admission Approved",
    message: `Congratulations ${student.firstName}! Your admission into ${school.name} has been approved successfully.`,
    type: "system",
    createdBy: adminId,
  });

  console.log(
    `Admission notification created for ${student.email}`
  );
} catch (notificationError) {
  console.error(
    "Admission approved, but notification could not be created:",
    notificationError.message
  );
}
  try {
    await sendAdmissionAcceptanceEmail({
      student,
      school,
      applyingForClass: application.applyingForClass,
    });

    console.log(
      `Admission acceptance email sent to ${student.email}`
    );
  } catch (emailError) {
    console.error(
      "Admission approved, but acceptance email could not be sent:",
      emailError.message
    );
  }

  return {
    application,
    student,
  };
}

  // =====================================================
  // REJECT APPLICATION
  // =====================================================

  async rejectApplication(
    applicationId,
    adminId,
    rejectionReason
  ) {
    const application = await AdmissionApplication.findById(
      applicationId
    );

    if (!application) {
      throw new AppError("Admission application not found", 404);
    }

    if (application.applicationStatus === "enrolled") {
      throw new AppError(
        "An enrolled student cannot have their application rejected.",
        400
      );
    }

    application.applicationStatus = "rejected";
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    application.rejectionReason = rejectionReason || null;

    await application.save();

    return application;
  }
}

module.exports = new AdmissionApplicationService();



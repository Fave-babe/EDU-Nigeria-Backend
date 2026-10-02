const Enrollment = require("../models/Enrollement.model");
const School = require("../models/School.model");
const Student = require("../models/Student.model");
const AcademicSession = require("../models/AcademicSession.model");
const Class = require("../models/Class.model");
const AppError = require("../utils/AppError");

class EnrollmentService {
  // Create enrollment
  async createEnrollment(data) {
    const {
      school,
      student,
      academicSession,
      class: classId,
      enrollmentDate,
      notes,
    } = data;

    // Check school
    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    // Check student
    const existingStudent =
      await Student.findById(student);

    if (!existingStudent) {
      throw new AppError("Student not found", 404);
    }

    // Check academic session belongs to school
    const session = await AcademicSession.findOne({
      _id: academicSession,
      school,
    });

    if (!session) {
      throw new AppError(
        "Academic session not found for this school",
        404
      );
    }

    // Check class belongs to school and session
    const schoolClass = await Class.findOne({
      _id: classId,
      school,
      academicSession,
    });

    if (!schoolClass) {
      throw new AppError(
        "Class not found for this academic session",
        404
      );
    }

    // Check if student is already enrolled
    const existingEnrollment =
      await Enrollment.findOne({
        student,
        academicSession,
      });

    if (existingEnrollment) {
      throw new AppError(
        "Student is already enrolled for this academic session",
        409
      );
    }

    // Check class capacity
    const currentEnrollment =
      await Enrollment.countDocuments({
        class: classId,
        academicSession,
        status: "active",
      });

    if (
      schoolClass.capacity &&
      currentEnrollment >= schoolClass.capacity
    ) {
      throw new AppError(
        "This class has reached its capacity",
        400
      );
    }

    const enrollment = await Enrollment.create({
      school,
      student,
      academicSession,
      class: classId,
      enrollmentDate,
      notes,
    });

    return enrollment;
  }

  // Get enrollment by ID
  async findById(enrollmentId) {
    const enrollment =
      await Enrollment.findById(enrollmentId)
        .populate(
          "school",
          "name schoolType"
        )
        .populate(
          "student",
          "firstName lastName email registrationNumber"
        )
        .populate(
          "academicSession",
          "name startDate endDate isCurrent"
        )
        .populate(
          "class",
          "name level arm capacity"
        );

    if (!enrollment) {
      throw new AppError(
        "Enrollment not found",
        404
      );
    }

    return enrollment;
  }

  // Get all enrollments for a student
  async findByStudent(studentId) {
    const student =
      await Student.findById(studentId);

    if (!student) {
      throw new AppError(
        "Student not found",
        404
      );
    }

    return Enrollment.find({
      student: studentId,
    })
      .populate(
        "academicSession",
        "name startDate endDate isCurrent"
      )
      .populate(
        "class",
        "name level arm"
      )
      .sort({
        enrollmentDate: -1,
      });
  }

  // Get all students in a class
  async findByClass(
    classId,
    academicSession
  ) {
    const schoolClass =
      await Class.findById(classId);

    if (!schoolClass) {
      throw new AppError(
        "Class not found",
        404
      );
    }

    const sessionId =
      academicSession ||
      schoolClass.academicSession;

    return Enrollment.find({
      class: classId,
      academicSession: sessionId,
      status: "active",
    })
      .populate(
        "student",
        "firstName lastName email registrationNumber gender"
      )
      .populate(
        "class",
        "name level arm"
      )
      .sort({
        "student.lastName": 1,
      });
  }

  // Get all enrollments for a school
  async findBySchool(
    schoolId,
    academicSession,
    classId
  ) {
    const school =
      await School.findById(schoolId);

    if (!school) {
      throw new AppError(
        "School not found",
        404
      );
    }

    const filter = {
      school: schoolId,
    };

    if (academicSession) {
      filter.academicSession =
        academicSession;
    }

    if (classId) {
      filter.class = classId;
    }

    return Enrollment.find(filter)
      .populate(
        "student",
        "firstName lastName email registrationNumber"
      )
      .populate(
        "class",
        "name level arm"
      )
      .populate(
        "academicSession",
        "name startDate endDate"
      )
      .sort({
        enrollmentDate: -1,
      });
  }

  // Update enrollment
  async updateEnrollment(
    enrollmentId,
    data
  ) {
    const enrollment =
      await Enrollment.findById(
        enrollmentId
      );

    if (!enrollment) {
      throw new AppError(
        "Enrollment not found",
        404
      );
    }

    // If moving the student to another class,
    // make sure the new class is valid.
    if (data.class) {
      const schoolClass =
        await Class.findOne({
          _id: data.class,
          school: enrollment.school,
          academicSession:
            enrollment.academicSession,
        });

      if (!schoolClass) {
        throw new AppError(
          "Class not found for this academic session",
          404
        );
      }
    }

    const updatedEnrollment =
      await Enrollment.findByIdAndUpdate(
        enrollmentId,
        data,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "student",
          "firstName lastName email registrationNumber"
        )
        .populate(
          "academicSession",
          "name startDate endDate"
        )
        .populate(
          "class",
          "name level arm"
        );

    return updatedEnrollment;
  }

  // Change enrollment status
  async updateStatus(
    enrollmentId,
    status
  ) {
    const allowedStatuses = [
      "active",
      "completed",
      "transferred",
      "withdrawn",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new AppError(
        "Invalid enrollment status",
        400
      );
    }

    const enrollment =
      await Enrollment.findByIdAndUpdate(
        enrollmentId,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!enrollment) {
      throw new AppError(
        "Enrollment not found",
        404
      );
    }

    return enrollment;
  }

  // Get current class and subjects for a student
// Get current class and subjects for a student
async getStudentAcademicInfo(studentId) {
  const enrollment = await Enrollment.findOne({
    student: studentId,
    status: "active",
  })
    .sort({ enrollmentDate: -1 })
    .populate(
      "academicSession",
      "name startDate endDate isCurrent"
    )
    .populate(
      "class",
      "name level arm capacity"
    );

  if (!enrollment) {
    throw new AppError(
      "No active enrollment found for this student",
      404
    );
  }

  const ClassSubject = require("../models/ClassSubject.model");

  const classSubjects = await ClassSubject.find({
    class: enrollment.class._id,
    academicSession: enrollment.academicSession._id,
    isActive: true,
  })
    .populate(
      "subject",
      "name code category isCompulsory"
    )
    .populate(
      "teacher",
      "firstName lastName email"
    )
    .sort({ createdAt: 1 });

  console.log("========== STUDENT ACADEMIC DEBUG ==========");
  console.log("STUDENT ID:", studentId);
  console.log("CLASS ID:", enrollment.class._id);
  console.log("CLASS:", enrollment.class);
  console.log(
    "ACADEMIC SESSION ID:",
    enrollment.academicSession._id
  );
  console.log(
    "ACADEMIC SESSION:",
    enrollment.academicSession
  );
  console.log("Subjects Found:", classSubjects.length);
  console.log(
    "Subjects:",
    JSON.stringify(classSubjects, null, 2)
  );
  console.log("======================================");
  return {
    enrollment,
    class: enrollment.class,
    academicSession: enrollment.academicSession,
    subjects: classSubjects,
  };
}
  // Delete enrollment
  async deleteEnrollment(
    enrollmentId
  ) {
    const enrollment =
      await Enrollment.findByIdAndDelete(
        enrollmentId
      );

    if (!enrollment) {
      throw new AppError(
        "Enrollment not found",
        404
      );
    }

    return enrollment;
  }
}

module.exports =
  new EnrollmentService();
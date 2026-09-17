const Result = require("../models/Result.model");
const School = require("../models/School.model");
const Student = require("../models/Student.model");
const Class = require("../models/Class.model");
const Subject = require("../models/Subject.model");
const AcademicSession = require("../models/AcademicSession.model");
const Teacher = require("../models/Teacher.model");
const AppError = require("../utils/AppError");

class ResultService {
  // Calculate grade
  calculateGrade(totalScore) {
    if (totalScore >= 75) return "A";
    if (totalScore >= 65) return "B";
    if (totalScore >= 55) return "C";
    if (totalScore >= 45) return "D";
    if (totalScore >= 40) return "E";
    return "F";
  }

  // Get remark
  getRemark(totalScore) {
    if (totalScore >= 75) return "Excellent";
    if (totalScore >= 65) return "Very Good";
    if (totalScore >= 55) return "Good";
    if (totalScore >= 45) return "Fair";
    if (totalScore >= 40) return "Pass";
    return "Fail";
  }

  // Create result
  async createResult(data) {
    const {
      school,
      student,
      class: classId,
      subject,
      academicSession,
      term,
      caScore = 0,
      examScore = 0,
      recordedBy,
    } = data;

    // Validate scores
    if (caScore < 0 || caScore > 40) {
      throw new AppError(
        "CA score must be between 0 and 40",
        400
      );
    }

    if (examScore < 0 || examScore > 60) {
      throw new AppError(
        "Exam score must be between 0 and 60",
        400
      );
    }

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

    // Check class
    const existingClass = await Class.findOne({
      _id: classId,
      school,
      academicSession,
    });

    if (!existingClass) {
      throw new AppError(
        "Class not found for this academic session",
        404
      );
    }

    // Check subject
    const existingSubject =
      await Subject.findOne({
        _id: subject,
        school,
      });

    if (!existingSubject) {
      throw new AppError(
        "Subject not found for this school",
        404
      );
    }

    // Check academic session
    const session =
      await AcademicSession.findOne({
        _id: academicSession,
        school,
      });

    if (!session) {
      throw new AppError(
        "Academic session not found for this school",
        404
      );
    }

    // Check teacher
    if (recordedBy) {
      const teacher =
        await Teacher.findById(recordedBy);

      if (!teacher) {
        throw new AppError(
          "Teacher not found",
          404
        );
      }
    }

    // Prevent duplicate result
    const existingResult =
      await Result.findOne({
        student,
        subject,
        academicSession,
        term,
      });

    if (existingResult) {
      throw new AppError(
        "Result already exists for this student, subject and term",
        409
      );
    }

    const totalScore =
      Number(caScore) + Number(examScore);

    const grade =
      this.calculateGrade(totalScore);

    const remark =
      this.getRemark(totalScore);

    const result = await Result.create({
      school,
      student,
      class: classId,
      subject,
      academicSession,
      term,
      caScore,
      examScore,
      totalScore,
      grade,
      remark,
      recordedBy,
    });

    return result;
  }

  // Get result by ID
  async findById(resultId) {
    const result = await Result.findById(resultId)
      .populate("school", "name")
      .populate(
        "student",
        "firstName lastName email registrationNumber"
      )
      .populate(
        "class",
        "name level arm"
      )
      .populate(
        "subject",
        "name code category"
      )
      .populate(
        "academicSession",
        "name startDate endDate"
      )
      .populate(
        "recordedBy",
        "firstName lastName email"
      );

    if (!result) {
      throw new AppError(
        "Result not found",
        404
      );
    }

    return result;
  }

  // Get student's results
  async findByStudent(
    studentId,
    academicSession,
    term
  ) {
    const student =
      await Student.findById(studentId);

    if (!student) {
      throw new AppError(
        "Student not found",
        404
      );
    }

    const filter = {
      student: studentId,
    };

    if (academicSession) {
      filter.academicSession =
        academicSession;
    }

    if (term) {
      filter.term = term;
    }

    return Result.find(filter)
      .populate(
        "subject",
        "name code category"
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
        "subject.name": 1,
      });
  }

  // Get class results
  async findByClass(
    classId,
    academicSession,
    term
  ) {
    const schoolClass =
      await Class.findById(classId);

    if (!schoolClass) {
      throw new AppError(
        "Class not found",
        404
      );
    }

    const filter = {
      class: classId,
    };

    if (academicSession) {
      filter.academicSession =
        academicSession;
    }

    if (term) {
      filter.term = term;
    }

    return Result.find(filter)
      .populate(
        "student",
        "firstName lastName registrationNumber"
      )
      .populate(
        "subject",
        "name code"
      )
      .sort({
        student: 1,
        subject: 1,
      });
  }

  // Update result
  async updateResult(resultId, data) {
    const result =
      await Result.findById(resultId);

    if (!result) {
      throw new AppError(
        "Result not found",
        404
      );
    }

    const caScore =
      data.caScore !== undefined
        ? Number(data.caScore)
        : result.caScore;

    const examScore =
      data.examScore !== undefined
        ? Number(data.examScore)
        : result.examScore;

    if (caScore < 0 || caScore > 40) {
      throw new AppError(
        "CA score must be between 0 and 40",
        400
      );
    }

    if (examScore < 0 || examScore > 60) {
      throw new AppError(
        "Exam score must be between 0 and 60",
        400
      );
    }

    const totalScore =
      caScore + examScore;

    const updatedResult =
      await Result.findByIdAndUpdate(
        resultId,
        {
          ...data,
          caScore,
          examScore,
          totalScore,
          grade: this.calculateGrade(
            totalScore
          ),
          remark: this.getRemark(
            totalScore
          ),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return updatedResult;
  }

  // Submit result
  async submitResult(resultId) {
    const result =
      await Result.findByIdAndUpdate(
        resultId,
        {
          status: "submitted",
        },
        {
          new: true,
        }
      );

    if (!result) {
      throw new AppError(
        "Result not found",
        404
      );
    }

    return result;
  }

  // Approve result
  async approveResult(resultId) {
    const result =
      await Result.findByIdAndUpdate(
        resultId,
        {
          status: "approved",
        },
        {
          new: true,
        }
      );

    if (!result) {
      throw new AppError(
        "Result not found",
        404
      );
    }

    return result;
  }

  // Publish result
  async publishResult(resultId) {
    const result =
      await Result.findByIdAndUpdate(
        resultId,
        {
          status: "published",
        },
        {
          new: true,
        }
      );

    if (!result) {
      throw new AppError(
        "Result not found",
        404
      );
    }

    return result;
  }

  // Delete result
  async deleteResult(resultId) {
    const result =
      await Result.findByIdAndDelete(
        resultId
      );

    if (!result) {
      throw new AppError(
        "Result not found",
        404
      );
    }

    return result;
  }
}

module.exports = new ResultService();
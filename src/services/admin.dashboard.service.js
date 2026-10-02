
const Admin = require("../models/Admin.model");
const Student = require("../models/Student.model");
const Teacher = require("../models/Teacher.model");
const Staff = require("../models/Staff.model");
const Parent = require("../models/Parent.model");
const Class = require("../models/Class.model");
const Enrollment = require("../models/Enrollement.model");
const Attendance = require("../models/attendance.model");

const AppError = require("../utils/AppError");

/**
 * Get dashboard overview for a school.
 *
 * Admin users are automatically restricted to their own school.
 *
 * @param {Object} currentUser - Logged in user from req.user
 */
exports.getDashboardOverview = async (currentUser) => {
  if (!currentUser) {
    throw new AppError("Not authenticated. Please log in.", 401);
  }

  if (!currentUser.school) {
    throw new AppError("Your account is not assigned to a school.", 400);
  }

  const schoolId = currentUser.school;

  /*
   * ---------------------------------------------------------
   * BASIC COUNTS
   * ---------------------------------------------------------
   */

  const [
    totalStudents,
    totalTeachers,
    totalStaff,
    totalClasses,
  ] = await Promise.all([
    Student.countDocuments({
      school: schoolId,
    }),

    Teacher.countDocuments({
      school: schoolId,
    }),

    Staff.countDocuments({
      school: schoolId,
    }),

    Class.countDocuments({
      school: schoolId,
    }),
  ]);

  /*
   * ---------------------------------------------------------
   * STUDENT REGISTRATION STATUS
   * ---------------------------------------------------------
   */

  const studentRegistrationStats =
    await Student.aggregate([
      {
        $match: {
          school: schoolId,
        },
      },
      {
        $group: {
          _id: "$registrationStatus",
          count: { $sum: 1 },
        },
      },
    ]);

  const studentRegistration = {
    initiated: 0,
    incomplete: 0,
    complete: 0,
    verified: 0,
    suspended: 0,
  };

  studentRegistrationStats.forEach((item) => {
    if (item._id && studentRegistration[item._id] !== undefined) {
      studentRegistration[item._id] = item.count;
    }
  });

  /*
   * ---------------------------------------------------------
   * STUDENT PAYMENT STATUS
   * ---------------------------------------------------------
   */

  const studentPaymentStats =
    await Student.aggregate([
      {
        $match: {
          school: schoolId,
        },
      },
      {
        $group: {
          _id: "$payment.status",
          count: { $sum: 1 },
        },
      },
    ]);

  const studentPayments = {
    paid: 0,
    unpaid: 0,
    refunded: 0,
  };

  studentPaymentStats.forEach((item) => {
    if (item._id && studentPayments[item._id] !== undefined) {
      studentPayments[item._id] = item.count;
    }
  });

  /*
   * ---------------------------------------------------------
   * BIOMETRIC VERIFICATION
   * ---------------------------------------------------------
   */

  const biometricStats = await Student.aggregate([
    {
      $match: {
        school: schoolId,
      },
    },
    {
      $group: {
        _id: "$biometricVerification",
        count: { $sum: 1 },
      },
    },
  ]);

  let biometricVerified = 0;
  let biometricNotVerified = 0;

  biometricStats.forEach((item) => {
    if (item._id === true) {
      biometricVerified = item.count;
    }

    if (item._id === false || item._id === null) {
      biometricNotVerified += item.count;
    }
  });

  /*
   * ---------------------------------------------------------
   * TEACHER STATISTICS
   * ---------------------------------------------------------
   */

  const teacherStats = await Teacher.aggregate([
    {
      $match: {
        school: schoolId,
      },
    },
    {
      $group: {
        _id: "$isActive",
        count: { $sum: 1 },
      },
    },
  ]);

  let activeTeachers = 0;
  let inactiveTeachers = 0;

  teacherStats.forEach((item) => {
    if (item._id === true) {
      activeTeachers = item.count;
    }

    if (item._id === false) {
      inactiveTeachers = item.count;
    }
  });

  /*
   * ---------------------------------------------------------
   * STAFF STATISTICS
   * ---------------------------------------------------------
   */

  const staffStats = await Staff.aggregate([
    {
      $match: {
        school: schoolId,
      },
    },
    {
      $group: {
        _id: "$isActive",
        count: { $sum: 1 },
      },
    },
  ]);

  let activeStaff = 0;
  let inactiveStaff = 0;

  staffStats.forEach((item) => {
    if (item._id === true) {
      activeStaff = item.count;
    }

    if (item._id === false) {
      inactiveStaff = item.count;
    }
  });

  /*
   * ---------------------------------------------------------
   * CLASS STATISTICS
   * ---------------------------------------------------------
   */

  const classStats = await Class.aggregate([
    {
      $match: {
        school: schoolId,
      },
    },
    {
      $group: {
        _id: "$isActive",
        count: { $sum: 1 },
      },
    },
  ]);

  let activeClasses = 0;
  let inactiveClasses = 0;

  classStats.forEach((item) => {
    if (item._id === true) {
      activeClasses = item.count;
    }

    if (item._id === false) {
      inactiveClasses = item.count;
    }
  });

  /*
   * ---------------------------------------------------------
   * ENROLLMENT STATISTICS
   * ---------------------------------------------------------
   */

  const enrollmentStats = await Enrollment.aggregate([
    {
      $match: {
        school: schoolId,
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const enrollments = {
    active: 0,
    completed: 0,
    transferred: 0,
    withdrawn: 0,
  };

  enrollmentStats.forEach((item) => {
    if (item._id && enrollments[item._id] !== undefined) {
      enrollments[item._id] = item.count;
    }
  });

  /*
   * ---------------------------------------------------------
   * PARENT COUNT
   * ---------------------------------------------------------
   *
   * Parent does not have a school field.
   *
   * We therefore:
   *
   * 1. Find students belonging to this school.
   * 2. Find parents whose children contain those students.
   * 3. Count distinct parents.
   */

  const schoolStudentIds = await Student.find({
    school: schoolId,
  }).distinct("_id");

  const totalParents = await Parent.countDocuments({
    children: {
      $in: schoolStudentIds,
    },
  });

  /*
   * ---------------------------------------------------------
   * ATTENDANCE SUMMARY
   * ---------------------------------------------------------
   *
   * For now this returns attendance statistics for TODAY.
   */

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const attendanceStats = await Attendance.aggregate([
    {
      $match: {
        school: schoolId,
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const attendance = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  };

  attendanceStats.forEach((item) => {
    if (item._id && attendance[item._id] !== undefined) {
      attendance[item._id] = item.count;
    }
  });

  /*
   * ---------------------------------------------------------
   * STUDENTS PER CLASS
   * ---------------------------------------------------------
   */

  const studentsPerClass = await Enrollment.aggregate([
    {
      $match: {
        school: schoolId,
        status: "active",
      },
    },

    {
      $group: {
        _id: "$class",
        studentCount: {
          $sum: 1,
        },
      },
    },

    {
      $lookup: {
        from: "classes",
        localField: "_id",
        foreignField: "_id",
        as: "class",
      },
    },

    {
      $unwind: {
        path: "$class",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,
        classId: "$_id",
        className: "$class.name",
        level: "$class.level",
        arm: "$class.arm",
        capacity: "$class.capacity",
        studentCount: 1,
      },
    },

    {
      $sort: {
        level: 1,
        className: 1,
      },
    },
  ]);

  /*
   * ---------------------------------------------------------
   * RECENT STUDENTS
   * ---------------------------------------------------------
   */

  const recentStudents = await Student.find({
    school: schoolId,
  })
    .select(
      "firstName lastName email registrationNumber registrationStatus payment.status createdAt"
    )
    .sort({
      createdAt: -1,
    })
    .limit(5)
    .lean();

  /*
   * ---------------------------------------------------------
   * RECENT ENROLLMENTS
   * ---------------------------------------------------------
   */

  const recentEnrollments = await Enrollment.find({
    school: schoolId,
  })
    .populate("student", "firstName lastName registrationNumber")
    .populate("class", "name level arm")
    .sort({
      enrollmentDate: -1,
    })
    .limit(5)
    .lean();

  /*
   * ---------------------------------------------------------
   * FINAL DASHBOARD RESPONSE
   * ---------------------------------------------------------
   */

  return {
    overview: {
      students: totalStudents,
      teachers: totalTeachers,
      staff: totalStaff,
      parents: totalParents,
      classes: totalClasses,
    },

    teachers: {
      total: totalTeachers,
      active: activeTeachers,
      inactive: inactiveTeachers,
    },

    staff: {
      total: totalStaff,
      active: activeStaff,
      inactive: inactiveStaff,
    },

    classes: {
      total: totalClasses,
      active: activeClasses,
      inactive: inactiveClasses,
      studentsPerClass,
    },

    students: {
      total: totalStudents,
      registration: studentRegistration,
      payments: studentPayments,
      biometric: {
        verified: biometricVerified,
        notVerified: biometricNotVerified,
      },
    },

    parents: {
      total: totalParents,
    },

    enrollment: {
      total:
        enrollments.active +
        enrollments.completed +
        enrollments.transferred +
        enrollments.withdrawn,

      ...enrollments,
    },

    attendance: {
      date: startOfToday,
      ...attendance,
    },

    recentStudents,

    recentEnrollments,
  };
};



const Admin = require("../models/Admin.model");
const School = require("../models/School.model");
const Student = require("../models/Student.model");
const Teacher = require("../models/Teacher.model");
const Staff = require("../models/Staff.model");
const Parent = require("../models/Parent.model");
const Class = require("../models/Class.model");
const Enrollment = require("../models/Enrollement.model");
const Attendance = require("../models/attendance.model");

const AppError = require("../utils/AppError");
const { ROLES } = require("../config/constant");

class AdminService {
  // =====================================================
  // CREATE ADMIN
  // =====================================================

  async createAdmin(data) {
    const { email, school, ...rest } = data;

    if (!school) {
      throw new AppError("School is required", 400);
    }

    const existingSchool = await School.findOne({
      _id: school,
      isActive: true,
    });

    if (!existingSchool) {
      throw new AppError(
        "School not found or is inactive",
        404
      );
    }

    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      throw new AppError("Email is required", 400);
    }

    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      throw new AppError(
        "An admin with this email already exists",
        409
      );
    }

    const admin = await Admin.create({
      ...rest,
      email: normalizedEmail,
      school,
      role: ROLES.ADMIN,
    });

    return admin;
  }

  // =====================================================
  // GET ADMIN BY ID
  // =====================================================

  async findById(adminId) {
    const admin = await Admin.findOne({
      _id: adminId,
      role: ROLES.ADMIN,
    }).populate(
      "school",
      "name schoolType email phone"
    );

    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    return admin;
  }

  // =====================================================
  // GET ALL ADMINS
  // =====================================================

  async findAll({
    school,
    isActive,
    page = 1,
    limit = 20,
  }) {
    page = Math.max(Number(page) || 1, 1);

    limit = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const filter = {
      role: ROLES.ADMIN,
    };

    if (school) {
      filter.school = school;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      Admin.find(filter)
        .populate(
          "school",
          "name schoolType"
        )
        .skip(skip)
        .limit(limit)
        .sort({
          createdAt: -1,
        }),

      Admin.countDocuments(filter),
    ]);

    return {
      admins,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // =====================================================
  // UPDATE ADMIN
  // =====================================================

  async updateAdmin(
    adminId,
    data,
    currentUser
  ) {
    delete data.role;
    delete data.password;

    const existingAdmin = await Admin.findOne({
      _id: adminId,
      role: ROLES.ADMIN,
    });

    if (!existingAdmin) {
      throw new AppError("Admin not found", 404);
    }

    if (
      currentUser.role === ROLES.ADMIN &&
      currentUser._id.toString() !==
        existingAdmin._id.toString()
    ) {
      throw new AppError(
        "You can only update your own admin account",
        403
      );
    }

    if (data.school) {
      const school = await School.findOne({
        _id: data.school,
        isActive: true,
      });

      if (!school) {
        throw new AppError(
          "School not found or is inactive",
          404
        );
      }
    }

    if (data.email) {
      data.email = data.email.toLowerCase().trim();

      const duplicate = await Admin.findOne({
        email: data.email,
        _id: {
          $ne: adminId,
        },
      });

      if (duplicate) {
        throw new AppError(
          "An admin with this email already exists",
          409
        );
      }
    }

    const admin = await Admin.findOneAndUpdate(
      {
        _id: adminId,
        role: ROLES.ADMIN,
      },
      data,
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "school",
      "name schoolType"
    );

    if (!admin) {
      throw new AppError(
        "Admin not found",
        404
      );
    }

    return admin;
  }

  // =====================================================
  // DELETE ADMIN
  // =====================================================

  async deleteAdmin(adminId) {
    const admin = await Admin.findOneAndDelete({
      _id: adminId,
      role: ROLES.ADMIN,
    });

    if (!admin) {
      throw new AppError(
        "Admin not found",
        404
      );
    }

    return admin;
  }

  // =====================================================
  // GET ADMINS BY SCHOOL
  // =====================================================

  async getAdminsBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError(
        "School not found",
        404
      );
    }

    const admins = await Admin.find({
      school: schoolId,
      role: ROLES.ADMIN,
    })
      .populate(
        "school",
        "name schoolType"
      )
      .sort({
        createdAt: -1,
      });

    return admins;
  }

  // =====================================================
  // GET ADMIN DASHBOARD OVERVIEW
  // =====================================================

  async getDashboardOverview(currentUser) {
    if (!currentUser) {
      throw new AppError(
        "Not authenticated. Please log in.",
        401
      );
    }

    if (!currentUser.school) {
      throw new AppError(
        "Your account is not assigned to a school.",
        400
      );
    }

    const schoolId =
      currentUser.school?._id ||
      currentUser.school;

    // -----------------------------------------------------
    // BASIC COUNTS
    // -----------------------------------------------------

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

    console.log(
      "DASHBOARD CHECKPOINT 1: basic counts completed"
    );

    // -----------------------------------------------------
    // STUDENT REGISTRATION
    // -----------------------------------------------------

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
            count: {
              $sum: 1,
            },
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
      if (
        item._id &&
        studentRegistration[item._id] !== undefined
      ) {
        studentRegistration[item._id] = item.count;
      }
    });

    console.log(
      "DASHBOARD CHECKPOINT 2: registration stats completed"
    );

    // -----------------------------------------------------
    // STUDENT PAYMENTS
    // -----------------------------------------------------

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
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const studentPayments = {
      paid: 0,
      unpaid: 0,
      refunded: 0,
    };

    studentPaymentStats.forEach((item) => {
      if (
        item._id &&
        studentPayments[item._id] !== undefined
      ) {
        studentPayments[item._id] = item.count;
      }
    });

    console.log(
      "DASHBOARD CHECKPOINT 3: payment stats completed"
    );

    // -----------------------------------------------------
    // BIOMETRIC
    // -----------------------------------------------------

    const biometricStats =
      await Student.aggregate([
        {
          $match: {
            school: schoolId,
          },
        },
        {
          $group: {
            _id: "$biometricVerification",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    let biometricVerified = 0;
    let biometricNotVerified = 0;

    biometricStats.forEach((item) => {
      if (item._id === true) {
        biometricVerified = item.count;
      }

      if (
        item._id === false ||
        item._id === null
      ) {
        biometricNotVerified += item.count;
      }
    });

    console.log(
      "DASHBOARD CHECKPOINT 4: biometric stats completed"
    );

    // -----------------------------------------------------
// TEACHERS
// -----------------------------------------------------

const teachersForSchool = await Teacher.find({
  school: schoolId,
}).select(
  "_id firstName lastName email school isActive"
);

console.log(
  "TEACHERS FOR ADMIN SCHOOL:",
  teachersForSchool
);

console.log(
  "ADMIN SCHOOL ID:",
  schoolId
);

const teacherStats =
  await Teacher.aggregate([
    {
      $match: {
        school: schoolId,
      },
    },
    {
      $group: {
        _id: "$isActive",
        count: {
          $sum: 1,
        },
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

    // -----------------------------------------------------
    // STAFF
    // -----------------------------------------------------

    const staffStats =
      await Staff.aggregate([
        {
          $match: {
            school: schoolId,
          },
        },
        {
          $group: {
            _id: "$isActive",
            count: {
              $sum: 1,
            },
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

    console.log(
      "DASHBOARD CHECKPOINT 6: staff stats completed"
    );

    // -----------------------------------------------------
    // CLASSES
    // -----------------------------------------------------

    const classStats =
      await Class.aggregate([
        {
          $match: {
            school: schoolId,
          },
        },
        {
          $group: {
            _id: "$isActive",
            count: {
              $sum: 1,
            },
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

    console.log(
      "DASHBOARD CHECKPOINT 7: class stats completed"
    );

    // -----------------------------------------------------
    // ENROLLMENTS
    // -----------------------------------------------------

    const enrollmentStats =
      await Enrollment.aggregate([
        {
          $match: {
            school: schoolId,
          },
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
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
      if (
        item._id &&
        enrollments[item._id] !== undefined
      ) {
        enrollments[item._id] = item.count;
      }
    });

    console.log(
      "DASHBOARD CHECKPOINT 8: enrollment stats completed"
    );

    // -----------------------------------------------------
    // PARENTS
    // -----------------------------------------------------

    const schoolStudentIds =
      await Student.find({
        school: schoolId,
      }).distinct("_id");

    console.log(
      "DASHBOARD CHECKPOINT 9: student IDs completed"
    );

    const totalParents =
      await Parent.countDocuments({
        children: {
          $in: schoolStudentIds,
        },
      });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    console.log(
      "DASHBOARD CHECKPOINT 10: parent count completed"
    );

    // -----------------------------------------------------
    // ATTENDANCE
    // -----------------------------------------------------

    const attendanceStats =
      await Attendance.aggregate([
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
            count: {
              $sum: 1,
            },
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
      if (
        item._id &&
        attendance[item._id] !== undefined
      ) {
        attendance[item._id] = item.count;
      }
    });

    console.log(
      "DASHBOARD CHECKPOINT 11: attendance stats completed"
    );

    // -----------------------------------------------------
    // STUDENTS PER CLASS
    // -----------------------------------------------------

    const studentsPerClass =
      await Enrollment.aggregate([
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

    console.log(
      "DASHBOARD CHECKPOINT 12: students per class completed"
    );

    // -----------------------------------------------------
    // RECENT STUDENTS
    // -----------------------------------------------------

    const recentStudents =
      await Student.find({
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

    console.log(
      "DASHBOARD CHECKPOINT 13: recent students completed"
    );

    // -----------------------------------------------------
    // RECENT ENROLLMENTS
    // -----------------------------------------------------

    const recentEnrollments =
      await Enrollment.find({
        school: schoolId,
      })
        .sort({
          enrollmentDate: -1,
        })
        .limit(5)
        .lean();

    console.log(
      "DASHBOARD CHECKPOINT 14: recent enrollments completed"
    );

    // -----------------------------------------------------
    // RETURN DASHBOARD DATA
    // -----------------------------------------------------

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
  }
}

module.exports = new AdminService();

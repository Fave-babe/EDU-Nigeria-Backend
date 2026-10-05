require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const assignmentRoutes = require("./routes/assignment.routes");
const notificationRoutes = require("./routes/notification.routes");
const resultRoutes = require("./routes/result.routes");
const announcementRoutes = require("./routes/announcement.routes");
const timetableRouter = require("./routes/timetable.routes");
const subjectRoutes = require("./routes/subject.routes");
const classSubjectRouter = require("./routes/classsubject.routes");
const admissionApplicationRoutes = require("./routes/admissionApplication.routes");
const lessonNoteRouter = require("./routes/lessonNote.routes");
const enrollementRouter = require("./routes/enrollement.routes");
const classRouter = require("./routes/class.routes");
const teacherRouter = require("./routes/teacher.routes");
const schoolRouter = require("./routes/school.routes");
const authRouter = require("./routes/auth.routes");
const parentRouter = require("./routes/parent.routes");
const studentRouter = require("./routes/student.routes");
const adminRouter = require("./routes/admin.routes");
const adminDashboardRoutes = require("./routes/admin.dashboard.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const paymentRoutes = require("./routes/payment.routes");
const academicSessionRoutes = require("./routes/academicsession.routes");
const counsellingRecordRoutes = require("./routes/counsellingRecord.routes");
const counsellorRoutes = require("./routes/counsellor.routes");
const bursarRoutes = require("./routes/bursar.routes");
const feesRoutes = require("./routes/fees.routes");
const staffRoutes = require("./routes/staff.routes");
const superAdminRoutes = require("./routes/superadmin.routes");

const allowedOrigins = [
  "http://localhost:5173",
  "https://edu-nigeria.vercel.app",
  "https://edu-nigeria-ulgk.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/parent", parentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin-dashboard", adminDashboardRoutes);
app.use("/api/v1/school", schoolRouter);
app.use("/api/v1/class", classRouter);
app.use("/api/v1/announcements", announcementRoutes);
app.use("/api/v1/counselling-records", counsellingRecordRoutes);
app.use("/api/v1/timetable", timetableRouter);
app.use("/api/v1/class-subject", classSubjectRouter);
app.use("/api/v1/admission-applications", admissionApplicationRoutes);
app.use("/api/v1/assignments", assignmentRoutes);
app.use("/api/v1/results", resultRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/enrollment", enrollementRouter);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/lesson-note", lessonNoteRouter);
app.use("/api/v1/academic-sessions", academicSessionRoutes);
app.use("/api/v1/counsellor", counsellorRoutes);
app.use("/api/v1/bursar", bursarRoutes);
app.use("/api/v1/fees", feesRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/api/v1/super-admin", superAdminRoutes);

module.exports = app;

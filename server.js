
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const assignmentRoutes = require(
  "./src/routes/assignment.routes"
);
const notificationRoutes = require("./src/routes/notification.routes");
const resultRoutes = require("./src/routes/result.routes");
const announcementRoutes = require("./src/routes/announcement.routes");
const timetableRouter = require("./src/routes/timetable.routes");
const subjectRoutes = require("./src/routes/subject.routes");
const classSubjectRouter = require("./src/routes/classsubject.routes");
const admissionApplicationRoutes = require("./src/routes/admissionApplication.routes");
const lessonNoteRouter = require("./src/routes/lessonNote.routes");
const enrollementRouter = require("./src/routes/enrollement.routes");
const classRouter = require("./src/routes/class.routes");
const teacherRouter = require("./src/routes/teacher.routes");
const schoolRouter = require("./src/routes/school.routes");
const authRouter = require("./src/routes/auth.routes");
const parentRouter = require("./src/routes/parent.routes");
const studentRouter = require("./src/routes/student.routes");
const adminRouter = require("./src/routes/admin.routes");
const attendanceRoutes = require("./src/routes/attendance.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const academicSessionRoutes = require("./src/routes/academicsession.routes");
const counsellingRecordRoutes = require("./src/routes/counsellingRecord.routes");
const PORT = process.env.PORT || 8000;

const connectDB = require("./src/config/database");

// ===============================
// MIDDLEWAREA
// ===============================

app.use(
  cors({
    origin: "https://edu-nigeria.vercel.app",
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

// ===============================
// ROUTES
// ===============================

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/student", studentRouter);

app.use("/api/v1/parent", parentRouter);

app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/school", schoolRouter);

app.use("/api/v1/class", classRouter);

app.use("/api/v1/announcements", announcementRoutes);

app.use(
  "/api/v1/counselling-records",
  counsellingRecordRoutes
);

app.use("/api/v1/timetable", timetableRouter);

app.use(
  "/api/v1/class-subject",
  classSubjectRouter
);
app.use(
  "/api/v1/admission-applications",
  admissionApplicationRoutes
);

app.use(
  "/api/v1/assignments",
  assignmentRoutes
);

app.use("/api/v1/results", resultRoutes);

app.use("/api/v1/subject", subjectRoutes);

app.use("/api/v1/enrollment", enrollementRouter);

app.use("/api/v1/notifications", notificationRoutes);

app.use("/api/v1/teacher", teacherRouter);

app.use("/api/v1/attendance", attendanceRoutes);

app.use("/api/v1/payment", paymentRoutes);

app.use("/api/v1/lesson-note", lessonNoteRouter);
  
app.use("/api/v1/academic-sessions", academicSessionRoutes);

// ===============================
// START SERVER
// ===============================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();


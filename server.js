
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const teacherRouter = require("./src/routes/teacher.routes");
const schoolRouter = require("./src/routes/school.routes");
const authRouter = require("./src/routes/auth.routes");
const parentRouter = require("./src/routes/parent.routes");
const studentRouter = require("./src/routes/student.routes");
const adminRouter = require("./src/routes/admin.routes");
const attendanceRoutes = require("./src/routes/attendance.routes");
const academicSessionRoutes = require("./src/routes/academicsession.routes");

const PORT = process.env.PORT || 8000;

const connectDB = require("./src/config/database");

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: "http://localhost:5173",
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

app.use("/api/v1/teacher", teacherRouter);

app.use("/api/v1/attendance", attendanceRoutes);
  
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


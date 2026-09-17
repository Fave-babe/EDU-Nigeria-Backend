const AcademicSession = require("../models/AcademicSession.model");
const School = require("../models/School.model");
const AppError = require("../utils/AppError");

class AcademicSessionService {
  // Create academic session
  async createSession(data) {
    const { school, name, startDate, endDate, terms } = data;

    // Check school
    const existingSchool = await School.findById(school);

    if (!existingSchool) {
      throw new AppError("School not found", 404);
    }

    // Check duplicate session for the same school
    const existingSession = await AcademicSession.findOne({
      school,
      name,
    });

    if (existingSession) {
      throw new AppError(
        "This academic session already exists for this school",
        409,
      );
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      throw new AppError("Session start date must be before end date", 400);
    }

    // If this session is current, remove current status
    if (data.isCurrent === true) {
      await AcademicSession.updateMany(
        { school },
        { $set: { isCurrent: false } },
      );
    }

    const session = await AcademicSession.create({
      school,
      name,
      startDate,
      endDate,
      isCurrent: data.isCurrent || false,
      terms: terms || [],
    });

    return session;
  }

  // Get one session
  async findById(sessionId) {
    const session = await AcademicSession.findById(sessionId).populate(
      "school",
      "name schoolType email phone",
    );

    if (!session) {
      throw new AppError("Academic session not found", 404);
    }

    return session;
  }

  // Get all sessions for a school
  async findAllBySchool(schoolId) {
    const school = await School.findById(schoolId);

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const sessions = await AcademicSession.find({
      school: schoolId,
    }).sort({
      startDate: -1,
    });

    return sessions;
  }

  // Get current academic session
  async getCurrentSession(schoolId) {
    const session = await AcademicSession.findOne({
      school: schoolId,
      isCurrent: true,
    }).populate("school", "name schoolType");

    if (!session) {
      throw new AppError("No current academic session found", 404);
    }

    return session;
  }

  // Set a session as current
  async setCurrentSession(sessionId) {
    const session = await AcademicSession.findById(sessionId);

    if (!session) {
      throw new AppError("Academic session not found", 404);
    }

    // Remove current status from other sessions
    await AcademicSession.updateMany(
      {
        school: session.school,
        _id: { $ne: sessionId },
      },
      {
        $set: { isCurrent: false },
      },
    );

    session.isCurrent = true;

    await session.save();

    return session;
  }

  // Update session
  async updateSession(sessionId, data) {
    const session = await AcademicSession.findById(sessionId);

    if (!session) {
      throw new AppError("Academic session not found", 404);
    }

    if (data.startDate || data.endDate) {
      const startDate = data.startDate
        ? new Date(data.startDate)
        : session.startDate;

      const endDate = data.endDate ? new Date(data.endDate) : session.endDate;

      if (startDate >= endDate) {
        throw new AppError("Session start date must be before end date", 400);
      }
    }

    if (data.isCurrent === true) {
      await AcademicSession.updateMany(
        {
          school: session.school,
          _id: { $ne: sessionId },
        },
        {
          $set: { isCurrent: false },
        },
      );
    }

    const updatedSession = await AcademicSession.findByIdAndUpdate(
      sessionId,
      data,
      {
        new: true,
        runValidators: true,
      },
    );

    return updatedSession;
  }

  // Delete session
  async deleteSession(sessionId) {
    const session = await AcademicSession.findByIdAndDelete(sessionId);

    if (!session) {
      throw new AppError("Academic session not found", 404);
    }

    return session;
  }
}

module.exports = new AcademicSessionService();

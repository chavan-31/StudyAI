const express = require("express");
const mongoose = require("mongoose");

const StudySession = require("../models/StudySession");
const LearningProgress = require("../models/LearningProgress");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// HELPER: CALCULATE SESSION PROGRESS
// ==========================================

const updateSessionCompletion = async (session) => {
  const lessonCompleted = session.lessonCompleted === true;
  const quizCompleted = session.quizCompleted === true;

  let progress = 0;

  if (lessonCompleted) progress += 50;
  if (quizCompleted) progress += 50;

  session.progress = progress;

  if (lessonCompleted && quizCompleted) {
    session.status = "completed";
    session.completedAt = session.completedAt || new Date();
  } else {
    session.status = "active";
    session.completedAt = null;
  }

  await session.save();

  return session;
};

// ==========================================
// CREATE STUDY SESSION
// POST /api/study
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, topic, goal, difficulty = "Beginner" } = req.body;

    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof topic !== "string" ||
      !topic.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject and topic are required.",
      });
    }

    const validDifficulties = ["Beginner", "Intermediate", "Advanced"];

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level.",
      });
    }

    const cleanSubject = subject.trim();
    const cleanTopic = topic.trim();

    const session = await StudySession.create({
      user: req.userId,
      subject: cleanSubject,
      topic: cleanTopic,
      goal: typeof goal === "string" ? goal.trim() : "",
      difficulty,
    });

    const progress = await LearningProgress.findOneAndUpdate(
      {
        user: req.userId,
        subject: cleanSubject,
        topic: cleanTopic,
      },
      {
        $setOnInsert: {
          difficulty,
          questionsAttempted: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          accuracy: 0,
          totalTimeSpent: 0,
          lastScore: 0,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Study session created successfully.",
      session,
      progress,
    });
  } catch (error) {
    console.error("Create Study Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create study session.",
    });
  }
});

// ==========================================
// GET ALL STUDY SESSIONS
// GET /api/study
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await StudySession.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Get Study Sessions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch study sessions.",
    });
  }
});

// ==========================================
// GET CURRENT ACTIVE SESSION
// GET /api/study/current
// ==========================================

router.get("/current", authMiddleware, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      user: req.userId,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active study session found.",
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Get Current Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch current session.",
    });
  }
});

// ==========================================
// GET ONE STUDY SESSION
// GET /api/study/:id
// ==========================================

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid study session ID.",
      });
    }

    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Study session not found.",
      });
    }

    const progress = await LearningProgress.findOne({
      user: req.userId,
      subject: session.subject,
      topic: session.topic,
    });

    return res.status(200).json({
      success: true,
      session,
      learningProgress: progress,
    });
  } catch (error) {
    console.error("Get Single Study Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch study session.",
    });
  }
});

// ==========================================
// COMPLETE LESSON
// PATCH /api/study/:id/lesson-complete
// ==========================================

router.patch("/:id/lesson-complete", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid study session ID.",
      });
    }

    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Study session not found.",
      });
    }

    if (session.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This study session is already completed.",
      });
    }

    session.lessonCompleted = true;

    await updateSessionCompletion(session);

    return res.status(200).json({
      success: true,
      message: "Lesson marked as completed.",
      session,
    });
  } catch (error) {
    console.error("Complete Lesson Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete lesson.",
    });
  }
});

// ==========================================
// LEGACY PROGRESS ROUTE
// Direct progress updates are disabled.
// ==========================================

router.patch("/:id/progress", authMiddleware, async (req, res) => {
  return res.status(400).json({
    success: false,
    message:
      "Direct progress updates are disabled. Complete the lesson and quiz to update progress.",
  });
});

module.exports = router;

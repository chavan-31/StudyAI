const express = require("express");

const StudySession = require("../models/StudySession");
const LearningProgress = require("../models/LearningProgress");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE STUDY SESSION + LEARNING PROGRESS
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, topic, goal, difficulty } = req.body;

    // Validate input
    if (!subject || !topic) {
      return res.status(400).json({
        success: false,
        message: "Subject and topic are required",
      });
    }

    const cleanSubject = subject.trim();
    const cleanTopic = topic.trim();
    const cleanDifficulty = difficulty || "Beginner";

    // 1. Create study session
    const session = await StudySession.create({
      user: req.userId,
      subject: cleanSubject,
      topic: cleanTopic,
      goal,
      difficulty: cleanDifficulty,
    });

    // 2. Create Learning Progress if it does not exist
    // Existing progress will not be overwritten.
    const progress = await LearningProgress.findOneAndUpdate(
      {
        user: req.userId,
        subject: cleanSubject,
        topic: cleanTopic,
      },
      {
        $setOnInsert: {
          user: req.userId,
          subject: cleanSubject,
          topic: cleanTopic,
          difficulty: cleanDifficulty,
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

    // 3. Send response
    return res.status(201).json({
      success: true,
      message: "Study session and learning progress connected successfully",
      session,
      progress,
    });
  } catch (error) {
    console.error("Create Study Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create study session",
      error: error.message,
    });
  }
});

// ==========================================
// GET ALL USER STUDY SESSIONS
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await StudySession.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Get Study Sessions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch study sessions",
    });
  }
});

// ==========================================
// GET CURRENT STUDY CONTEXT
// ==========================================

router.get("/current", authMiddleware, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      user: req.userId,
      status: "active",
    }).sort({
      createdAt: -1,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active study session found",
      });
    }

    return res.status(200).json({
      success: true,
      context: {
        subject: session.subject,
        topic: session.topic,
        goal: session.goal,
        difficulty: session.difficulty,
        progress: session.progress,
        status: session.status,
      },
    });
  } catch (error) {
    console.error("Current Study Context Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch current study context",
    });
  }
});

module.exports = router;

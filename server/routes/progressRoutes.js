const express = require("express");
const router = express.Router();

const LearningProgress = require("../models/LearningProgress");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GET USER PERFORMANCE ANALYTICS
// GET /api/progress/analytics
// ==========================================

router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const progress = await LearningProgress.find({
      user: req.user.id,
    }).sort({ updatedAt: -1 });

    // Empty analytics
    if (progress.length === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalTopics: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          overallAccuracy: 0,
          totalTimeSpent: 0,
          strongestSubjects: [],
          weakTopics: [],
          subjects: [],
          recommendations: [
            "Start learning and attempt quizzes to generate your performance analytics.",
          ],
        },
      });
    }

    // ======================================
    // OVERALL STATISTICS
    // ======================================

    const totalQuestions = progress.reduce(
      (sum, item) => sum + (item.questionsAttempted || 0),
      0,
    );

    const correctAnswers = progress.reduce(
      (sum, item) => sum + (item.correctAnswers || 0),
      0,
    );

    const wrongAnswers = progress.reduce(
      (sum, item) => sum + (item.wrongAnswers || 0),
      0,
    );

    const totalTimeSpent = progress.reduce(
      (sum, item) => sum + (item.totalTimeSpent || 0),
      0,
    );

    const overallAccuracy =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    // ======================================
    // SUBJECT-WISE PERFORMANCE
    // ======================================

    const subjectMap = {};

    progress.forEach((item) => {
      const subject = item.subject;

      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          subject,
          questionsAttempted: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
        };
      }

      subjectMap[subject].questionsAttempted += item.questionsAttempted || 0;

      subjectMap[subject].correctAnswers += item.correctAnswers || 0;

      subjectMap[subject].wrongAnswers += item.wrongAnswers || 0;
    });

    const subjects = Object.values(subjectMap).map((item) => ({
      ...item,
      accuracy:
        item.questionsAttempted > 0
          ? Math.round((item.correctAnswers / item.questionsAttempted) * 100)
          : 0,
    }));

    // ======================================
    // STRONGEST SUBJECTS
    // ======================================

    const strongestSubjects = [...subjects]
      .filter((item) => item.questionsAttempted > 0)
      .sort((a, b) => {
        if (b.accuracy !== a.accuracy) {
          return b.accuracy - a.accuracy;
        }

        return b.questionsAttempted - a.questionsAttempted;
      })
      .slice(0, 3);

    // ======================================
    // WEAK TOPIC DETECTION
    // ======================================

    const weakTopics = progress
      .filter((item) => (item.questionsAttempted || 0) > 0)
      .map((item) => ({
        subject: item.subject,
        topic: item.topic,
        accuracy: item.accuracy || 0,
        questionsAttempted: item.questionsAttempted || 0,
        correctAnswers: item.correctAnswers || 0,
        wrongAnswers: item.wrongAnswers || 0,
        difficulty: item.difficulty,
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    // ======================================
    // PERSONALIZED RECOMMENDATIONS
    // ======================================

    const recommendations = [];

    if (totalQuestions === 0) {
      recommendations.push(
        "Attempt quizzes to generate your performance insights.",
      );
    } else if (overallAccuracy < 50) {
      recommendations.push(
        "Your accuracy needs improvement. Revise the fundamentals and practice beginner-level questions.",
      );
    } else if (overallAccuracy < 75) {
      recommendations.push(
        "Good progress! Practice more questions to improve your accuracy.",
      );
    } else {
      recommendations.push(
        "Excellent performance! Challenge yourself with advanced-level questions.",
      );
    }

    const weakestTopic = weakTopics[0];

    if (weakestTopic && weakestTopic.accuracy < 60) {
      recommendations.push(
        `Focus on ${weakestTopic.topic} in ${weakestTopic.subject}. Your accuracy is ${weakestTopic.accuracy}%.`,
      );
    }

    const strongestSubject = strongestSubjects[0];

    if (strongestSubject) {
      recommendations.push(
        `Your strongest subject is ${strongestSubject.subject} with ${strongestSubject.accuracy}% accuracy.`,
      );
    }

    // ======================================
    // FINAL RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      analytics: {
        totalTopics: progress.length,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        overallAccuracy,
        totalTimeSpent,
        strongestSubjects,
        weakTopics,
        subjects,
        recommendations,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate performance analytics",
    });
  }
});

// ==========================================
// GET ALL USER LEARNING PROGRESS
// GET /api/progress
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const progress = await LearningProgress.find({
      user: req.user.id,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    console.error("Fetch Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning progress",
    });
  }
});

// ==========================================
// CREATE / UPDATE LEARNING PROGRESS
// POST /api/progress
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, topic, difficulty, isCorrect, timeSpent = 0 } = req.body;

    // Validate required fields
    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof topic !== "string" ||
      !topic.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject and topic are required",
      });
    }

    if (typeof isCorrect !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isCorrect must be true or false",
      });
    }

    const parsedTime = Number(timeSpent);

    if (!Number.isFinite(parsedTime) || parsedTime < 0) {
      return res.status(400).json({
        success: false,
        message: "timeSpent must be a valid non-negative number",
      });
    }

    // Find existing progress or create it
    let progress = await LearningProgress.findOneAndUpdate(
      {
        user: req.user.id,
        subject: subject.trim(),
        topic: topic.trim(),
      },
      {
        $inc: {
          questionsAttempted: 1,
          correctAnswers: isCorrect ? 1 : 0,
          wrongAnswers: isCorrect ? 0 : 1,
          totalTimeSpent: parsedTime,
        },
        $setOnInsert: {
          user: req.user.id,
          subject: subject.trim(),
          topic: topic.trim(),
          difficulty: difficulty || "Beginner",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    // Calculate accuracy
    progress.accuracy =
      progress.questionsAttempted > 0
        ? Math.round(
            (progress.correctAnswers / progress.questionsAttempted) * 100,
          )
        : 0;

    progress.lastScore = progress.accuracy;

    // Adaptive difficulty
    if (progress.accuracy >= 80) {
      if (progress.difficulty === "Beginner") {
        progress.difficulty = "Intermediate";
      } else if (progress.difficulty === "Intermediate") {
        progress.difficulty = "Advanced";
      }
    } else if (progress.accuracy < 50) {
      if (progress.difficulty === "Advanced") {
        progress.difficulty = "Intermediate";
      } else if (progress.difficulty === "Intermediate") {
        progress.difficulty = "Beginner";
      }
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Learning progress updated successfully",
      progress,
    });
  } catch (error) {
    console.error("Update Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update learning progress",
    });
  }
});

module.exports = router;

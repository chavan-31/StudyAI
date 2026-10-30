const express = require("express");
const router = express.Router();

const LearningProgress = require("../models/LearningProgress");
const authMiddleware = require("../middleware/authMiddleware");


// ==========================================
// GET USER LEARNING PROGRESS
// ==========================================

router.get("/", authMiddleware, async (req, res) => {

    try {

        const progress = await LearningProgress.find({
            user: req.user.id
        }).sort({
            updatedAt: -1
        });

        res.json(progress);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch learning progress"
        });
    }
});


// ==========================================
// CREATE / UPDATE PROGRESS
// ==========================================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const {
            subject,
            topic,
            difficulty,
            isCorrect,
            timeSpent
        } = req.body;


        if (!subject || !topic) {

            return res.status(400).json({
                message:
                    "Subject and topic are required"
            });
        }


        // Find existing progress

        let progress =
            await LearningProgress.findOne({
                user: req.user.id,
                subject,
                topic
            });


        // Create new progress

        if (!progress) {

            progress =
                new LearningProgress({

                    user: req.user.id,

                    subject,

                    topic,

                    difficulty:
                        difficulty || "Beginner"
                });
        }


        // Update question count

        progress.questionsAttempted += 1;


        // Correct / wrong

        if (isCorrect) {

            progress.correctAnswers += 1;

        } else {

            progress.wrongAnswers += 1;
        }


        // Time

        if (timeSpent) {

            progress.totalTimeSpent +=
                Number(timeSpent);
        }


        // Calculate accuracy

        progress.accuracy =
            Math.round(
                (
                    progress.correctAnswers /
                    progress.questionsAttempted
                ) * 100
            );


        // Last score

        progress.lastScore =
            progress.accuracy;


        // ======================================
        // ADAPTIVE DIFFICULTY
        // ======================================

        if (progress.accuracy >= 80) {

            if (
                progress.difficulty ===
                "Beginner"
            ) {

                progress.difficulty =
                    "Intermediate";

            } else if (
                progress.difficulty ===
                "Intermediate"
            ) {

                progress.difficulty =
                    "Advanced";
            }

        } else if (
            progress.accuracy < 50
        ) {

            if (
                progress.difficulty ===
                "Advanced"
            ) {

                progress.difficulty =
                    "Intermediate";

            } else if (
                progress.difficulty ===
                "Intermediate"
            ) {

                progress.difficulty =
                    "Beginner";
            }
        }


        await progress.save();


        res.status(200).json({

            message:
                "Learning progress updated",

            progress

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Failed to update learning progress"
        });
    }
});


module.exports = router;
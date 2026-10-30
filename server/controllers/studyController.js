const StudySession = require("../models/StudySession");
const Progress = require("../models/Progress");

// ==========================================
// CREATE STUDY SESSION
// ==========================================

const createStudySession = async (req, res) => {
    try {
        const {
            subject,
            topic,
            startTime,
            endTime,
            duration
        } = req.body;

        if (!subject || !topic || !startTime || !endTime) {
            return res.status(400).json({
                message:
                    "Please provide subject, topic, start time and end time"
            });
        }

        const session = await StudySession.create({
            userId: req.user._id,
            subject,
            topic,
            startTime,
            endTime,
            duration: duration || 0
        });

        res.status(201).json({
            message: "Study session created successfully",
            session
        });

    } catch (error) {
        console.error("Create study session error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET STUDY SESSIONS
// ==========================================

const getStudySessions = async (req, res) => {
    try {

        const sessions = await StudySession.find({
            userId: req.user._id
        }).sort({
            createdAt: -1
        });

        res.json({
            count: sessions.length,
            sessions
        });

    } catch (error) {

        console.error("Get study sessions error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE PROGRESS
// ==========================================

const updateProgress = async (req, res) => {
    try {

        const {
            subject,
            topic,
            completed,
            score,
            difficulty
        } = req.body;

        if (!subject || !topic) {
            return res.status(400).json({
                message: "Subject and topic are required"
            });
        }

        const progress = await Progress.findOneAndUpdate(
            {
                userId: req.user._id,
                subject,
                topic
            },
            {
                completed: completed || false,
                score: score || 0,
                difficulty: difficulty || "Easy"
            },
            {
                new: true,
                upsert: true
            }
        );

        res.json({
            message: "Progress updated successfully",
            progress
        });

    } catch (error) {

        console.error("Update progress error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET PROGRESS
// ==========================================

const getProgress = async (req, res) => {
    try {

        const progress = await Progress.find({
            userId: req.user._id
        }).sort({
            updatedAt: -1
        });

        res.json({
            count: progress.length,
            progress
        });

    } catch (error) {

        console.error("Get progress error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createStudySession,
    getStudySessions,
    updateProgress,
    getProgress
};
const express = require("express");

const StudySession = require("../models/StudySession");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE STUDY SESSION
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            subject,
            topic,
            goal,
            difficulty
        } = req.body;

        if (!subject || !topic) {
            return res.status(400).json({
                message: "Subject and topic are required"
            });
        }

        const session = await StudySession.create({
            user: req.userId,
            subject,
            topic,
            goal,
            difficulty
        });

        res.status(201).json({
            message: "Study session created",
            session
        });

    } catch (error) {
        console.error("Study Session Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// GET USER STUDY SESSIONS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const sessions = await StudySession.find({
            user: req.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            sessions
        });

    } catch (error) {
        console.error("Get Sessions Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// GET CURRENT STUDY CONTEXT
router.get("/current", authMiddleware, async (req, res) => {
    try {
        const session = await StudySession.findOne({
            user: req.userId,
            status: "active"
        }).sort({
            createdAt: -1
        });

        if (!session) {
            return res.status(404).json({
                message: "No active study session found"
            });
        }

        res.status(200).json({
            context: {
                subject: session.subject,
                topic: session.topic,
                goal: session.goal,
                difficulty: session.difficulty,
                progress: session.progress,
                status: session.status
            }
        });

    } catch (error) {
        console.error("Current Context Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;
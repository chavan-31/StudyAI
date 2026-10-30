const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        topic: {
            type: String,
            required: true,
            trim: true
        },

        goal: {
            type: String,
            trim: true
        },

        difficulty: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner"
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active"
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const StudySession = mongoose.model(
    "StudySession",
    studySessionSchema
);

module.exports = StudySession;
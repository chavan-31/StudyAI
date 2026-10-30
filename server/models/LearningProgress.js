const mongoose = require("mongoose");

const learningProgressSchema = new mongoose.Schema(
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

        difficulty: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced"
            ],
            default: "Beginner"
        },

        questionsAttempted: {
            type: Number,
            default: 0
        },

        correctAnswers: {
            type: Number,
            default: 0
        },

        wrongAnswers: {
            type: Number,
            default: 0
        },

        accuracy: {
            type: Number,
            default: 0
        },

        totalTimeSpent: {
            type: Number,
            default: 0
        },

        lastScore: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "LearningProgress",
    learningProgressSchema
);
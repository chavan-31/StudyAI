const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        studySession: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudySession",
            required: true
        },

        question: {
            type: String,
            required: true
        },

        correctAnswer: {
            type: String,
            required: true
        },

        userAnswer: {
            type: String,
            default: ""
        },

        isCorrect: {
            type: Boolean,
            default: false
        },

        score: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
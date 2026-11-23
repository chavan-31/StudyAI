const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studySession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudySession",
      required: true,
    },

    // Groups questions belonging to one quiz attempt
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    subject: {
      type: String,
      default: "",
    },

    topic: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    userAnswer: {
      type: String,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;

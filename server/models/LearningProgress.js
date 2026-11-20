const mongoose = require("mongoose");

const learningProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    questionsAttempted: {
      type: Number,
      default: 0,
      min: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    totalTimeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

// One progress document per user, subject and topic.
learningProgressSchema.index(
  { user: 1, subject: 1, topic: 1 },
  { unique: true },
);

// Reuse an existing model to prevent OverwriteModelError.
const LearningProgress =
  mongoose.models.LearningProgress ||
  mongoose.model("LearningProgress", learningProgressSchema);

module.exports = LearningProgress;

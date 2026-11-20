const express = require("express");

const Quiz = require("../models/Quiz");
const StudySession = require("../models/StudySession");
const LearningProgress = require("../models/LearningProgress");

const authMiddleware = require("../middleware/authMiddleware");
const { generateAIResponse } = require("../services/aiService");

const router = express.Router();

const validDifficulties = ["Beginner", "Intermediate", "Advanced"];

// ==========================================
// LOCAL QUESTION BANK
// ==========================================

const questionBank = {
  Java: {
    Arrays: {
      Beginner: [
        {
          question:
            "Which symbol is used to access an element of a Java array?",
          options: ["()", "[]", "{}", "<>"],
          correctAnswer: "[]",
          explanation:
            "Square brackets are used to access array elements in Java.",
        },
        {
          question: "What is the index of the first element of a Java array?",
          options: ["0", "1", "-1", "Depends on the array"],
          correctAnswer: "0",
          explanation: "Java arrays use zero-based indexing.",
        },
      ],
      Intermediate: [
        {
          question:
            "What is the time complexity of accessing an array element by index?",
          options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
          correctAnswer: "O(1)",
          explanation:
            "Array elements can be accessed directly using their index.",
        },
        {
          question:
            "Which exception occurs when accessing an invalid array index?",
          options: [
            "NullPointerException",
            "ArrayIndexOutOfBoundsException",
            "IOException",
            "SyntaxError",
          ],
          correctAnswer: "ArrayIndexOutOfBoundsException",
          explanation:
            "This exception occurs when an array index is outside its valid range.",
        },
      ],
      Advanced: [
        {
          question:
            "What is the time complexity of inserting an element at the beginning of an array when shifting is required?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctAnswer: "O(n)",
          explanation: "Existing elements must be shifted to make space.",
        },
      ],
    },
    OOP: {
      Beginner: [
        {
          question: "Which keyword is used to declare a class in Java?",
          options: ["class", "object", "new", "struct"],
          correctAnswer: "class",
          explanation: "The class keyword declares a class in Java.",
        },
      ],
      Intermediate: [
        {
          question:
            "Which OOP concept allows a child class to acquire properties of a parent class?",
          options: [
            "Encapsulation",
            "Inheritance",
            "Abstraction",
            "Polymorphism",
          ],
          correctAnswer: "Inheritance",
          explanation:
            "Inheritance allows a child class to reuse members of its parent class.",
        },
      ],
      Advanced: [
        {
          question:
            "Which mechanism allows a subclass to provide its own implementation of an inherited method?",
          options: [
            "Method overloading",
            "Method overriding",
            "Constructor chaining",
            "Encapsulation",
          ],
          correctAnswer: "Method overriding",
          explanation:
            "Method overriding lets a subclass redefine an inherited method.",
        },
      ],
    },
  },
};

// ==========================================
// PARSE GEMINI JSON
// ==========================================

const parseAIQuestions = (responseText) => {
  if (typeof responseText !== "string") {
    throw new Error("Invalid AI response.");
  }

  const cleaned = responseText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("AI did not return a valid question list.");
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1));

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid AI question format.");
  }

  return parsed.map((item) => {
    if (
      typeof item.question !== "string" ||
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      typeof item.correctAnswer !== "string"
    ) {
      throw new Error("An AI question has an invalid format.");
    }

    const options = item.options.map((option) => String(option).trim());
    const correctAnswer = item.correctAnswer.trim();

    if (!options.includes(correctAnswer)) {
      throw new Error("AI answer does not match its options.");
    }

    return {
      question: item.question.trim(),
      options,
      correctAnswer,
      explanation: String(item.explanation || "").trim(),
    };
  });
};

// ==========================================
// GENERATE AI QUESTIONS
// ==========================================

const generateAIQuestions = async (
  subject,
  topic,
  difficulty,
  numberOfQuestions,
) => {
  const prompt = `
You are an expert teacher and quiz creator.

Create exactly ${numberOfQuestions} multiple-choice questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Rules:
1. Each question must have exactly four options.
2. Only one option must be correct.
3. Questions must be technically accurate.
4. Avoid duplicate questions.
5. Include a simple explanation.
6. Return only valid JSON.

Format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Explanation"
  }
]
`;

  const result = await generateAIResponse(prompt);

  if (!result || result.mode !== "gemini") {
    throw new Error("Gemini is not enabled.");
  }

  const questions = parseAIQuestions(result.response);

  if (questions.length < numberOfQuestions) {
    throw new Error("AI returned fewer questions than requested.");
  }

  return questions.slice(0, numberOfQuestions);
};

// ==========================================
// GENERATE PRACTICE QUIZ
// POST /api/quiz/generate
// ==========================================

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const {
      subject,
      topic,
      difficulty = "Beginner",
      numberOfQuestions = 5,
    } = req.body;

    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof topic !== "string" ||
      !topic.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject and topic are required.",
      });
    }

    const count = Number(numberOfQuestions);

    if (!Number.isInteger(count) || count < 1 || count > 10) {
      return res.status(400).json({
        success: false,
        message: "Choose between 1 and 10 questions.",
      });
    }

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level.",
      });
    }

    const cleanSubject = subject.trim();
    const cleanTopic = topic.trim();

    const session = await StudySession.findOne({
      user: req.userId,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Please create a study session first.",
      });
    }

    const progress = await LearningProgress.findOne({
      user: req.userId,
      subject: cleanSubject,
      topic: cleanTopic,
    });

    let selectedDifficulty = difficulty;

    if (progress && progress.questionsAttempted >= 3) {
      if (progress.accuracy >= 80) {
        selectedDifficulty =
          progress.difficulty === "Advanced"
            ? "Advanced"
            : progress.difficulty === "Beginner"
              ? "Intermediate"
              : "Advanced";
      } else if (progress.accuracy < 50) {
        selectedDifficulty = "Beginner";
      } else if (validDifficulties.includes(progress.difficulty)) {
        selectedDifficulty = progress.difficulty;
      }
    }

    let questions = [];
    let generationMode = "local";

    try {
      questions = await generateAIQuestions(
        cleanSubject,
        cleanTopic,
        selectedDifficulty,
        count,
      );

      generationMode = "gemini";
    } catch (aiError) {
      console.error("Gemini quiz fallback:", aiError.message);

      const localQuestions =
        questionBank[cleanSubject]?.[cleanTopic]?.[selectedDifficulty] || [];

      if (localQuestions.length === 0) {
        return res.status(503).json({
          success: false,
          message:
            "AI generation is unavailable and no local questions exist for this topic. Try Java Arrays or Java OOP.",
        });
      }

      questions = Array.from(
        { length: count },
        (_, index) => localQuestions[index % localQuestions.length],
      );
    }

    const createdQuizzes = [];

    for (const item of questions) {
      const quiz = await Quiz.create({
        user: req.userId,
        studySession: session._id,
        subject: cleanSubject,
        topic: cleanTopic,
        difficulty: selectedDifficulty,
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        userAnswer: "",
      });

      createdQuizzes.push({
        id: quiz._id,
        question: quiz.question,
        options: quiz.options,
        difficulty: quiz.difficulty,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Quiz generated successfully.",
      subject: cleanSubject,
      topic: cleanTopic,
      difficulty: selectedDifficulty,
      generationMode,
      totalQuestions: createdQuizzes.length,
      questions: createdQuizzes,
    });
  } catch (error) {
    console.error("Generate Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz.",
    });
  }
});

// ==========================================
// SUBMIT QUIZ ANSWER
// PUT /api/quiz/:id/answer
// ==========================================

router.put("/:id/answer", authMiddleware, async (req, res) => {
  try {
    const { userAnswer, timeSpent = 0 } = req.body;

    if (typeof userAnswer !== "string" || !userAnswer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required.",
      });
    }

    const spent = Number(timeSpent);

    if (!Number.isFinite(spent) || spent < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid time spent value.",
      });
    }

    const existingQuiz = await Quiz.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!existingQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    const answer = userAnswer.trim();

    const isCorrect =
      answer.toLowerCase() === existingQuiz.correctAnswer.trim().toLowerCase();

    // Atomic update prevents double submission.
    const quiz = await Quiz.findOneAndUpdate(
      {
        _id: existingQuiz._id,
        user: req.userId,
        userAnswer: "",
      },
      {
        $set: {
          userAnswer: answer,
          isCorrect,
          score: isCorrect ? 100 : 0,
          timeSpent: spent,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!quiz) {
      return res.status(409).json({
        success: false,
        message: "This question has already been answered.",
      });
    }

    // Update progress regardless of whether a session still exists.
    const progress = await LearningProgress.findOneAndUpdate(
      {
        user: req.userId,
        subject: quiz.subject,
        topic: quiz.topic,
      },
      {
        $inc: {
          questionsAttempted: 1,
          correctAnswers: isCorrect ? 1 : 0,
          wrongAnswers: isCorrect ? 0 : 1,
          totalTimeSpent: spent,
        },
        $set: {
          lastScore: quiz.score,
        },
        $setOnInsert: {
          difficulty: quiz.difficulty || "Beginner",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    progress.accuracy =
      progress.questionsAttempted > 0
        ? Math.round(
            (progress.correctAnswers / progress.questionsAttempted) * 100,
          )
        : 0;

    if (progress.accuracy >= 80) {
      if (progress.difficulty === "Beginner") {
        progress.difficulty = "Intermediate";
      } else if (progress.difficulty === "Intermediate") {
        progress.difficulty = "Advanced";
      }
    } else if (progress.accuracy < 50 && progress.questionsAttempted >= 3) {
      if (progress.difficulty === "Advanced") {
        progress.difficulty = "Intermediate";
      } else if (progress.difficulty === "Intermediate") {
        progress.difficulty = "Beginner";
      }
    }

    await progress.save();

    // Update study session separately.
    const session = await StudySession.findOne({
      _id: quiz.studySession,
      user: req.userId,
    });

    if (session && isCorrect) {
      session.progress = Math.min((session.progress || 0) + 10, 100);

      if (session.progress >= 100) {
        session.status = "completed";
        session.completedAt = new Date();
      }

      await session.save();
    }

    return res.status(200).json({
      success: true,
      message: "Answer submitted successfully.",
      quiz: {
        id: quiz._id,
        question: quiz.question,
        userAnswer: quiz.userAnswer,
        correctAnswer: quiz.correctAnswer,
        explanation: quiz.explanation,
        isCorrect: quiz.isCorrect,
        score: quiz.score,
      },
      correct: isCorrect,
      progress: session ? session.progress : 0,
      learningProgress: {
        questionsAttempted: progress.questionsAttempted,
        correctAnswers: progress.correctAnswers,
        wrongAnswers: progress.wrongAnswers,
        accuracy: progress.accuracy,
        difficulty: progress.difficulty,
      },
    });
  } catch (error) {
    console.error("Quiz Answer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while submitting answer.",
    });
  }
});

// ==========================================
// GET QUIZ HISTORY
// GET /api/quiz
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      user: req.userId,
    })
      .sort({ createdAt: -1 })
      .select("-correctAnswer");

    return res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Quiz History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz history.",
    });
  }
});

module.exports = router;

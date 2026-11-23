const express = require("express");
const mongoose = require("mongoose");

const Quiz = require("../models/Quiz");
const StudySession = require("../models/StudySession");
const LearningProgress = require("../models/LearningProgress");

const authMiddleware = require("../middleware/authMiddleware");
const { generateAIResponse } = require("../services/aiService");

const { isValidTopic } = require("../data/curriculum");

const javaQuestionBank = require("../data/questionBanks/java");
const { getUniqueQuestions } = require("../data/questionBankUtils");

const router = express.Router();

const validDifficulties = ["Beginner", "Intermediate", "Advanced"];

// ==========================================
// SUBJECT NAME COMPATIBILITY
// ==========================================

const normalizeSubject = (subject = "") => {
  const value = subject.trim().toLowerCase();

  const aliases = {
    "java programming": "java",
    "python programming": "python",
    "object-oriented programming": "oop",
    "operating systems": "os",
    "database management systems": "dbms",
  };

  return aliases[value] || value;
};

const getQuestionBankSubject = (subject) => {
  const normalized = normalizeSubject(subject);

  const subjects = {
    java: "Java",
    python: "Python",
    javascript: "JavaScript",
    html: "HTML",
    css: "CSS",
    os: "OS",
    dsa: "DSA",
    dbms: "DBMS",
    "mern stack": "MERN Stack",
  };

  return subjects[normalized] || subject;
};

// ==========================================
// LOCAL QUESTION BANK
// EXISTING QUESTIONS PRESERVED
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
          explanation: "Square brackets access array elements.",
        },
        {
          question: "What is the index of the first element in a Java array?",
          options: ["0", "1", "-1", "2"],
          correctAnswer: "0",
          explanation: "Java arrays use zero-based indexing.",
        },
        {
          question: "Which keyword is used to create an array in Java?",
          options: ["array", "create", "new", "make"],
          correctAnswer: "new",
          explanation: "The new keyword allocates memory for an array.",
        },
        {
          question: "Which property gives the size of an array?",
          options: ["size()", "length", "count", "capacity"],
          correctAnswer: "length",
          explanation: "Java arrays use the length property.",
        },
        {
          question: "Which is a valid integer array declaration?",
          options: [
            "int arr[];",
            "array int arr;",
            "arr int[];",
            "integer arr;",
          ],
          correctAnswer: "int arr[];",
          explanation: "int arr[] is a valid Java array declaration.",
        },
        {
          question: "What is the default value of elements in an int array?",
          options: ["null", "1", "0", "-1"],
          correctAnswer: "0",
          explanation: "Integer array elements default to zero.",
        },
        {
          question: "What is the default value of a boolean array element?",
          options: ["true", "false", "null", "0"],
          correctAnswer: "false",
          explanation: "Boolean array elements default to false.",
        },
        {
          question: "Which loop is commonly used to traverse an array?",
          options: ["for", "switch", "try", "class"],
          correctAnswer: "for",
          explanation: "A for loop can visit each array index.",
        },
        {
          question:
            "What is the output of int[] a = {10,20,30}; System.out.println(a[1]);?",
          options: ["10", "20", "30", "1"],
          correctAnswer: "20",
          explanation: "Index 1 refers to the second element.",
        },
        {
          question: "How many elements are in int[] a = {2,4,6,8}?",
          options: ["3", "4", "5", "8"],
          correctAnswer: "4",
          explanation: "The array contains four values.",
        },
        {
          question:
            "Which exception occurs when an invalid array index is accessed?",
          options: [
            "IOException",
            "NullPointerException",
            "ArrayIndexOutOfBoundsException",
            "ArithmeticException",
          ],
          correctAnswer: "ArrayIndexOutOfBoundsException",
          explanation:
            "This exception occurs when an index is outside the array bounds.",
        },
        {
          question: "What is the last valid index of an array with 5 elements?",
          options: ["5", "4", "3", "6"],
          correctAnswer: "4",
          explanation: "The last index is length minus one.",
        },
        {
          question: "Can an int array store String values directly?",
          options: ["Yes", "No", "Only two strings", "Only with loops"],
          correctAnswer: "No",
          explanation:
            "An int array stores integer values, not String objects.",
        },
        {
          question: "Which statement creates an array of 5 integers?",
          options: [
            "int[] a = new int[5];",
            "int a = new int(5);",
            "array a[5];",
            "int[5] a;",
          ],
          correctAnswer: "int[] a = new int[5];",
          explanation: "This creates an integer array with five elements.",
        },
        {
          question:
            "What is the output of int[] a = {5,10}; System.out.println(a.length);?",
          options: ["1", "2", "5", "10"],
          correctAnswer: "2",
          explanation: "The length property returns the number of elements.",
        },
        {
          question: "Which index accesses the third element of an array?",
          options: ["1", "2", "3", "4"],
          correctAnswer: "2",
          explanation: "The third element has index 2.",
        },
        {
          question: "What happens when an array is created using new int[3]?",
          options: [
            "Three integer elements are created",
            "Three strings are created",
            "No memory is allocated",
            "The array has four elements",
          ],
          correctAnswer: "Three integer elements are created",
          explanation:
            "The array contains three integer slots initialized to zero.",
        },
        {
          question: "Which is a valid way to initialize an array?",
          options: [
            "int[] a = {1,2,3};",
            "int[] a = (1,2,3);",
            "int a = {1,2,3};",
            "array a = 1,2,3;",
          ],
          correctAnswer: "int[] a = {1,2,3};",
          explanation: "Curly braces initialize an array with values.",
        },
        {
          question: "What is the first value of int[] a = new int[3]?",
          options: ["null", "0", "1", "Undefined"],
          correctAnswer: "0",
          explanation: "All integer elements are initialized to zero.",
        },
        {
          question: "Are Java arrays fixed in size after creation?",
          options: ["Yes", "No", "Only String arrays", "Only boolean arrays"],
          correctAnswer: "Yes",
          explanation: "A Java array's length cannot change after creation.",
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
// MODULAR QUESTION BANK INTEGRATION
// ==========================================

const getLocalQuestions = (bankSubject, topic, difficulty) => {
  const existingQuestions =
    questionBank[bankSubject]?.[topic]?.[difficulty] || [];

  const modularQuestions =
    normalizeSubject(bankSubject) === "java"
      ? javaQuestionBank[topic]?.[difficulty] || []
      : [];

  return getUniqueQuestions([...modularQuestions, ...existingQuestions]);
};

// ==========================================
// SHUFFLE QUESTIONS
// ==========================================

const shuffleQuestions = (questions) => {
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

// ==========================================
// REMOVE DUPLICATE QUESTIONS
// ==========================================

const removeDuplicateQuestions = (questions) => {
  const seen = new Set();

  return questions.filter((item) => {
    if (!item || typeof item.question !== "string") {
      return false;
    }

    const key = item.question.toLowerCase().trim();

    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
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

  const normalized = parsed.map((item) => {
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

    if (
      options.some((option) => !option) ||
      new Set(options).size !== 4 ||
      !options.includes(correctAnswer)
    ) {
      throw new Error("AI question options or answer are invalid.");
    }

    return {
      question: item.question.trim(),
      options,
      correctAnswer,
      explanation: String(item.explanation || "").trim(),
    };
  });

  return removeDuplicateQuestions(normalized);
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
You are an expert computer science teacher and quiz creator.

Create exactly ${numberOfQuestions} unique multiple-choice questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Rules:
1. Each question must have exactly four different options.
2. Only one option must be correct.
3. Questions must be technically accurate.
4. Do not repeat questions.
5. Include a clear explanation.
6. Match the requested difficulty.
7. Return only valid JSON.
8. Do not include Markdown code fences.

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
    throw new Error("AI returned fewer than the requested unique questions.");
  }

  return questions.slice(0, numberOfQuestions);
};

// ==========================================
// ADAPTIVE DIFFICULTY
// ==========================================

const selectAdaptiveDifficulty = (requestedDifficulty, progress) => {
  if (!progress || progress.questionsAttempted < 3) {
    return requestedDifficulty;
  }

  if (progress.accuracy >= 80) {
    if (progress.difficulty === "Beginner") return "Intermediate";
    if (progress.difficulty === "Intermediate") return "Advanced";
    return "Advanced";
  }

  if (progress.accuracy < 50) {
    return "Beginner";
  }

  if (validDifficulties.includes(progress.difficulty)) {
    return progress.difficulty;
  }

  return requestedDifficulty;
};

// ==========================================
// GENERATE PRACTICE QUIZ
// POST /api/quiz/generate
// ==========================================

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const {
      semester,
      subject,
      topic,
      difficulty = "Beginner",
      numberOfQuestions = 20,
      studySessionId,
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

    const cleanSubject = subject.trim();
    const cleanTopic = topic.trim();

    // Semester is temporarily optional for compatibility
    // with the existing frontend.
    if (semester !== undefined) {
      if (typeof semester !== "string" || !semester.trim()) {
        return res.status(400).json({
          success: false,
          message: "Invalid semester.",
        });
      }

      if (!isValidTopic(semester.trim(), cleanSubject, cleanTopic)) {
        return res.status(400).json({
          success: false,
          message: "Invalid semester, subject or topic selection.",
        });
      }
    }

    const count = Number(numberOfQuestions);

    if (!Number.isInteger(count) || count < 1 || count > 20) {
      return res.status(400).json({
        success: false,
        message: "Choose between 1 and 20 questions.",
      });
    }

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level.",
      });
    }

    // Find requested study session.
    let session;

    if (studySessionId) {
      if (!mongoose.Types.ObjectId.isValid(studySessionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid study session ID.",
        });
      }

      session = await StudySession.findOne({
        _id: studySessionId,
        user: req.userId,
      });
    } else {
      session = await StudySession.findOne({
        user: req.userId,
        status: "active",
      }).sort({ createdAt: -1 });
    }

    if (!session) {
      return res.status(404).json({
        success: false,
        message:
          "Study session not found. Please create a study session first.",
      });
    }

    if (session.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This study session is already completed.",
      });
    }

    // Compare subject aliases to support Java and Java Programming.
    if (
      normalizeSubject(session.subject) !== normalizeSubject(cleanSubject) ||
      String(session.topic || "")
        .trim()
        .toLowerCase() !== cleanTopic.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quiz subject and topic must match the selected study session.",
      });
    }

    const progress = await LearningProgress.findOne({
      user: req.userId,
      subject: cleanSubject,
      topic: cleanTopic,
    });

    const selectedDifficulty = selectAdaptiveDifficulty(difficulty, progress);

    let questions = [];
    let generationMode = "local";

    // Try Gemini first.
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

      const bankSubject = getQuestionBankSubject(cleanSubject);

      // Combine modular Java bank and existing local bank.
      const uniqueLocalQuestions = getLocalQuestions(
        bankSubject,
        cleanTopic,
        selectedDifficulty,
      );

      // Never repeat questions to fill a missing pool.
      if (uniqueLocalQuestions.length < count) {
        return res.status(503).json({
          success: false,
          message: `Gemini is unavailable and only ${uniqueLocalQuestions.length} unique fallback questions exist for ${cleanSubject} ${cleanTopic} (${selectedDifficulty}).`,
          generationMode: "unavailable",
          availableFallbackQuestions: uniqueLocalQuestions.length,
          requestedQuestions: count,
          selectedDifficulty,
        });
      }

      questions = shuffleQuestions(uniqueLocalQuestions).slice(0, count);
      generationMode = "local";
    }

    if (questions.length !== count) {
      return res.status(503).json({
        success: false,
        message: `Could not generate ${count} unique questions.`,
        requestedQuestions: count,
        availableQuestions: questions.length,
      });
    }

    const batchId = new mongoose.Types.ObjectId();

    const quizDocuments = questions.map((item) => ({
      user: req.userId,
      studySession: session._id,
      batchId,
      subject: cleanSubject,
      topic: cleanTopic,
      difficulty: selectedDifficulty,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      userAnswer: "",
    }));

    const createdQuizzes = await Quiz.insertMany(quizDocuments);

    return res.status(201).json({
      success: true,
      message: "Quiz generated successfully.",
      semester: semester || null,
      subject: cleanSubject,
      topic: cleanTopic,
      difficulty: selectedDifficulty,
      generationMode,
      batchId: batchId.toString(),
      studySessionId: session._id.toString(),
      totalQuestions: createdQuizzes.length,
      questions: createdQuizzes.map((quiz) => ({
        id: quiz._id.toString(),
        question: quiz.question,
        options: quiz.options,
        difficulty: quiz.difficulty,
      })),
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz question ID.",
      });
    }

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
        message: "Quiz question not found.",
      });
    }

    const answer = userAnswer.trim();

    const isCorrect =
      answer.toLowerCase() === existingQuiz.correctAnswer.trim().toLowerCase();

    // Prevent duplicate submissions.
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

    // Update learning analytics.
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
          score: quiz.score,
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

    const session = await StudySession.findOne({
      _id: quiz.studySession,
      user: req.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Answer submitted successfully.",
      quiz: {
        id: quiz._id.toString(),
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
// COMPLETE QUIZ BATCH
// POST /api/quiz/batch/:batchId/complete
// ==========================================

router.post("/batch/:batchId/complete", authMiddleware, async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz batch ID.",
      });
    }

    const quizzes = await Quiz.find({
      batchId,
      user: req.userId,
    });

    if (quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz batch not found.",
      });
    }

    const unansweredQuestions = quizzes.filter(
      (quiz) => !quiz.userAnswer || !quiz.userAnswer.trim(),
    );

    if (unansweredQuestions.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Answer all quiz questions before completing the quiz.",
        unansweredQuestions: unansweredQuestions.length,
        totalQuestions: quizzes.length,
      });
    }

    const sessionIds = [
      ...new Set(quizzes.map((quiz) => quiz.studySession.toString())),
    ];

    if (sessionIds.length !== 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz batch session.",
      });
    }

    const session = await StudySession.findOne({
      _id: sessionIds[0],
      user: req.userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Study session not found.",
      });
    }

    session.quizCompleted = true;

    const lessonCompleted = session.lessonCompleted === true;

    session.progress = lessonCompleted ? 100 : 50;

    if (lessonCompleted) {
      session.status = "completed";
      session.completedAt = session.completedAt || new Date();
    } else {
      session.status = "active";
      session.completedAt = null;
    }

    await session.save();

    return res.status(200).json({
      success: true,
      message: "All quiz questions answered. Quiz completed successfully.",
      totalQuestions: quizzes.length,
      correctAnswers: quizzes.filter((quiz) => quiz.isCorrect).length,
      session,
    });
  } catch (error) {
    console.error("Complete Quiz Batch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete quiz.",
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

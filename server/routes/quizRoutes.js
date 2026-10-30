const express = require("express");

const Quiz = require("../models/Quiz");
const StudySession = require("../models/StudySession");
const LearningProgress = require("../models/LearningProgress");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GENERATE PRACTICE QUIZ
// =====================================================

router.post("/generate", authMiddleware, async (req, res) => {

    try {

        const {
            subject,
            topic,
            difficulty = "Beginner",
            numberOfQuestions = 5
        } = req.body;


        if (!subject || !topic) {

            return res.status(400).json({
                message:
                    "Subject and topic are required"
            });
        }


        // =============================================
        // FIND ACTIVE STUDY SESSION
        // =============================================

        const session =
            await StudySession.findOne({
                user: req.userId,
                status: "active"
            }).sort({
                createdAt: -1
            });


        if (!session) {

            return res.status(404).json({
                message:
                    "Please create a study session first"
            });
        }


        // =============================================
        // CHECK EXISTING LEARNING PROGRESS
        // =============================================

        const progress =
            await LearningProgress.findOne({
                user: req.userId,
                subject,
                topic
            });


        let selectedDifficulty =
            difficulty;


        // =============================================
        // ADAPT DIFFICULTY
        // =============================================

        if (progress) {

            if (progress.accuracy >= 80) {

                selectedDifficulty =
                    progress.difficulty === "Advanced"
                        ? "Advanced"
                        : progress.difficulty === "Beginner"
                        ? "Intermediate"
                        : "Advanced";

            } else if (
                progress.accuracy < 50 &&
                progress.questionsAttempted >= 3
            ) {

                selectedDifficulty =
                    "Beginner";

            } else {

                selectedDifficulty =
                    progress.difficulty;
            }
        }


        // =============================================
        // QUESTION BANK
        // =============================================

        const questionBank = {

            Java: {

                Arrays: {

                    Beginner: [
                        {
                            question:
                                "Which symbol is used to access an element of a Java array?",
                            options: [
                                "()",
                                "[]",
                                "{}",
                                "<>"
                            ],
                            correctAnswer: "[]"
                        },
                        {
                            question:
                                "What is the index of the first element of a Java array?",
                            options: [
                                "0",
                                "1",
                                "-1",
                                "Depends on the array"
                            ],
                            correctAnswer: "0"
                        }
                    ],

                    Intermediate: [
                        {
                            question:
                                "What is the time complexity of accessing an element by index in a Java array?",
                            options: [
                                "O(n)",
                                "O(log n)",
                                "O(1)",
                                "O(n²)"
                            ],
                            correctAnswer: "O(1)"
                        },
                        {
                            question:
                                "What happens when you access an array using an invalid index?",
                            options: [
                                "NullPointerException",
                                "ArrayIndexOutOfBoundsException",
                                "IOException",
                                "SyntaxError"
                            ],
                            correctAnswer:
                                "ArrayIndexOutOfBoundsException"
                        }
                    ],

                    Advanced: [
                        {
                            question:
                                "What is the time complexity of inserting an element at the beginning of a normal Java array when shifting is required?",
                            options: [
                                "O(1)",
                                "O(log n)",
                                "O(n)",
                                "O(n log n)"
                            ],
                            correctAnswer: "O(n)"
                        }
                    ]
                },

                OOP: {

                    Beginner: [
                        {
                            question:
                                "Which keyword is used to create a class in Java?",
                            options: [
                                "class",
                                "object",
                                "new",
                                "struct"
                            ],
                            correctAnswer: "class"
                        }
                    ],

                    Intermediate: [
                        {
                            question:
                                "Which OOP concept allows a child class to acquire properties of a parent class?",
                            options: [
                                "Encapsulation",
                                "Inheritance",
                                "Abstraction",
                                "Polymorphism"
                            ],
                            correctAnswer:
                                "Inheritance"
                        }
                    ],

                    Advanced: [
                        {
                            question:
                                "Which mechanism allows a subclass to provide a specific implementation of a method already defined by its parent class?",
                            options: [
                                "Method overloading",
                                "Method overriding",
                                "Constructor chaining",
                                "Encapsulation"
                            ],
                            correctAnswer:
                                "Method overriding"
                        }
                    ]
                }
            }
        };


        // =============================================
        // GET QUESTIONS
        // =============================================

        const subjectBank =
            questionBank[subject];

        let topicBank =
            subjectBank?.[topic];

        let questions =
            topicBank?.[selectedDifficulty];


        // =============================================
        // FALLBACK QUESTIONS
        // =============================================

        if (!questions) {

            questions = [

                {
                    question:
                        `Which statement about ${topic} is correct?`,

                    options: [
                        "It is used in programming",
                        "It is unrelated to programming",
                        "It cannot be learned",
                        "None of the above"
                    ],

                    correctAnswer:
                        "It is used in programming"
                },

                {
                    question:
                        `What is an important skill when learning ${topic}?`,

                    options: [
                        "Practice",
                        "Avoiding examples",
                        "Never revising",
                        "Ignoring mistakes"
                    ],

                    correctAnswer:
                        "Practice"
                }
            ];
        }


        // =============================================
        // LIMIT QUESTIONS
        // =============================================

        questions =
            questions.slice(
                0,
                Math.min(
                    Number(numberOfQuestions),
                    questions.length
                )
            );


        // =============================================
        // SAVE QUIZ QUESTIONS
        // =============================================

        const createdQuizzes = [];


        for (const item of questions) {

            const quiz =
                await Quiz.create({

                    user: req.userId,

                    studySession:
                        session._id,

                    question:
                        item.question,

                    correctAnswer:
                        item.correctAnswer

                });


            createdQuizzes.push({

                id: quiz._id,

                question:
                    item.question,

                options:
                    item.options,

                difficulty:
                    selectedDifficulty

            });
        }


        // =============================================
        // RESPONSE
        // =============================================

        res.status(201).json({

            message:
                "Quiz generated successfully",

            subject,

            topic,

            difficulty:
                selectedDifficulty,

            questions:
                createdQuizzes

        });


    } catch (error) {

        console.error(
            "Generate Quiz Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to generate quiz"

        });
    }

});


// =====================================================
// SUBMIT ANSWER
// =====================================================

router.put("/:id/answer", authMiddleware, async (req, res) => {

    try {

        const {
            userAnswer,
            timeSpent = 0
        } = req.body;


        if (!userAnswer) {

            return res.status(400).json({
                message:
                    "Answer is required"
            });
        }


        const quiz =
            await Quiz.findOne({

                _id: req.params.id,

                user: req.userId

            });


        if (!quiz) {

            return res.status(404).json({
                message:
                    "Quiz not found"
            });
        }


        quiz.userAnswer =
            userAnswer;


        // =============================================
        // CHECK ANSWER
        // =============================================

        if (
            userAnswer
                .trim()
                .toLowerCase() ===
            quiz.correctAnswer
                .trim()
                .toLowerCase()
        ) {

            quiz.isCorrect =
                true;

            quiz.score =
                100;

        } else {

            quiz.isCorrect =
                false;

            quiz.score =
                0;
        }


        await quiz.save();


        // =============================================
        // STUDY SESSION
        // =============================================

        const session =
            await StudySession.findOne({

                _id:
                    quiz.studySession,

                user:
                    req.userId

            });


        if (
            session &&
            quiz.isCorrect
        ) {

            session.progress =
                Math.min(
                    session.progress + 10,
                    100
                );


            if (
                session.progress ===
                100
            ) {

                session.status =
                    "completed";

                session.completedAt =
                    new Date();
            }


            await session.save();
        }


        // =============================================
        // UPDATE ADAPTIVE LEARNING
        // =============================================

        if (session) {

            await LearningProgress.findOneAndUpdate(

                {
                    user:
                        req.userId,

                    subject:
                        session.subject,

                    topic:
                        session.topic
                },

                {

                    $inc: {

                        questionsAttempted:
                            1,

                        correctAnswers:
                            quiz.isCorrect
                                ? 1
                                : 0,

                        wrongAnswers:
                            quiz.isCorrect
                                ? 0
                                : 1,

                        totalTimeSpent:
                            Number(timeSpent)

                    },

                    $set: {

                        lastScore:
                            quiz.score

                    }

                },

                {
                    upsert: true,
                    new: true
                }
            );


            // =========================================
            // RECALCULATE ACCURACY
            // =========================================

            const progress =
                await LearningProgress.findOne({

                    user:
                        req.userId,

                    subject:
                        session.subject,

                    topic:
                        session.topic

                });


            if (progress) {

                progress.accuracy =
                    Math.round(
                        (
                            progress.correctAnswers /
                            progress.questionsAttempted
                        ) * 100
                    );


                // =====================================
                // ADAPT DIFFICULTY
                // =====================================

                if (
                    progress.accuracy >= 80
                ) {

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
                    progress.accuracy < 50 &&
                    progress.questionsAttempted >= 3
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
            }
        }


        // =============================================
        // RESPONSE
        // =============================================

        res.status(200).json({

            message:
                "Answer submitted",

            quiz,

            progress:
                session
                    ? session.progress
                    : 0,

            correct:
                quiz.isCorrect

        });


    } catch (error) {

        console.error(
            "Quiz Answer Error:",
            error
        );

        res.status(500).json({

            message:
                "Server error"

        });
    }

});


// =====================================================
// QUIZ HISTORY
// =====================================================

router.get("/", authMiddleware, async (req, res) => {

    try {

        const quizzes =
            await Quiz.find({

                user:
                    req.userId

            }).sort({

                createdAt:
                    -1

            });


        res.status(200).json({

            quizzes

        });


    } catch (error) {

        console.error(
            "Quiz History Error:",
            error
        );

        res.status(500).json({

            message:
                "Server error"

        });
    }
});


module.exports = router;
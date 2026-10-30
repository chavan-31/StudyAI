const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    getStudentContext
} = require("../services/contextService");

const {
    generateAIResponse
} = require("../services/aiService");

const Conversation = require("../models/Conversation");
const Chat = require("../models/Chat");

const router = express.Router();


// ======================================================
// ASK AI
// ======================================================

router.post(
    "/ask",
    authMiddleware,
    async (req, res) => {

        try {

            // ==========================================
            // ACCEPT QUESTION / MESSAGE
            // ==========================================

            const question =
                req.body.question ||
                req.body.message ||
                "";


            // ==========================================
            // VALIDATE QUESTION
            // ==========================================

            if (!question || !question.trim()) {

                return res.status(400).json({
                    success: false,
                    message: "Question is required"
                });

            }


            // ==========================================
            // GET USER ID
            // ==========================================

            const userId = req.userId;

            if (!userId) {

                return res.status(401).json({
                    success: false,
                    message: "User authentication required"
                });

            }


            // ==========================================
            // GET COMPLETE STUDENT CONTEXT
            // ==========================================

            const context =
                await getStudentContext(userId);


            // ==========================================
            // GENERATE AI RESPONSE
            // ==========================================

            const aiResult =
                await generateAIResponse(
                    question.trim(),
                    {

                        // Complete context
                        ...context,


                        // ==================================
                        // COMPATIBILITY FIELDS
                        // ==================================

                        subject:
                            context.currentStudy?.subject ||
                            "",

                        topic:
                            context.currentStudy?.topic ||
                            "",

                        learningLevel:
                            context.student?.learningLevel ||
                            "Beginner",

                        goal:
                            Array.isArray(context.goals)
                                ? context.goals.join(", ")
                                : context.goals || ""

                    }
                );


            // ==========================================
            // EXTRACT ACTUAL AI TEXT
            // ==========================================

            let aiResponse = "";

            if (typeof aiResult === "string") {

                // Backward compatibility
                aiResponse = aiResult;

            } else if (
                aiResult &&
                typeof aiResult.response === "string"
            ) {

                // Current Gemini service format
                aiResponse = aiResult.response;

            } else {

                throw new Error(
                    "AI service returned an invalid response format."
                );

            }


            // ==========================================
            // VALIDATE AI RESPONSE
            // ==========================================

            if (!aiResponse.trim()) {

                throw new Error(
                    "AI returned an empty response."
                );

            }


            // ==========================================
            // SAVE TO CONVERSATION
            // ==========================================

            let conversation =
                await Conversation.findOne({

                    userId,

                    subject:
                        context.currentStudy?.subject ||
                        "",

                    topic:
                        context.currentStudy?.topic ||
                        ""

                });


            // ==========================================
            // CREATE CONVERSATION
            // ==========================================

            if (!conversation) {

                conversation =
                    await Conversation.create({

                        userId,

                        subject:
                            context.currentStudy?.subject ||
                            "",

                        topic:
                            context.currentStudy?.topic ||
                            "",

                        messages: []

                    });

            }


            // ==========================================
            // SAVE USER QUESTION
            // ==========================================

            conversation.messages.push({

                role: "user",

                content:
                    question.trim()

            });


            // ==========================================
            // SAVE AI RESPONSE
            // ==========================================

            conversation.messages.push({

                role: "assistant",

                content:
                    aiResponse.trim()

            });


            await conversation.save();


            // ==========================================
            // ALSO SAVE TO OLD CHAT MODEL
            // ==========================================

            try {

                if (
                    context.currentStudy &&
                    context.currentStudy.subject
                ) {

                    const StudySession =
                        require("../models/StudySession");


                    // Find active study session
                    const activeSession =
                        await StudySession.findOne({

                            user: userId,

                            status: "active"

                        }).sort({

                            createdAt: -1

                        });


                    if (activeSession) {

                        await Chat.create({

                            user: userId,

                            studySession:
                                activeSession._id,

                            question:
                                question.trim(),

                            answer:
                                aiResponse.trim(),

                            subject:
                                activeSession.subject,

                            topic:
                                activeSession.topic

                        });

                    }

                }

            } catch (chatError) {

                console.error(
                    "Legacy chat save error:",
                    chatError.message
                );

            }


            // ==========================================
            // RETURN AI RESPONSE
            // ==========================================

            return res.status(200).json({

                success: true,

                message:
                    "AI response generated successfully",

                // Actual AI text
                response:
                    aiResponse.trim(),

                // Compatibility
                answer:
                    aiResponse.trim(),

                // Student context
                context: {

                    student:
                        context.student,

                    currentStudy:
                        context.currentStudy,

                    goals:
                        context.goals,

                    weakTopics:
                        context.weakTopics,

                    completedTopics:
                        context.completedTopics

                }

            });


        } catch (error) {

            console.error(
                "AI Route Error:",
                error
            );


            // ==========================================
            // GEMINI QUOTA ERROR
            // ==========================================

            if (
                error?.message?.toLowerCase()?.includes("quota") ||
                error?.message?.toLowerCase()?.includes("rate limit") ||
                error?.status === 429
            ) {

                return res.status(429).json({

                    success: false,

                    message:
                        "Gemini AI quota exceeded. Please try again after the quota resets.",

                    error:
                        error.message

                });

            }


            // ==========================================
            // GENERAL ERROR
            // ==========================================

            return res.status(500).json({

                success: false,

                message:
                    "AI response failed",

                error:
                    error.message

            });

        }

    }
);


// ======================================================
// GET CHAT HISTORY
// ======================================================

router.get(
    "/history",
    authMiddleware,
    async (req, res) => {

        try {

            const chats =
                await Chat.find({

                    user: req.userId

                })
                .sort({

                    createdAt: 1

                });


            return res.status(200).json({

                success: true,

                chats

            });


        } catch (error) {

            console.error(
                "Chat History Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to get chat history",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;
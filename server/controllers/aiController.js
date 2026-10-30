const {
    getStudentContext
} = require("../services/contextService");

const {
    generateAIResponse
} = require("../services/aiService");

const Conversation = require("../models/Conversation");


// ==========================================
// ASK AI
// ==========================================

const askAI = async (req, res) => {
    try {

        // Accept both "question" and "message"
        const question =
            req.body.question ||
            req.body.message ||
            "";

        // ==========================================
        // VALIDATE QUESTION
        // ==========================================

        if (!question || !question.trim()) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        // ==========================================
        // GET COMPLETE STUDENT CONTEXT
        // ==========================================

        const context =
            await getStudentContext(
                req.user._id
            );

        // ==========================================
        // GENERATE AI RESPONSE
        // ==========================================

        const aiResponse =
            await generateAIResponse(
                question.trim(),
                {
                    ...context,

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
        // FIND EXISTING CONVERSATION
        // ==========================================

        let conversation =
            await Conversation.findOne({
                userId: req.user._id,

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
                    userId: req.user._id,

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
            content: question.trim()
        });

        // ==========================================
        // SAVE AI RESPONSE
        // ==========================================

        conversation.messages.push({
            role: "assistant",
            content: aiResponse
        });

        await conversation.save();

        // ==========================================
        // RETURN RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "AI response generated successfully",

            response:
                aiResponse,

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
            "AI Controller Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to generate AI response",

            error:
                error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    askAI
};

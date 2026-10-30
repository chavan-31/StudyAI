const User = require("../models/user");
const Conversation = require("../models/Conversation");
const StudySession = require("../models/StudySession");
const LearningProgress = require("../models/LearningProgress");
const Progress = require("../models/Progress");

const getStudentContext = async (userId) => {
    try {
        const user = await User.findById(userId)
            .select("-password")
            .lean();

        if (!user) {
            throw new Error("User not found");
        }

        // Run independent database queries together
        const [
            conversations,
            studySessions,
            learningProgress,
            progress
        ] = await Promise.all([
            Conversation.find({ userId })
                .sort({ updatedAt: -1 })
                .limit(10)
                .lean(),

            StudySession.find({ user: userId })
                .sort({ updatedAt: -1 })
                .limit(10)
                .lean(),

            LearningProgress.find({ user: userId })
                .sort({ updatedAt: -1 })
                .limit(20)
                .lean(),

            Progress.find({ userId })
                .sort({ updatedAt: -1 })
                .limit(20)
                .lean()
        ]);

        // Topics where the student's accuracy/score is below 60%
        const weakTopics = learningProgress
            .filter(item => Number(item.accuracy || 0) < 60)
            .map(item => ({
                subject: item.subject,
                topic: item.topic,
                accuracy: item.accuracy,
                lastScore: item.lastScore,
                questionsAttempted: item.questionsAttempted
            }));

        // Recently completed topics
        const completedTopics = progress
            .filter(item => item.completed)
            .map(item => ({
                subject: item.subject,
                topic: item.topic,
                score: item.score,
                difficulty: item.difficulty
            }));

        // Recent conversation history
        const recentConversations = conversations.map(conversation => ({
            subject: conversation.subject,
            topic: conversation.topic,
            messages: conversation.messages,
            updatedAt: conversation.updatedAt
        }));

        // Recent study activity
        const recentStudySessions = studySessions.map(session => ({
            subject: session.subject,
            topic: session.topic,
            goal: session.goal,
            difficulty: session.difficulty,
            progress: session.progress,
            status: session.status,
            startedAt: session.startedAt,
            completedAt: session.completedAt
        }));

        return {
            student: {
                id: user._id,
                name: user.name,
                learningLevel: user.learningLevel
            },

            currentStudy: {
                subject: user.currentSubject || "",
                topic: user.currentTopic || ""
            },

            goals: user.goals || [],

            recentConversations,

            recentStudySessions,

            learningProgress,

            progress,

            weakTopics,

            completedTopics
        };

    } catch (error) {
        console.error(
            "Context Service Error:",
            error.message
        );

        throw new Error("Failed to get student context");
    }
};

module.exports = {
    getStudentContext
};
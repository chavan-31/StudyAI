const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
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

        answer: {
            type: String,
            required: true
        },

        subject: {
            type: String
        },

        topic: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
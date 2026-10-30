const mongoose = require("mongoose");

const codeHistorySchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            language: String,

            code: String,

            action: {
                type: String,
                enum: [
                    "run",
                    "explain",
                    "debug",
                    "hint"
                ]
            },

            success: {
                type: Boolean,
                default: true
            },

            output: String,

            subject: String,

            topic: String
        },
        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "CodeHistory",
        codeHistorySchema
    );
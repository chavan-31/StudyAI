const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        topic: {
            type: String,
            required: true,
            trim: true
        },

        completed: {
            type: Boolean,
            default: false
        },

        score: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy"
        }
    },
    {
        timestamps: true
    }
);

const Progress = mongoose.model(
    "Progress",
    progressSchema
);

module.exports = Progress;
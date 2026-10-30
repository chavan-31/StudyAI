const mongoose = require("mongoose");


// ==========================================
// USER SCHEMA
// ==========================================

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        learningLevel: {
            type: String,
            default: "Beginner"
        },

        currentSubject: {
            type: String,
            default: ""
        },

        currentTopic: {
            type: String,
            default: ""
        },

        goals: {
            type: [String],
            default: []
        }
    },

    {
        timestamps: true
    }
);


// ==========================================
// PREVENT MONGOOSE MODEL OVERWRITE
// ==========================================

module.exports =
    mongoose.models.User ||
    mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const savedCodeSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            title: {
                type: String,
                required: true
            },

            language: {
                type: String,
                default: "Java"
            },

            code: {
                type: String,
                required: true
            },

            subject: String,

            topic: String,

            tags: [
                String
            ]
        },
        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "SavedCode",
        savedCodeSchema
    );
const mongoose = require("mongoose");

const dsaProgressSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true
            },

            arrays: {
                type: Number,
                default: 0
            },

            strings: {
                type: Number,
                default: 0
            },

            searching: {
                type: Number,
                default: 0
            },

            sorting: {
                type: Number,
                default: 0
            },

            linkedList: {
                type: Number,
                default: 0
            },

            stack: {
                type: Number,
                default: 0
            },

            queue: {
                type: Number,
                default: 0
            },

            trees: {
                type: Number,
                default: 0
            },

            graphs: {
                type: Number,
                default: 0
            },

            totalSolved: {
                type: Number,
                default: 0
            }
        },
        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "DSAProgress",
        dsaProgressSchema
    );
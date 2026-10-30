const mongoose = require("mongoose");

const documentChunkSchema = new mongoose.Schema(
  {
    documentName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DocumentChunk",
  documentChunkSchema
);
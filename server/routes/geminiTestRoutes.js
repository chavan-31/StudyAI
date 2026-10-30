const express = require("express");
const { generateAnswer } = require("../services/geminiService");

const router = express.Router();

// POST /api/gemini/test
router.post("/test", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const answer = await generateAnswer(prompt);

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Gemini test error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
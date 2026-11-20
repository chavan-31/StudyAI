require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

async function testGemini() {
  try {
    console.log("Connecting to Gemini AI...");

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY missing in .env");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: "Explain Java variables in simple words.",
    });

    console.log("Gemini connected successfully!");
    console.log(response.text);
  } catch (error) {
    console.error("Gemini Error:", error.message);
  }
}

testGemini();

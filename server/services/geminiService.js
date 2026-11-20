const { GoogleGenAI } = require("@google/genai");

let ai = null;

// Initialize Gemini
const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in server/.env");
  }

  ai = new GoogleGenAI({ apiKey });

  return ai;
};

// Get Gemini client
const getGeminiClient = () => {
  if (!ai) {
    initializeGemini();
  }

  return ai;
};

// Generate content
const generateGeminiContent = async (prompt) => {
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("A valid prompt is required.");
  }

  const client = getGeminiClient();

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

  console.log(`Generating content using ${model}...`);

  const result = await client.models.generateContent({
    model,
    contents: prompt.trim(),
  });

  const response = result?.text;

  if (!response || !response.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  return {
    success: true,
    model,
    response: response.trim(),
  };
};

module.exports = {
  initializeGemini,
  getGeminiClient,
  generateGeminiContent,
};

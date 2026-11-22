const { GoogleGenAI } = require("@google/genai");

// ==========================================
// CREATE GEMINI CLIENT
// ==========================================

const createAIClient = () => {
  const mode = (process.env.AI_MODE || "demo").trim().toLowerCase();

  if (mode !== "gemini") {
    return null;
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in server/.env");
  }

  return new GoogleGenAI({ apiKey });
};

// ==========================================
// INITIALIZE CLIENT
// ==========================================

let ai = null;

try {
  ai = createAIClient();
} catch (error) {
  console.error("Gemini Configuration Error:", error.message);
}

// ==========================================
// BUILD PERSONALIZED PROMPT
// ==========================================

const buildPrompt = (prompt, context = {}) => {
  const student = context.student || {};
  const currentStudy = context.currentStudy || {};

  const subject = context.subject || currentStudy.subject || "Not specified";
  const topic = context.topic || currentStudy.topic || "Not specified";

  const learningLevel =
    context.learningLevel || student.learningLevel || "Beginner";

  const goal =
    context.goal ||
    (Array.isArray(context.goals) ? context.goals.join(", ") : context.goals) ||
    "Understand the topic";

  const weakTopics = Array.isArray(context.weakTopics)
    ? context.weakTopics.join(", ")
    : "Not available";

  const completedTopics = Array.isArray(context.completedTopics)
    ? context.completedTopics.join(", ")
    : "Not available";

  return `
You are Cognify AI, a personalized intelligent learning assistant.

STUDENT CONTEXT:
Subject: ${subject}
Current Topic: ${topic}
Learning Level: ${learningLevel}
Learning Goal: ${goal}
Weak Topics: ${weakTopics}
Completed Topics: ${completedTopics}

INSTRUCTIONS:
1. Explain concepts in simple English.
2. Adapt explanations to the student's level.
3. Give practical examples.
4. Use Java for programming questions unless another language is requested.
5. Explain code step by step when appropriate.
6. Provide practice questions when useful.
7. Help with technical interviews and placements.
8. Use student context when relevant.
9. Never invent student progress.
10. Keep answers structured and accurate.

STUDENT QUESTION:
${prompt}

Provide a helpful and personalized answer.
`;
};

// ==========================================
// CHECK TEMPORARY GEMINI ERRORS
// ==========================================

const isTemporaryError = (error) => {
  const message = error?.message || String(error);
  const status = Number(error?.status || error?.code);

  return (
    [500, 502, 503, 504].includes(status) ||
    message.includes("500") ||
    message.includes("502") ||
    message.includes("503") ||
    message.includes("504") ||
    message.includes("UNAVAILABLE") ||
    message.toLowerCase().includes("high demand") ||
    message.toLowerCase().includes("temporarily")
  );
};

// ==========================================
// GENERATE GEMINI RESPONSE WITH RETRIES
// ==========================================

const generateWithRetry = async (model, contents) => {
  if (!ai) {
    throw new Error("Gemini client is not initialized.");
  }

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `Sending request to Gemini (attempt ${attempt}/${maxAttempts})...`,
      );

      return await ai.models.generateContent({
        model,
        contents,
      });
    } catch (error) {
      console.error(`Gemini attempt ${attempt} failed:`, error.message);

      // Retry only temporary server availability errors.
      if (!isTemporaryError(error) || attempt === maxAttempts) {
        throw error;
      }

      const delay = 1500 * Math.pow(2, attempt - 1);

      console.log(`Gemini temporarily unavailable. Retrying in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Gemini request failed after multiple attempts.");
};

// ==========================================
// GENERATE AI RESPONSE
// ==========================================

const generateAIResponse = async (prompt, context = {}) => {
  const mode = (process.env.AI_MODE || "demo").trim().toLowerCase();

  if (mode !== "gemini") {
    return {
      success: true,
      mode: "demo",
      response: "Cognify AI Demo Mode: Gemini is disabled.",
    };
  }

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("A valid question is required.");
  }

  if (!ai) {
    throw new Error("Gemini client is not initialized. Check your API key.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

  try {
    const fullPrompt = buildPrompt(prompt.trim(), context);

    const result = await generateWithRetry(model, fullPrompt);

    const aiText = result?.text;

    if (!aiText || !aiText.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    return {
      success: true,
      mode: "gemini",
      model,
      response: aiText.trim(),
    };
  } catch (error) {
    console.error("Gemini API Error:", error?.message || error);

    const message = error?.message || "Gemini request failed.";
    const lowerMessage = message.toLowerCase();

    if (
      error?.status === 429 ||
      lowerMessage.includes("429") ||
      lowerMessage.includes("quota") ||
      lowerMessage.includes("rate limit")
    ) {
      throw new Error("Gemini API quota exceeded. Try again later.");
    }

    if (
      error?.status === 401 ||
      error?.status === 403 ||
      lowerMessage.includes("api key") ||
      lowerMessage.includes("permission")
    ) {
      throw new Error("Gemini authentication failed. Check your API key.");
    }

    if (
      lowerMessage.includes("model") &&
      (lowerMessage.includes("not found") ||
        lowerMessage.includes("unsupported"))
    ) {
      throw new Error(`Gemini model ${model} is unavailable.`);
    }

    throw new Error(message);
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createAIClient,
  generateAIResponse,
  buildPrompt,
  generateWithRetry,
};

const { GoogleGenAI } = require("@google/genai");

// ==========================================
// CREATE GEMINI CLIENT
// ==========================================

const createAIClient = () => {
    const mode = (process.env.AI_MODE || "demo").trim().toLowerCase();

    // Demo mode = no Gemini API call
    if (mode !== "gemini") {
        return null;
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is missing. Add a valid Gemini API key to server/.env"
        );
    }

    return new GoogleGenAI({
        apiKey
    });
};

// ==========================================
// GEMINI CLIENT
// ==========================================

let ai = null;

try {
    ai = createAIClient();
} catch (error) {
    console.error("Gemini Configuration Error:", error.message);
}

// ==========================================
// GENERATE AI RESPONSE
// ==========================================

const generateAIResponse = async (prompt) => {
    const mode = (process.env.AI_MODE || "demo").trim().toLowerCase();

    // ======================================
    // DEMO MODE
    // ======================================

    if (mode !== "gemini") {
        return {
            success: true,
            mode: "demo",
            response:
                "Demo AI response: Gemini is currently disabled. Set AI_MODE=gemini in your .env file to enable Gemini."
        };
    }

    // ======================================
    // CHECK GEMINI CLIENT
    // ======================================

    if (!ai) {
        throw new Error(
            "Gemini client is not initialized. Check GEMINI_API_KEY and AI_MODE."
        );
    }

    if (!prompt || typeof prompt !== "string") {
        throw new Error("A valid prompt is required.");
    }

    // ======================================
    // GEMINI MODEL
    // ======================================

    const model =
        process.env.GEMINI_MODEL || "gemini-2.5-flash";

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });

        const text = response?.text;

        if (!text) {
            throw new Error("Gemini returned an empty response.");
        }

        return {
            success: true,
            mode: "gemini",
            model,
            response: text.trim()
        };
    } catch (error) {
        console.error("Gemini API Error:");

        console.error(error?.message || error);

        // ==================================
        // RATE LIMIT / QUOTA ERROR
        // ==================================

        if (
            error?.status === 429 ||
            error?.message?.includes("429") ||
            error?.message?.toLowerCase()?.includes("quota") ||
            error?.message?.toLowerCase()?.includes("rate limit")
        ) {
            throw new Error(
                "Gemini API rate limit or quota exceeded. Please try again later or use another Gemini API key/project."
            );
        }

        // ==================================
        // AUTHENTICATION ERROR
        // ==================================

        if (
            error?.status === 401 ||
            error?.status === 403 ||
            error?.message?.toLowerCase()?.includes("api key") ||
            error?.message?.toLowerCase()?.includes("permission")
        ) {
            throw new Error(
                "Gemini API authentication failed. Check your GEMINI_API_KEY and Google AI API configuration."
            );
        }

        // ==================================
        // GENERAL ERROR
        // ==================================

        throw new Error(
            error?.message || "Gemini AI request failed."
        );
    }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    createAIClient,
    generateAIResponse
};
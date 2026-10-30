const { generateAIResponse } = require("../services/aiService");


// ==========================================
// EXPLAIN CODE
// ==========================================

const explainCode = async (req, res) => {
    try {

        const {
            code,
            language,
            context
        } = req.body;


        // Validation
        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required"
            });
        }


        // AI Prompt
        const prompt = `
You are an expert programming tutor.

The student wants you to explain their code.

PROGRAMMING LANGUAGE:
${language}

STUDENT CODE:
${code}

STUDENT CONTEXT:
${JSON.stringify(context || {})}


Give a beginner-friendly explanation.

Use the following structure:

1. What does this code do?
2. Line-by-line explanation
3. Important programming concepts
4. Time complexity
5. Space complexity
6. Example output
7. Possible improvements

Important:
- Use simple language.
- Do not assume advanced knowledge.
- Explain why the code works.
- If there is an error in the code, clearly mention it.
`;


        // Call existing AI service
        const response = await generateAIResponse(
            prompt,
            context || {}
        );


        // Send response
        res.status(200).json({
            success: true,
            type: "explanation",
            response: response
        });


    } catch (error) {

        console.error(
            "Explain Code Error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to explain code",
            error: error.message
        });
    }
};



// ==========================================
// DEBUG CODE
// ==========================================

const debugCode = async (req, res) => {
    try {

        const {
            code,
            language,
            error,
            context
        } = req.body;


        // Validation
        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required"
            });
        }


        // AI Prompt
        const prompt = `
You are an expert programming debugging tutor.

The student wants help debugging their code.

PROGRAMMING LANGUAGE:
${language}

STUDENT CODE:
${code}

ERROR MESSAGE:
${error || "No error message provided"}

STUDENT CONTEXT:
${JSON.stringify(context || {})}


Analyze the student's code carefully.

Give the answer using this structure:

1. Error found
2. Why the error occurs
3. Exact location of the problem
4. How to fix it
5. Corrected code
6. Beginner-friendly explanation
7. How to avoid this mistake in the future

Important:
- Explain the error clearly.
- Do not assume advanced knowledge.
- Preserve the student's original logic where possible.
- If there is no actual error, explain that clearly.
`;


        // Call existing AI service
        const response = await generateAIResponse(
            prompt,
            context || {}
        );


        // Send response
        res.status(200).json({
            success: true,
            type: "debug",
            response: response
        });


    } catch (error) {

        console.error(
            "Debug Code Error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to debug code",
            error: error.message
        });
    }
};



// ==========================================
// EXPORT
// ==========================================

module.exports = {
    explainCode,
    debugCode
};
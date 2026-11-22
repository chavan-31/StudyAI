const API_URL = "https://studyai-k7bc.onrender.com";

export const askRAGQuestion = async (question) => {
  const response = await fetch(
    `${API_URL}/api/rag/ask`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get answer"
    );
  }

  return data;
};
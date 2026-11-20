const API_URL = "http://localhost:5000";

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
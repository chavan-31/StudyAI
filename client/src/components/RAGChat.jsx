import { useState } from "react";
import { askRAGQuestion } from "../services/ragService";

const RAGChat = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");

      const data = await askRAGQuestion(question);

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>📚 Study Assistant</h2>

      <textarea
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
        placeholder="Ask a question about your study material..."
        rows={5}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
        }}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "12px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          {error}
        </div>
      )}

      {answer && (
        <div style={{ marginTop: "30px" }}>
          <h3>🤖 AI Answer</h3>

          <div
            style={{
              whiteSpace: "pre-wrap",
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "10px",
            }}
          >
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};

export default RAGChat;
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { askAI } from "../services/api";
import "./AIChat.css";

function AIChat() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      message:
        "Hello! I'm MentorIQ AI, your personal learning and coding mentor. What would you like to learn today?",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const sendQuestion = async (text = question) => {
    const cleanQuestion = text.trim();

    if (!cleanQuestion || loading) return;

    if (!token) {
      navigate("/login");
      return;
    }

    setMessages((previous) => [
      ...previous,
      { role: "user", message: cleanQuestion },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const data = await askAI(cleanQuestion, token);

      const answer =
        data?.answer ||
        data?.response ||
        data?.message ||
        "I couldn't generate a response. Please try again.";

      setMessages((previous) => [...previous, { role: "ai", message: answer }]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          message: error.message || "Something went wrong. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendQuestion();
  };

  const quickPrompts = [
    {
      icon: "⌘",
      title: "Explain a concept",
      description: "Understand difficult topics simply",
      text: "Explain Binary Search in Java in a simple way with an example.",
    },
    {
      icon: "⚡",
      title: "Practice coding",
      description: "Challenge your problem-solving skills",
      text: "Give me a Java DSA problem and don't give the answer immediately.",
    },
    {
      icon: "◎",
      title: "Plan my learning",
      description: "Find what you should study next",
      text: "What should I study next based on my current learning?",
    },
  ];

  return (
    <div className="cognify-ai-page">
      {/* BACKGROUND DECORATION */}
      <div className="cognify-bg-glow glow-left" />
      <div className="cognify-bg-glow glow-right" />
      <div className="cognify-grid-background" />

      {/* HEADER */}
      <header className="cognify-ai-header">
        <button
          className="cognify-ai-brand"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span className="cognify-ai-brand-icon">M</span>
          <span className="cognify-ai-brand-text">
            <strong>MentorIQ AI</strong>
            <small>Your Personal AI Learning & Coding Mentor</small>
          </span>
        </button>

        <nav className="cognify-ai-nav">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/study")}>Study</button>
          <button className="active">AI Assistant</button>
        </nav>

        <button
          className="cognify-context-button"
          onClick={() => navigate("/context")}
        >
          <span>✧</span>
          Learning Context
        </button>
      </header>

      {/* MAIN */}
      <main className="cognify-ai-main">
        {/* HERO */}
        <section className="cognify-ai-hero">
          <div className="cognify-ai-visual">
            <div className="ai-visual-orbit orbit-a" />
            <div className="ai-visual-orbit orbit-b" />
            <div className="ai-visual-orbit orbit-c" />

            <div className="ai-visual-core">
              <div className="ai-core-shine" />
              <span>✦</span>
            </div>

            <div className="ai-orbit-dot dot-a" />
            <div className="ai-orbit-dot dot-b" />
            <div className="ai-orbit-dot dot-c" />
          </div>

          <div className="cognify-ai-hero-content">
            <div className="cognify-ai-status">
              <span />
              CONTEXT ENGINE ACTIVE
            </div>

            <h1>
              Think smarter.
              <br />
              <span>Learn without limits.</span>
            </h1>

            <p>
              Meet MentorIQ AI, your personal AI learning and coding mentor. Ask
              questions, understand concepts, practice problems, and grow your
              skills with personalized AI guidance.
            </p>

            <div className="cognify-ai-hero-tags">
              <span>✦ Personalized learning</span>
              <span>◈ Smart explanations</span>
              <span>⌘ Coding support</span>
            </div>
          </div>
        </section>

        {/* CHAT PANEL */}
        <section className="cognify-chat-panel">
          <div className="cognify-chat-header">
            <div className="cognify-chat-agent">
              <div className="cognify-agent-avatar">✦</div>
              <div>
                <strong>MentorIQ AI</strong>
                <span>Your Personal AI Learning & Coding Mentor</span>
              </div>
            </div>

            <div className="cognify-agent-online">
              <span />
              AI Assistant
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div className="cognify-chat-content">
            <div className="cognify-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`cognify-message-row ${
                    msg.role === "user" ? "message-user" : "message-ai"
                  }`}
                >
                  {msg.role === "ai" && (
                    <div className="cognify-message-avatar">✦</div>
                  )}

                  <div
                    className={`cognify-message-bubble ${
                      msg.role === "user" ? "user-bubble" : "assistant-bubble"
                    } ${msg.error ? "message-error" : ""}`}
                  >
                    <span className="message-sender">
                      {msg.role === "user" ? "You" : "MentorIQ AI"}
                    </span>
                    <p>{msg.message}</p>
                  </div>

                  {msg.role === "user" && (
                    <div className="cognify-user-message-avatar">You</div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="cognify-message-row message-ai">
                  <div className="cognify-message-avatar">✦</div>
                  <div className="cognify-typing-bubble">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK PROMPTS */}
            {messages.length === 1 && (
              <div className="cognify-quick-prompts">
                <div className="cognify-quick-heading">
                  <span>✧</span>
                  <div>
                    <strong>Get started with MentorIQ</strong>
                    <small>Choose a prompt to begin learning</small>
                  </div>
                </div>

                <div className="cognify-prompt-grid">
                  {quickPrompts.map((prompt) => (
                    <button
                      className="cognify-prompt-card"
                      key={prompt.title}
                      onClick={() => sendQuestion(prompt.text)}
                      disabled={loading}
                    >
                      <span className="prompt-icon">{prompt.icon}</span>
                      <strong>{prompt.title}</strong>
                      <small>{prompt.description}</small>
                      <span className="prompt-arrow">↗</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <form className="cognify-chat-input-area" onSubmit={handleSubmit}>
            <div className="cognify-input-box">
              <span className="input-sparkle">✧</span>

              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask MentorIQ AI anything..."
                disabled={loading}
                aria-label="Ask MentorIQ AI a question"
              />

              <button
                type="submit"
                className="cognify-send-button"
                disabled={loading || !question.trim()}
                aria-label="Send message"
              >
                {loading ? "…" : "↑"}
              </button>
            </div>

            <div className="cognify-input-footer">
              <span>↵ Enter to send</span>
              <span>
                MentorIQ AI may make mistakes. Verify important information.
              </span>
            </div>
          </form>
        </section>

        {/* BOTTOM SHORTCUTS */}
        <section className="cognify-ai-shortcuts">
          <button onClick={() => navigate("/context")}>
            <span className="shortcut-icon">✧</span>
            <span>
              <small>PERSONALIZE</small>
              <strong>Learning Context</strong>
            </span>
            <b>→</b>
          </button>

          <button onClick={() => navigate("/study")}>
            <span className="shortcut-icon">▤</span>
            <span>
              <small>GET ORGANIZED</small>
              <strong>New Study Session</strong>
            </span>
            <b>→</b>
          </button>

          <button onClick={() => navigate("/dashboard")}>
            <span className="shortcut-icon">⌂</span>
            <span>
              <small>YOUR WORKSPACE</small>
              <strong>Back to Dashboard</strong>
            </span>
            <b>→</b>
          </button>
        </section>

        <footer className="cognify-ai-footer">
          <span>✦ MentorIQ AI</span>
          <span>Your Personal AI Learning & Coding Mentor</span>
        </footer>
      </main>
    </div>
  );
}

export default AIChat;

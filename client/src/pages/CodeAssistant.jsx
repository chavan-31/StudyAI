import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudySessions } from "../services/api";
import "./CodeAssistant.css";

function CodeAssistant() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("");

  const [studyContext, setStudyContext] = useState({
    subject: "Not selected",
    topic: "Not selected",
    difficulty: "Beginner",
    goal: "Improve my learning",
  });

  // Load latest study context
  useEffect(() => {
    const loadContext = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await getStudySessions(token);

        const sessions = Array.isArray(data)
          ? data
          : data?.sessions || data?.data || [];

        if (sessions.length > 0) {
          const latest = sessions[sessions.length - 1];

          setStudyContext({
            subject: latest.subject || "Not selected",
            topic: latest.topic || "Not selected",
            difficulty: latest.difficulty || "Beginner",
            goal: latest.goal || "Improve my learning",
          });
        }
      } catch (err) {
        console.error("Study context error:", err);
      }
    };

    loadContext();
  }, []);

  // Format AI response
  const formatResponse = (data) => {
    const response =
      data?.result ||
      data?.answer ||
      data?.response ||
      data?.explanation ||
      data?.message ||
      data;

    return typeof response === "string"
      ? response
      : JSON.stringify(response, null, 2);
  };

  // Explain code
  const explainCode = async () => {
    if (!code.trim()) {
      setResult("Please enter your code before requesting an explanation.");
      return;
    }

    setLoading(true);
    setMode("explain");
    setResult("");

    try {
      const response = await fetch(
        "https://studyai-k7bc.onrender.com/api/code/explain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language,
            code,
            context: studyContext,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to explain code.",
        );
      }

      setResult(formatResponse(data));
    } catch (err) {
      setResult(`Unable to explain code.\n\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Debug code
  const debugCode = async () => {
    if (!code.trim()) {
      setResult("Please enter your code before debugging.");
      return;
    }

    if (!error.trim()) {
      setResult("Please enter the error message you are facing.");
      return;
    }

    setLoading(true);
    setMode("debug");
    setResult("");

    try {
      const response = await fetch(
        "https://studyai-k7bc.onrender.com/api/code/debug",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language,
            code,
            error,
            context: studyContext,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to debug code.");
      }

      setResult(formatResponse(data));
    } catch (err) {
      setResult(`Unable to debug code.\n\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear workspace
  const clearWorkspace = () => {
    setCode("");
    setError("");
    setResult("");
    setMode("");
  };

  return (
    <div className="cognify-code-page">
      {/* Background effects */}
      <div className="cognify-code-bg">
        <div className="cognify-code-grid"></div>
        <div className="cognify-code-glow glow-one"></div>
        <div className="cognify-code-glow glow-two"></div>

        {Array.from({ length: 24 }).map((_, index) => (
          <span
            className="cognify-code-particle"
            key={index}
            style={{
              "--particle-index": index,
              "--particle-delay": `${index * -0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="cognify-code-navbar">
        <div
          className="cognify-code-brand"
          onClick={() => navigate("/dashboard")}
        >
          <div className="cognify-code-brand-icon">✦</div>
          <div>
            <h2>
              Cognify<span> AI</span>
            </h2>
            <small>INTELLIGENT LEARNING PLATFORM</small>
          </div>
        </div>

        <div className="cognify-code-nav-links">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/study")}>Study</button>
          <button onClick={() => navigate("/ai")}>AI Assistant</button>
          <button className="active">Code Assistant</button>
        </div>

        <div className="cognify-code-status">
          <span></span> AI SYSTEM ONLINE
        </div>
      </nav>

      {/* Main content */}
      <main className="cognify-code-main">
        {/* Hero */}
        <section className="cognify-code-hero">
          <div className="cognify-code-hero-text">
            <div className="cognify-code-eyebrow">
              <span className="eyebrow-line"></span>
              NEXT GENERATION CODING INTELLIGENCE
            </div>

            <h1>
              Your Code.
              <br />
              <span>Our Intelligence.</span>
            </h1>

            <p>
              Understand complex code, discover errors and improve your
              programming skills with your personalized AI coding assistant.
            </p>

            <div className="cognify-code-hero-tags">
              <span>✦ AI Powered</span>
              <span>◈ Context Aware</span>
              <span>⌘ Smart Debugging</span>
            </div>
          </div>

          {/* 3D AI Core */}
          <div className="cognify-code-orb-area">
            <div className="cognify-code-orb-label">
              <span></span> COGNITIVE AI CORE
            </div>

            <div className="cognify-code-orb-scene">
              <div className="cognify-code-orb-ring ring-one"></div>
              <div className="cognify-code-orb-ring ring-two"></div>
              <div className="cognify-code-orb-ring ring-three"></div>

              <div className="cognify-code-orb">
                <div className="cognify-code-orb-inner">
                  <span>✦</span>
                </div>
              </div>

              <div className="orb-dot dot-one"></div>
              <div className="orb-dot dot-two"></div>
              <div className="orb-dot dot-three"></div>
            </div>

            <div className="cognify-code-orb-caption">
              <strong>AI CORE ACTIVE</strong>
              <span>Ready to analyze your code</span>
            </div>
          </div>
        </section>

        {/* Study context */}
        <section className="cognify-code-context">
          <div className="cognify-code-section-heading">
            <div>
              <span className="cognify-code-small-label">
                PERSONALIZED INTELLIGENCE
              </span>
              <h2>Your Learning Context</h2>
            </div>

            <div className="cognify-code-context-live">
              <span></span> CONTEXT CONNECTED
            </div>
          </div>

          <div className="cognify-code-context-grid">
            <div className="cognify-code-context-card">
              <div className="context-icon">◈</div>
              <span>SUBJECT</span>
              <strong>{studyContext.subject}</strong>
            </div>

            <div className="cognify-code-context-card">
              <div className="context-icon">⌘</div>
              <span>TOPIC</span>
              <strong>{studyContext.topic}</strong>
            </div>

            <div className="cognify-code-context-card">
              <div className="context-icon">◉</div>
              <span>LEARNING LEVEL</span>
              <strong>{studyContext.difficulty}</strong>
            </div>

            <div className="cognify-code-context-card goal-card">
              <div className="context-icon">✧</div>
              <span>YOUR GOAL</span>
              <strong>{studyContext.goal}</strong>
            </div>
          </div>
        </section>

        {/* Workspace */}
        <section className="cognify-code-workspace">
          <div className="cognify-code-workspace-heading">
            <div>
              <span className="cognify-code-small-label">
                DEVELOPER WORKSPACE
              </span>
              <h2>Code Intelligence Studio</h2>
            </div>

            <div className="cognify-code-workspace-badge">
              <span></span> READY TO ANALYZE
            </div>
          </div>

          <div className="cognify-code-workspace-grid">
            {/* Editor */}
            <div className="cognify-code-editor-panel">
              <div className="cognify-code-panel-header">
                <div className="cognify-code-window-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <span>CODE EDITOR</span>

                <span className="editor-live">● LIVE</span>
              </div>

              <div className="cognify-code-editor-toolbar">
                <label htmlFor="code-language">PROGRAMMING LANGUAGE</label>

                <select
                  id="code-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="Java">Java</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                </select>
              </div>

              <div className="cognify-code-textarea-wrap">
                <div className="cognify-code-line-number">
                  {Array.from({
                    length: Math.max(12, code.split("\n").length),
                  }).map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`// Welcome to Cognify AI Code Assistant

// Write or paste your ${language} code here.

// Example:
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Cognify AI!");
    }
}`}
                  spellCheck="false"
                />
              </div>

              <div className="cognify-code-editor-footer">
                <span>⌘ {language}</span>
                <span>{code.length} CHARACTERS</span>
              </div>
            </div>

            {/* Error input */}
            <div className="cognify-code-error-panel">
              <div className="cognify-code-panel-header">
                <span className="error-header-icon">⚠</span>
                <span>ERROR DETAILS</span>
                <span className="optional-label">OPTIONAL</span>
              </div>

              <div className="cognify-code-error-content">
                <div className="error-illustration">⌁</div>

                <h3>Facing a coding error?</h3>

                <p>
                  Paste your compiler or runtime error message below. Cognify AI
                  will help identify the problem.
                </p>

                <textarea
                  value={error}
                  onChange={(e) => setError(e.target.value)}
                  placeholder="Paste your error message here...

Example:
error: cannot find symbol
variable x"
                  spellCheck="false"
                />

                <div className="error-hint">
                  ✦ Leave empty if you only want a code explanation.
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="cognify-code-actions">
            <button
              className="cognify-code-btn explain-btn"
              onClick={explainCode}
              disabled={loading}
            >
              <span className="btn-icon">✧</span>
              <span>
                <strong>Explain Code</strong>
                <small>Understand every step</small>
              </span>
              <span className="btn-arrow">↗</span>
            </button>

            <button
              className="cognify-code-btn debug-btn"
              onClick={debugCode}
              disabled={loading}
            >
              <span className="btn-icon">⌘</span>
              <span>
                <strong>Debug Code</strong>
                <small>Find and fix errors</small>
              </span>
              <span className="btn-arrow">↗</span>
            </button>

            <button
              className="cognify-code-btn clear-btn"
              onClick={clearWorkspace}
              disabled={loading}
            >
              <span className="btn-icon">↺</span>
              <span>
                <strong>Clear Workspace</strong>
                <small>Start fresh</small>
              </span>
            </button>
          </div>
        </section>

        {/* AI result */}
        <section className="cognify-code-result-section">
          <div className="cognify-code-section-heading">
            <div>
              <span className="cognify-code-small-label">
                INTELLIGENT ANALYSIS
              </span>
              <h2>AI Analysis Result</h2>
            </div>

            <div className="cognify-code-result-status">
              <span></span> {loading ? "PROCESSING" : "AI READY"}
            </div>
          </div>

          <div className="cognify-code-result-panel">
            <div className="result-orb">✦</div>

            <div className="result-content">
              <div className="result-topline">
                <strong>
                  {loading
                    ? "Cognify AI is thinking..."
                    : mode === "explain"
                      ? "CODE EXPLANATION"
                      : mode === "debug"
                        ? "DEBUGGING ANALYSIS"
                        : "COGNIFY AI RESPONSE"}
                </strong>

                <span>✦ GEMINI INTELLIGENCE</span>
              </div>

              {loading ? (
                <div className="cognify-code-loading">
                  <div className="loading-bars">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                  <p>Analyzing your code and learning context...</p>
                </div>
              ) : result ? (
                <pre className="cognify-code-result-text">{result}</pre>
              ) : (
                <div className="cognify-code-empty-result">
                  <h3>Waiting for your code...</h3>
                  <p>
                    Your AI explanation or debugging solution will appear here.
                  </p>
                  <span>✧ YOUR PERSONALIZED AI CODING MENTOR</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom tip */}
        <div className="cognify-code-tip">
          <div className="tip-icon">✦</div>
          <div>
            <strong>LEARN SMARTER WITH CONTEXT AI</strong>
            <p>
              Cognify AI uses your learning subject, topic, level and goal to
              make explanations easier to understand.
            </p>
          </div>
        </div>

        <footer className="cognify-code-footer">
          <span>COGNIFY AI © 2026</span>
          <span>BUILT FOR INTELLIGENT LEARNING ✦</span>
        </footer>
      </main>
    </div>
  );
}

export default CodeAssistant;

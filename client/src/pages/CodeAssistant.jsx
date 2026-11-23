import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

  // Extract actual AI response
  const formatResponse = (data) => {
    const extractResponse = (value, depth = 0) => {
      if (depth > 5) {
        return "Unable to extract the AI response.";
      }

      if (value === null || value === undefined) {
        return "No response received from MentorIQ AI.";
      }

      if (typeof value === "string") {
        const trimmed = value.trim();

        if (!trimmed) {
          return "The AI returned an empty response.";
        }

        try {
          const parsed = JSON.parse(trimmed);

          if (typeof parsed === "object" && parsed !== null) {
            return extractResponse(parsed, depth + 1);
          }
        } catch {
          // Normal Markdown or text response
        }

        return value;
      }

      if (typeof value === "object") {
        const responseKeys = [
          "response",
          "result",
          "answer",
          "explanation",
          "output",
          "data",
          "message",
        ];

        for (const key of responseKeys) {
          if (value[key] !== undefined && value[key] !== null) {
            return extractResponse(value[key], depth + 1);
          }
        }

        if ("success" in value || "mode" in value || "model" in value) {
          return "MentorIQ AI received a response, but no explanation text was found.";
        }

        return JSON.stringify(value, null, 2);
      }

      return String(value);
    };

    return extractResponse(data);
  };

  // Shared API request handler
  const sendCodeRequest = async (requestMode) => {
    if (!code.trim()) {
      setMode(requestMode);

      setResult(
        requestMode === "debug"
          ? "Please enter your code before debugging."
          : "Please enter your code before requesting an explanation.",
      );

      return;
    }

    setLoading(true);
    setMode(requestMode);
    setResult("");

    try {
      const endpoint =
        requestMode === "debug"
          ? "https://studyai-k7bc.onrender.com/api/code/debug"
          : "https://studyai-k7bc.onrender.com/api/code/explain";

      const body = {
        language,
        code,
        context: studyContext,
      };

      if (requestMode === "debug") {
        body.error = error;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log("MENTORIQ AI API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to process your code.",
        );
      }

      if (data?.success === false) {
        throw new Error(data.message || data.error || "AI analysis failed.");
      }

      const formattedResponse = formatResponse(data);

      console.log("MENTORIQ AI FORMATTED RESPONSE:", formattedResponse);

      setResult(formattedResponse);
    } catch (err) {
      console.error(`${requestMode} code error:`, err);

      setResult(`## Something went wrong

${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  // Explain code
  const explainCode = () => sendCodeRequest("explain");

  // Debug code
  const debugCode = () => sendCodeRequest("debug");

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
          <div className="cognify-code-brand-icon">M</div>

          <div>
            <h2>
              Mentor<span>IQ AI</span>
            </h2>
            <small>YOUR PERSONAL AI LEARNING & CODING MENTOR</small>
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
        {/* Hero section */}
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
              Meet MentorIQ AI, your personal coding mentor. Understand complex
              code, discover errors and improve your programming skills with
              personalized AI guidance.
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
              <span></span> MENTORIQ AI CORE
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

        {/* Personalized Learning Context */}
        <section className="cognify-code-context">
          <div className="cognify-code-section-heading">
            <div>
              <span className="cognify-code-small-label">
                ✦ YOUR PERSONALIZED LEARNING
              </span>

              <h2>Learning Context</h2>

              <p className="context-description">
                MentorIQ AI understands your learning journey and adapts coding
                explanations to your current study goals.
              </p>
            </div>

            <div className="cognify-code-context-live">
              <span></span>
              CONTEXT CONNECTED
            </div>
          </div>

          <div className="cognify-code-context-grid">
            {/* Subject card */}
            <div className="cognify-code-context-card">
              <div className="context-card-top">
                <div className="context-icon">◈</div>
                <span className="context-number">01</span>
              </div>

              <span className="context-card-label">CURRENT SUBJECT</span>

              <strong>{studyContext.subject}</strong>

              <small>Your learning domain</small>

              <div className="context-card-line"></div>
            </div>

            {/* Topic card */}
            <div className="cognify-code-context-card">
              <div className="context-card-top">
                <div className="context-icon">⌘</div>
                <span className="context-number">02</span>
              </div>

              <span className="context-card-label">STUDY TOPIC</span>

              <strong>{studyContext.topic}</strong>

              <small>What you're currently studying</small>

              <div className="context-card-line"></div>
            </div>

            {/* Level card */}
            <div className="cognify-code-context-card">
              <div className="context-card-top">
                <div className="context-icon">◉</div>
                <span className="context-number">03</span>
              </div>

              <span className="context-card-label">YOUR LEVEL</span>

              <strong>{studyContext.difficulty}</strong>

              <small>Personalized explanation level</small>

              <div className="context-card-line"></div>
            </div>

            {/* Goal card */}
            <div className="cognify-code-context-card goal-card">
              <div className="context-card-top">
                <div className="context-icon">✧</div>
                <span className="context-number">04</span>
              </div>

              <span className="context-card-label">LEARNING GOAL</span>

              <strong>{studyContext.goal}</strong>

              <small>Your learning objective</small>

              <div className="context-card-line"></div>
            </div>
          </div>

          {/* Context AI information */}
          <div className="context-ai-note">
            <div className="context-ai-note-icon">✦</div>

            <div>
              <strong>Powered by contextual intelligence</strong>

              <p>
                Your code explanations and debugging suggestions use this study
                context to make learning more relevant and easier to understand.
              </p>
            </div>

            <span className="context-ai-pulse"></span>
          </div>
        </section>

        {/* Code workspace */}
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
            {/* Code editor */}
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
                  placeholder={`// Welcome to MentorIQ AI Code Assistant

// Write or paste your ${language} code here.

// Example:
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello MentorIQ AI!");
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
                  Paste your compiler or runtime error message below. MentorIQ
                  AI will help identify the problem.
                </p>

                <textarea
                  value={error}
                  onChange={(e) => setError(e.target.value)}
                  placeholder={`Paste your error message here...

Example:
SyntaxError: invalid syntax`}
                  spellCheck="false"
                />

                <div className="error-hint">
                  ✦ You can leave this empty. MentorIQ AI can inspect your code
                  for errors.
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

        {/* AI Result */}
        <section className="cognify-code-result-section">
          <div className="cognify-code-section-heading">
            <div>
              <span className="cognify-code-small-label">
                INTELLIGENT ANALYSIS
              </span>

              <h2>AI Analysis Result</h2>
            </div>

            <div className="cognify-code-result-status">
              <span></span>
              {loading ? "PROCESSING" : "AI READY"}
            </div>
          </div>

          <div className="cognify-code-result-panel">
            <div className="result-orb">✦</div>

            <div className="result-content">
              <div className="result-topline">
                <strong>
                  {loading
                    ? "MentorIQ AI is thinking..."
                    : mode === "explain"
                      ? "CODE EXPLANATION"
                      : mode === "debug"
                        ? "DEBUGGING ANALYSIS"
                        : "MENTORIQ AI RESPONSE"}
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
                <div className="cognify-code-result-text">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre({ children }) {
                        return <>{children}</>;
                      },

                      code({ className, children, ...props }) {
                        const isBlock = Boolean(className);

                        return isBlock ? (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className="inline-code" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
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
              MentorIQ AI uses your learning subject, topic, level and goal to
              make explanations easier to understand.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="cognify-code-footer">
          <span>MENTORIQ AI © 2026</span>

          <span>YOUR PERSONAL AI LEARNING & CODING MENTOR ✦</span>
        </footer>
      </main>
    </div>
  );
}

export default CodeAssistant;

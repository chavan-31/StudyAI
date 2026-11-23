import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStudySessions, getProgressAnalytics } from "../services/api";
import "./Dashboard.css";

const slideNames = [
  { label: "Overview", icon: "⌂" },
  { label: "Analytics", icon: "▥" },
  { label: "AI Insights", icon: "✧" },
  { label: "Quick Actions", icon: "⚡" },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeSlide, setActiveSlide] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  const userName = user?.name || "Student";

  // LOAD STUDY SESSIONS
  const loadSessions = async (token) => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudySessions(token);

      if (Array.isArray(data)) {
        setSessions(data);
      } else if (Array.isArray(data?.sessions)) {
        setSessions(data.sessions);
      } else if (Array.isArray(data?.data)) {
        setSessions(data.data);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load study sessions.");
    } finally {
      setLoading(false);
    }
  };

  // LOAD ANALYTICS
  const loadAnalytics = async (token) => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError("");

      const data = await getProgressAnalytics(token);

      if (data?.success && data.analytics) {
        setAnalytics(data.analytics);
      } else {
        setAnalyticsError(data?.message || "Analytics data is unavailable.");
      }
    } catch (err) {
      console.error("Analytics error:", err);
      setAnalyticsError(err.message || "Failed to load analytics.");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // INITIAL DATA LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadSessions(token);
    loadAnalytics(token);
  }, [navigate]);

  // LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // SLIDE NAVIGATION
  const goToSlide = (index) => {
    setActiveSlide(Math.max(0, Math.min(3, index)));
  };

  const nextSlide = () => {
    setActiveSlide((current) => Math.min(3, current + 1));
  };

  const previousSlide = () => {
    setActiveSlide((current) => Math.max(0, current - 1));
  };

  // STUDY STATISTICS
  const totalSessions = sessions.length;

  const currentSession = totalSessions > 0 ? sessions[totalSessions - 1] : null;

  const completedSessions = sessions.filter(
    (session) => session.completed === true || session.status === "completed",
  ).length;

  const sessionProgress =
    totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

  // ANALYTICS VALUES
  const totalTopics = analytics?.totalTopics ?? 0;
  const totalQuestions = analytics?.totalQuestions ?? 0;
  const correctAnswers = analytics?.correctAnswers ?? 0;
  const wrongAnswers = analytics?.wrongAnswers ?? 0;
  const overallAccuracy = Math.min(
    100,
    Math.max(0, Number(analytics?.overallAccuracy ?? 0)),
  );
  const totalTimeSpent = analytics?.totalTimeSpent ?? 0;

  const strongestSubjects = analytics?.strongestSubjects || [];
  const weakTopics = analytics?.weakTopics || [];
  const recommendations = analytics?.recommendations || [];
  const subjects = analytics?.subjects || [];

  const refreshAnalytics = () => {
    const token = localStorage.getItem("token");
    if (token) loadAnalytics(token);
  };

  return (
    <div className="cognify-dashboard">
      {/* HEADER */}
      <header className="cognify-header">
        <div className="cognify-brand">
          <div className="cognify-brand-icon">M</div>
          <div>
            <h2>MentorIQ AI</h2>
            <span>Your Personal AI Learning & Coding Mentor</span>
          </div>
        </div>

        <nav className="cognify-top-nav">
          <button className="top-nav-active" onClick={() => goToSlide(0)}>
            Dashboard
          </button>
          <button onClick={() => navigate("/study")}>Study</button>
          <button onClick={() => navigate("/progress")}>
            Learning Progress
          </button>
          <button onClick={() => navigate("/ai")}>AI Assistant</button>
          <button onClick={() => navigate("/code-assistant")}>
            Code Assistant
          </button>
        </nav>

        <div className="cognify-user">
          <div className="cognify-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="cognify-user-info">
            <strong>{userName}</strong>
            <span>Student</span>
          </div>
          <button className="cognify-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* SLIDE AREA */}
      <main className="cognify-main">
        <div className="cognify-slide-heading">
          <div>
            <span className="cognify-eyebrow">YOUR LEARNING JOURNEY</span>
            <h1>{slideNames[activeSlide].label}</h1>
          </div>
          <div className="cognify-slide-count">
            <span>0{activeSlide + 1}</span> / 04
          </div>
        </div>

        {error && (
          <div className="cognify-error">
            {error}
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                if (token) loadSessions(token);
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* HORIZONTAL SLIDES */}
        <div className="cognify-slide-window">
          <div
            className="cognify-slide-track"
            style={{ transform: `translateX(-${activeSlide * 25}%)` }}
          >
            {/* SLIDE 1: OVERVIEW */}
            <section className="cognify-slide">
              <div className="welcome-panel">
                <div className="welcome-copy">
                  <span className="cognify-eyebrow">
                    YOUR PERSONAL LEARNING SPACE
                  </span>
                  <h2>Welcome back, {userName} 👋</h2>
                  <p>
                    Every step forward counts. Continue learning, improving, and
                    building your future.
                  </p>
                  <button
                    className="cognify-primary-button"
                    onClick={() => navigate("/study")}
                  >
                    + New Study Session
                  </button>
                </div>
                <div className="welcome-art">
                  <div className="welcome-orbit orbit-one" />
                  <div className="welcome-orbit orbit-two" />
                  <div className="welcome-symbol">✦</div>
                  <span>LEARN · GROW · ACHIEVE</span>
                </div>
              </div>

              <div className="cognify-stat-grid">
                <div className="cognify-stat-card">
                  <div className="cognify-stat-icon">▤</div>
                  <span>Study Sessions</span>
                  <strong>{loading ? "..." : totalSessions}</strong>
                  <small>Your learning sessions</small>
                </div>

                <div className="cognify-stat-card">
                  <div className="cognify-stat-icon">◎</div>
                  <span>Current Subject</span>
                  <strong className="stat-subject">
                    {loading ? "..." : currentSession?.subject || "None"}
                  </strong>
                  <small>Currently learning</small>
                </div>

                <div className="cognify-stat-card">
                  <div className="cognify-stat-icon">↗</div>
                  <span>Session Completion</span>
                  <strong>{sessionProgress}%</strong>
                  <small>{completedSessions} completed sessions</small>
                </div>

                <div className="cognify-stat-card">
                  <div className="cognify-stat-icon">✧</div>
                  <span>AI Assistant</span>
                  <strong className="online-status">● Online</strong>
                  <small>Your learning companion</small>
                </div>
              </div>

              <div className="cognify-section-card">
                <div className="cognify-section-heading">
                  <div>
                    <span className="cognify-eyebrow">
                      PICK UP WHERE YOU LEFT OFF
                    </span>
                    <h3>Continue Learning</h3>
                  </div>
                  <span className="cognify-section-icon">📚</span>
                </div>

                {loading ? (
                  <div className="cognify-empty">
                    <div className="cognify-spinner" />
                    <p>Loading your study sessions...</p>
                  </div>
                ) : currentSession ? (
                  <div className="cognify-current-study">
                    <div className="current-study-symbol">📖</div>
                    <div className="current-study-details">
                      <span>{currentSession.subject}</span>
                      <h3>{currentSession.topic}</h3>
                      <p>
                        {currentSession.goal || "Continue learning this topic."}
                      </p>
                      <div className="current-study-meta">
                        <span>{currentSession.difficulty || "Beginner"}</span>
                        {currentSession.duration && (
                          <span>{currentSession.duration} minutes</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="cognify-outline-button"
                      onClick={() => navigate("/ai")}
                    >
                      Continue →
                    </button>
                  </div>
                ) : (
                  <div className="cognify-empty">
                    <span>📚</span>
                    <h3>Start your first study session</h3>
                    <p>Create a session and let MentorIQ AI guide you.</p>
                    <button
                      className="cognify-primary-button"
                      onClick={() => navigate("/study")}
                    >
                      Start Learning →
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* SLIDE 2: ANALYTICS */}
            <section className="cognify-slide">
              {analyticsLoading ? (
                <div className="cognify-section-card cognify-empty">
                  <div className="cognify-spinner" />
                  <h3>Analyzing your performance...</h3>
                </div>
              ) : analyticsError ? (
                <div className="cognify-section-card cognify-empty">
                  <h3>Analytics unavailable</h3>
                  <p>{analyticsError}</p>
                  <button
                    className="cognify-primary-button"
                    onClick={refreshAnalytics}
                  >
                    Retry Analytics
                  </button>
                </div>
              ) : (
                <>
                  <div className="cognify-stat-grid analytics-stats">
                    <div className="cognify-stat-card">
                      <div className="cognify-stat-icon">◎</div>
                      <span>Total Topics</span>
                      <strong>{totalTopics}</strong>
                      <small>Topics explored</small>
                    </div>
                    <div className="cognify-stat-card">
                      <div className="cognify-stat-icon">▤</div>
                      <span>Questions Attempted</span>
                      <strong>{totalQuestions}</strong>
                      <small>Total quiz questions</small>
                    </div>
                    <div className="cognify-stat-card">
                      <div className="cognify-stat-icon">✓</div>
                      <span>Correct Answers</span>
                      <strong>{correctAnswers}</strong>
                      <small>Correct responses</small>
                    </div>
                    <div className="cognify-stat-card">
                      <div className="cognify-stat-icon">×</div>
                      <span>Wrong Answers</span>
                      <strong>{wrongAnswers}</strong>
                      <small>Keep practicing</small>
                    </div>
                  </div>

                  <div className="analytics-layout">
                    <div className="cognify-section-card accuracy-card">
                      <span className="cognify-eyebrow">
                        OVERALL PERFORMANCE
                      </span>
                      <h3>Your Quiz Accuracy</h3>
                      <div className="accuracy-visual">
                        <div
                          className="accuracy-ring"
                          style={{
                            "--accuracy": `${overallAccuracy * 3.6}deg`,
                          }}
                        >
                          <div className="accuracy-ring-inner">
                            <strong>{overallAccuracy}%</strong>
                            <span>Accuracy</span>
                          </div>
                        </div>
                      </div>
                      <p>
                        Your overall quiz accuracy based on recorded learning
                        progress.
                      </p>
                    </div>

                    <div className="cognify-section-card">
                      <span className="cognify-eyebrow">LEARNING ACTIVITY</span>
                      <h3>Performance Summary</h3>

                      <div className="metric-row">
                        <span>Correct answers</span>
                        <strong>{correctAnswers}</strong>
                      </div>
                      <div className="metric-track">
                        <div
                          className="metric-fill metric-correct"
                          style={{
                            width: `${
                              totalQuestions
                                ? (correctAnswers / totalQuestions) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      <div className="metric-row">
                        <span>Wrong answers</span>
                        <strong>{wrongAnswers}</strong>
                      </div>
                      <div className="metric-track">
                        <div
                          className="metric-fill metric-wrong"
                          style={{
                            width: `${
                              totalQuestions
                                ? (wrongAnswers / totalQuestions) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      <div className="time-summary">
                        <span>⏱ Total Recorded Time</span>
                        <strong>{totalTimeSpent}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="cognify-section-card">
                    <div className="cognify-section-heading">
                      <div>
                        <span className="cognify-eyebrow">
                          SUBJECT-WISE RESULTS
                        </span>
                        <h3>Performance by Subject</h3>
                      </div>
                    </div>

                    {subjects.length > 0 ? (
                      <div className="subject-performance-list">
                        {subjects.map((item, index) => (
                          <div
                            className="subject-performance"
                            key={`${item.subject}-${index}`}
                          >
                            <div className="subject-performance-top">
                              <strong>{item.subject}</strong>
                              <span>{item.accuracy}%</span>
                            </div>
                            <div className="metric-track">
                              <div
                                className="metric-fill"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(0, Number(item.accuracy) || 0),
                                  )}%`,
                                }}
                              />
                            </div>
                            <small>
                              {item.correctAnswers} correct out of{" "}
                              {item.questionsAttempted} questions
                            </small>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="cognify-empty">
                        <p>No subject results available yet.</p>
                        <button
                          className="cognify-outline-button"
                          onClick={() => navigate("/ai")}
                        >
                          Start Practicing →
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>

            {/* SLIDE 3: AI INSIGHTS */}
            <section className="cognify-slide">
              {analyticsLoading ? (
                <div className="cognify-section-card cognify-empty">
                  <div className="cognify-spinner" />
                  <p>Preparing your learning insights...</p>
                </div>
              ) : analyticsError ? (
                <div className="cognify-section-card cognify-empty">
                  <h3>Insights unavailable</h3>
                  <p>{analyticsError}</p>
                  <button
                    className="cognify-primary-button"
                    onClick={refreshAnalytics}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="insights-banner">
                    <div className="insights-glow">✧</div>
                    <div>
                      <span className="cognify-eyebrow">
                        YOUR AI LEARNING COMPANION
                      </span>
                      <h2>Insights that help you improve.</h2>
                      <p>
                        Review your strengths, identify topics to improve, and
                        keep moving forward.
                      </p>
                    </div>
                  </div>

                  <div className="insights-grid">
                    <div className="cognify-section-card">
                      <div className="cognify-section-heading">
                        <div>
                          <span className="cognify-eyebrow">
                            YOUR BEST PERFORMANCE
                          </span>
                          <h3>Strongest Subjects 🏆</h3>
                        </div>
                      </div>

                      {strongestSubjects.length > 0 ? (
                        strongestSubjects.map((item, index) => (
                          <div
                            className="insight-item"
                            key={`${item.subject}-${index}`}
                          >
                            <div className="insight-item-icon">🏆</div>
                            <div>
                              <strong>{item.subject}</strong>
                              <p>
                                {item.correctAnswers}/{item.questionsAttempted}{" "}
                                correct answers
                              </p>
                            </div>
                            <span className="insight-score">
                              {item.accuracy}%
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="cognify-empty">
                          <p>
                            Practice quizzes to discover your strongest
                            subjects.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="cognify-section-card">
                      <div className="cognify-section-heading">
                        <div>
                          <span className="cognify-eyebrow">
                            AREAS TO IMPROVE
                          </span>
                          <h3>Weak Topics 🎯</h3>
                        </div>
                      </div>

                      {weakTopics.length > 0 ? (
                        weakTopics.map((item, index) => (
                          <div
                            className="insight-item"
                            key={`${item.subject}-${item.topic}-${index}`}
                          >
                            <div className="insight-item-icon">◎</div>
                            <div>
                              <strong>{item.topic}</strong>
                              <p>
                                {item.subject} · {item.difficulty || "Practice"}
                              </p>
                            </div>
                            <span className="insight-score">
                              {item.accuracy}%
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="cognify-empty">
                          <p>
                            No weak topics detected yet. Keep practicing to
                            build your analytics.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="cognify-section-card recommendation-card">
                    <div className="cognify-section-heading">
                      <div>
                        <span className="cognify-eyebrow">
                          PERSONALIZED GUIDANCE
                        </span>
                        <h3>AI Recommendations 💡</h3>
                      </div>
                      <span className="recommendation-icon">✧</span>
                    </div>

                    {recommendations.length > 0 ? (
                      recommendations.map((recommendation, index) => (
                        <div className="recommendation-item" key={index}>
                          <span>✦</span>
                          <p>{recommendation}</p>
                        </div>
                      ))
                    ) : (
                      <div className="recommendation-item">
                        <span>✦</span>
                        <p>
                          Start practicing to receive personalized
                          recommendations based on your learning progress.
                        </p>
                      </div>
                    )}

                    <button
                      className="cognify-primary-button"
                      onClick={() => navigate("/ai")}
                    >
                      Ask AI for Guidance →
                    </button>
                  </div>
                </>
              )}
            </section>

            {/* SLIDE 4: QUICK ACTIONS */}
            <section className="cognify-slide">
              <div className="actions-banner">
                <span className="cognify-eyebrow">MAKE YOUR NEXT MOVE</span>
                <h2>What would you like to do?</h2>
                <p>Choose a tool and continue your learning journey.</p>
              </div>

              <div className="cognify-actions-grid">
                <button
                  className="cognify-action-card"
                  onClick={() => navigate("/ai")}
                >
                  <span className="action-card-icon">✧</span>
                  <span className="action-card-tag">AI LEARNING</span>
                  <h3>Ask AI</h3>
                  <p>Get personalized explanations for your current topic.</p>
                  <span className="action-card-link">Open Assistant →</span>
                </button>

                <button
                  className="cognify-action-card"
                  onClick={() => navigate("/study")}
                >
                  <span className="action-card-icon">▤</span>
                  <span className="action-card-tag">YOUR LEARNING PLAN</span>
                  <h3>New Study</h3>
                  <p>Create a new learning session with your goals.</p>
                  <span className="action-card-link">Create Session →</span>
                </button>

                <button
                  className="cognify-action-card"
                  onClick={() => navigate("/ai")}
                >
                  <span className="action-card-icon">◎</span>
                  <span className="action-card-tag">TEST YOUR KNOWLEDGE</span>
                  <h3>Practice</h3>
                  <p>Test your knowledge with learning questions.</p>
                  <span className="action-card-link">Start Practice →</span>
                </button>

                <button
                  className="cognify-action-card"
                  onClick={() => navigate("/code-assistant")}
                >
                  <span className="action-card-icon">{"</>"}</span>
                  <span className="action-card-tag">CODING SUPPORT</span>
                  <h3>Code Assistant</h3>
                  <p>Explain and debug your code with AI assistance.</p>
                  <span className="action-card-link">
                    Open Code Assistant →
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* BOTTOM SLIDE NAVIGATION */}
        <div className="cognify-bottom-navigation">
          <button
            className="slide-arrow"
            onClick={previousSlide}
            disabled={activeSlide === 0}
            aria-label="Previous slide"
          >
            ←
          </button>

          <div className="slide-navigation-items">
            {slideNames.map((slide, index) => (
              <button
                key={slide.label}
                className={`slide-nav-item ${
                  activeSlide === index ? "selected" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to ${slide.label}`}
                aria-current={activeSlide === index ? "step" : undefined}
              >
                <span className="slide-nav-icon">{slide.icon}</span>
                <span className="slide-nav-label">{slide.label}</span>
              </button>
            ))}
          </div>

          <button
            className="slide-arrow"
            onClick={nextSlide}
            disabled={activeSlide === 3}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        <div className="cognify-slide-dots">
          {slideNames.map((slide, index) => (
            <button
              key={slide.label}
              className={activeSlide === index ? "dot-active" : ""}
              onClick={() => goToSlide(index)}
              aria-label={`Show ${slide.label}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

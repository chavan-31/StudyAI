import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProgressAnalytics } from "../services/api";
import "./Progress.css";

function Progress() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedView = searchParams.get("view") || "";
  const selectedSubject = searchParams.get("subject") || "";
  const selectedTopic = searchParams.get("topic") || "";

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const data = await getProgressAnalytics(token);

      if (data.success && data.analytics) {
        setAnalytics(data.analytics);
      } else {
        setError(data.message || "Progress data unavailable");
      }
    } catch (err) {
      setError(err.message || "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    loadProgress();
  }, []);

  useEffect(() => {
    if (!loading && selectedView) {
      document.getElementById(selectedView)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [loading, selectedView]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openDetails = (view, subject = "", topic = "") => {
    const params = new URLSearchParams();
    params.set("view", view);

    if (subject) params.set("subject", subject);
    if (topic) params.set("topic", topic);

    setSearchParams(params);
  };

  const isSelected = (subject, topic = "") =>
    selectedSubject.toLowerCase() === String(subject || "").toLowerCase() &&
    selectedTopic.toLowerCase() === String(topic || "").toLowerCase();

  const totalTopics = analytics?.totalTopics ?? 0;
  const totalQuestions = analytics?.totalQuestions ?? 0;
  const correctAnswers = analytics?.correctAnswers ?? 0;
  const wrongAnswers = analytics?.wrongAnswers ?? 0;

  const accuracy = Math.min(
    100,
    Math.max(0, Number(analytics?.overallAccuracy ?? 0)),
  );

  const timeSpent = analytics?.totalTimeSpent ?? 0;

  const strongestSubjects = analytics?.strongestSubjects || [];
  const weakTopics = analytics?.weakTopics || [];
  const recommendations = analytics?.recommendations || [];
  const subjects = analytics?.subjects || [];

  const stats = [
    {
      label: "Total Topics",
      value: totalTopics,
      icon: "📚",
      color: "cyan",
      view: "subjects",
    },
    {
      label: "Questions Attempted",
      value: totalQuestions,
      icon: "📝",
      color: "violet",
      view: "questions",
    },
    {
      label: "Correct Answers",
      value: correctAnswers,
      icon: "✅",
      color: "green",
      view: "questions",
    },
    {
      label: "Wrong Answers",
      value: wrongAnswers,
      icon: "❌",
      color: "pink",
      view: "questions",
    },
    {
      label: "Time Spent",
      value: timeSpent,
      icon: "⏱️",
      color: "blue",
      view: "questions",
    },
  ];

  return (
    <div className="progress-page">
      <div className="progress-ambient ambient-one" />
      <div className="progress-ambient ambient-two" />
      <div className="progress-ambient ambient-three" />

      {/* HEADER */}
      <header className="progress-header">
        <div className="progress-brand">
          <div className="progress-logo">M</div>
          <div>
            <h2>MentorIQ AI</h2>
            <span>Your Personal AI Learning & Coding Mentor</span>
          </div>
        </div>

        <nav className="progress-nav">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/study")}>Study</button>
          <button className="active">Learning Progress</button>
          <button onClick={() => navigate("/ai")}>AI Assistant</button>
        </nav>

        <div className="progress-user">
          <span>👋 {user?.name || "Student"}</span>
          <button onClick={handleLogout}>Logout ↗</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="progress-main">
        <div className="progress-heading">
          <div>
            <p className="progress-eyebrow">✦ YOUR LEARNING JOURNEY</p>

            <h1>
              Learning <span>Progress</span> 📊
            </h1>

            <p className="progress-subtitle">
              Track your performance, celebrate achievements and improve your
              skills.
            </p>
          </div>

          <button
            className="progress-refresh"
            onClick={loadProgress}
            disabled={loading}
          >
            <span className={loading ? "refresh-spinning" : ""}>↻</span>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="progress-message">
            <div className="progress-loader" />
            <h3>Analyzing your learning journey...</h3>
            <p>Preparing your personalized analytics</p>
          </div>
        ) : error ? (
          <div className="progress-error">
            <h3>Unable to load progress</h3>
            <p>{error}</p>
            <button className="progress-refresh" onClick={loadProgress}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* STATISTICS */}
            <section className="progress-stats" id="overview">
              {stats.map((stat, index) => (
                <div
                  className={`progress-stat stat-${stat.color}`}
                  key={stat.label}
                  onClick={() => openDetails(stat.view)}
                  title={`View ${stat.label}`}
                >
                  <div className="stat-top">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className="stat-index">0{index + 1}</span>
                  </div>

                  <strong className="stat-number">{stat.value}</strong>
                  <span className="stat-label">{stat.label}</span>
                  <div className="stat-bottom-line" />
                </div>
              ))}
            </section>

            <div className="progress-content-grid">
              {/* OVERALL ACCURACY */}
              <section
                className={`progress-panel accuracy-panel ${
                  selectedView === "accuracy" ? "panel-selected" : ""
                }`}
                id="accuracy"
              >
                <div className="panel-heading">
                  <div>
                    <span className="panel-kicker">PERFORMANCE OVERVIEW</span>
                    <h2>Overall Accuracy</h2>
                  </div>

                  <span className="panel-icon">◉</span>
                </div>

                <div className="accuracy-layout">
                  <div
                    className="accuracy-ring"
                    style={{ "--accuracy": `${accuracy}%` }}
                  >
                    <div className="accuracy-ring-inner">
                      <strong>{accuracy}%</strong>
                      <span>Accuracy</span>
                    </div>
                  </div>

                  <div className="accuracy-insight">
                    <h3>
                      {accuracy >= 80
                        ? "Excellent work! 🚀"
                        : accuracy >= 60
                          ? "Good progress! ✨"
                          : "Keep improving! 💪"}
                    </h3>

                    <p>
                      Your overall quiz accuracy based on your recorded answers.
                    </p>

                    <div className="accuracy-legend">
                      <span>
                        <i className="legend-correct" /> Correct:{" "}
                        {correctAnswers}
                      </span>

                      <span>
                        <i className="legend-wrong" /> Wrong: {wrongAnswers}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* STRONGEST SUBJECTS */}
              <section
                className={`progress-panel strongest-panel ${
                  selectedView === "strongest" ? "panel-selected" : ""
                }`}
                id="strongest"
              >
                <div className="panel-heading">
                  <div>
                    <span className="panel-kicker">YOUR TOP PERFORMANCE</span>
                    <h2>Strongest Subjects 🏆</h2>
                  </div>
                </div>

                {strongestSubjects.length ? (
                  strongestSubjects.map((item, index) => (
                    <div
                      className={`insight-item ${
                        isSelected(item.subject) ? "item-selected" : ""
                      }`}
                      key={index}
                      onClick={() => openDetails("subjects", item.subject)}
                    >
                      <div className="insight-item-top">
                        <strong>{item.subject}</strong>
                        <span>{item.accuracy}%</span>
                      </div>

                      <div className="mini-track">
                        <div
                          className="mini-fill strongest-fill"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, Number(item.accuracy) || 0),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">
                    Attempt quizzes to discover your strongest subjects.
                  </p>
                )}
              </section>

              {/* WEAK TOPICS */}
              <section
                className={`progress-panel weak-panel ${
                  selectedView === "weak-topics" ? "panel-selected" : ""
                }`}
                id="weak-topics"
              >
                <div className="panel-heading">
                  <div>
                    <span className="panel-kicker">AREAS TO IMPROVE</span>
                    <h2>Weak Topics 🎯</h2>
                  </div>
                </div>

                {weakTopics.length ? (
                  weakTopics.map((item, index) => (
                    <div
                      className={`weak-item ${
                        isSelected(item.subject, item.topic)
                          ? "item-selected"
                          : ""
                      }`}
                      key={index}
                      onClick={() =>
                        openDetails("weak-topics", item.subject, item.topic)
                      }
                    >
                      <div>
                        <strong>
                          {item.subject} · {item.topic}
                        </strong>
                        <p>Difficulty: {item.difficulty}</p>
                      </div>

                      <span>{item.accuracy}%</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">
                    No weak topics detected yet. Keep practicing!
                  </p>
                )}
              </section>

              {/* SUBJECT BREAKDOWN */}
              <section
                className={`progress-panel subjects-panel ${
                  selectedView === "subjects" ? "panel-selected" : ""
                }`}
                id="subjects"
              >
                <div className="panel-heading">
                  <div>
                    <span className="panel-kicker">SUBJECT BREAKDOWN</span>
                    <h2>Subject Performance 📈</h2>
                  </div>
                </div>

                {subjects.length ? (
                  subjects.map((item, index) => (
                    <div
                      className={`subject-row ${
                        isSelected(item.subject) ? "item-selected" : ""
                      }`}
                      key={index}
                      onClick={() => openDetails("subjects", item.subject)}
                    >
                      <div className="subject-row-heading">
                        <strong>{item.subject}</strong>
                        <span>{item.accuracy}%</span>
                      </div>

                      <div className="subject-track">
                        <div
                          className="subject-fill"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, Number(item.accuracy) || 0),
                            )}%`,
                          }}
                        />
                      </div>

                      <p>
                        {item.correctAnswers} correct out of{" "}
                        {item.questionsAttempted}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">
                    No subject performance available yet.
                  </p>
                )}
              </section>

              {/* AI RECOMMENDATIONS */}
              <section
                className={`progress-panel recommendations-panel ${
                  selectedView === "recommendations" ? "panel-selected" : ""
                }`}
                id="recommendations"
              >
                <div className="panel-heading">
                  <div>
                    <span className="panel-kicker">POWERED BY AI</span>
                    <h2>AI Recommendations 🤖</h2>
                  </div>

                  <span className="ai-glow-icon">✦</span>
                </div>

                {recommendations.length ? (
                  recommendations.map((item, index) => (
                    <div className="recommendation" key={index}>
                      <span>💡</span>
                      <p>{item}</p>
                    </div>
                  ))
                ) : (
                  <div className="recommendation">
                    <span>💡</span>
                    <p>
                      Practice more quizzes to receive personalized learning
                      recommendations.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* FOOTER */}
            <footer className="progress-footer">
              <span>✦ MentorIQ AI</span>
              <span>Your Personal AI Learning & Coding Mentor.</span>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

export default Progress;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProgressAnalytics } from "../services/api";
import "./Progress.css";

function Progress() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalTopics = analytics?.totalTopics ?? 0;
  const totalQuestions = analytics?.totalQuestions ?? 0;
  const correctAnswers = analytics?.correctAnswers ?? 0;
  const wrongAnswers = analytics?.wrongAnswers ?? 0;
  const accuracy = analytics?.overallAccuracy ?? 0;
  const timeSpent = analytics?.totalTimeSpent ?? 0;

  const strongestSubjects = analytics?.strongestSubjects || [];
  const weakTopics = analytics?.weakTopics || [];
  const recommendations = analytics?.recommendations || [];
  const subjects = analytics?.subjects || [];

  return (
    <div className="progress-page">
      <header className="progress-header">
        <div className="progress-brand">
          <div className="progress-logo">AI</div>
          <div>
            <h2>StudyAI</h2>
            <span>Learning Analytics</span>
          </div>
        </div>

        <nav className="progress-nav">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/study")}>Study</button>
          <button className="active">Learning Progress</button>
          <button onClick={() => navigate("/ai")}>AI Assistant</button>
        </nav>

        <div className="progress-user">
          <span>{user?.name || "Student"}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="progress-main">
        <div className="progress-heading">
          <div>
            <p>YOUR LEARNING JOURNEY</p>
            <h1>Learning Progress 📊</h1>
            <span>
              Track your performance and identify areas for improvement.
            </span>
          </div>

          <button onClick={loadProgress}>↻ Refresh</button>
        </div>

        {loading ? (
          <div className="progress-message">
            Loading your learning progress...
          </div>
        ) : error ? (
          <div className="progress-error">
            {error}
            <button onClick={loadProgress}>Retry</button>
          </div>
        ) : (
          <>
            <section className="progress-stats">
              <div className="progress-stat">
                <span>📚 Total Topics</span>
                <strong>{totalTopics}</strong>
              </div>
              <div className="progress-stat">
                <span>📝 Questions Attempted</span>
                <strong>{totalQuestions}</strong>
              </div>
              <div className="progress-stat">
                <span>✅ Correct Answers</span>
                <strong>{correctAnswers}</strong>
              </div>
              <div className="progress-stat">
                <span>❌ Wrong Answers</span>
                <strong>{wrongAnswers}</strong>
              </div>
              <div className="progress-stat">
                <span>⏱️ Time Spent</span>
                <strong>{timeSpent}</strong>
              </div>
            </section>

            <section className="progress-panel">
              <h2>Overall Accuracy</h2>
              <strong className="accuracy-value">{accuracy}%</strong>
              <div className="accuracy-track">
                <div
                  className="accuracy-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, accuracy))}%`,
                  }}
                />
              </div>
            </section>

            <section className="progress-panel">
              <h2>Strongest Subjects 🏆</h2>
              {strongestSubjects.length ? (
                strongestSubjects.map((item, index) => (
                  <div className="progress-item" key={index}>
                    <strong>{item.subject}</strong>
                    <span>{item.accuracy}% accuracy</span>
                  </div>
                ))
              ) : (
                <p>
                  No subject results yet. Attempt quizzes to see your strengths.
                </p>
              )}
            </section>

            <section className="progress-panel">
              <h2>Weak Topics 🎯</h2>
              {weakTopics.length ? (
                weakTopics.map((item, index) => (
                  <div className="progress-item" key={index}>
                    <div>
                      <strong>
                        {item.subject} - {item.topic}
                      </strong>
                      <p>Difficulty: {item.difficulty}</p>
                    </div>
                    <span>{item.accuracy}% accuracy</span>
                  </div>
                ))
              ) : (
                <p>No weak topics detected yet.</p>
              )}
            </section>

            <section className="progress-panel">
              <h2>Subject Performance</h2>
              {subjects.length ? (
                subjects.map((item, index) => (
                  <div className="progress-item" key={index}>
                    <div>
                      <strong>{item.subject}</strong>
                      <p>
                        {item.correctAnswers} correct out of{" "}
                        {item.questionsAttempted}
                      </p>
                    </div>
                    <span>{item.accuracy}%</span>
                  </div>
                ))
              ) : (
                <p>No subject performance available yet.</p>
              )}
            </section>

            <section className="progress-panel">
              <h2>AI Recommendations 🤖</h2>
              {recommendations.length ? (
                recommendations.map((item, index) => (
                  <p className="recommendation" key={index}>
                    💡 {item}
                  </p>
                ))
              ) : (
                <p>Practice more quizzes to receive recommendations.</p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Progress;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudySessions, createStudySession } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Study.css";

function Study() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "Java",
    topic: "Arrays",
    goal: "Understand the topic and practice questions",
    difficulty: "Beginner",
  });

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSessions = async () => {
    if (!token) {
      setError("Please login to view study sessions.");
      setFetching(false);
      return;
    }

    try {
      setFetching(true);
      setError("");

      const data = await getStudySessions(token);

      setSessions(
        Array.isArray(data) ? data : data.sessions || data.studySessions || [],
      );
    } catch (err) {
      console.error("Fetch sessions error:", err);
      setError(err.message || "Unable to load sessions.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createStudySession(form, token);

      setSuccess("Study session created successfully!");

      await fetchSessions();
    } catch (err) {
      console.error("Create session error:", err);
      setError(err.message || "Failed to create session.");
    } finally {
      setLoading(false);
    }
  };

  const getSubjectIcon = (subject = "") => {
    const value = subject.toLowerCase();

    if (value.includes("java")) return "☕";
    if (value.includes("python")) return "🐍";
    if (value.includes("javascript")) return "⚡";
    if (value.includes("english")) return "📖";
    if (value.includes("math")) return "📐";
    if (value.includes("data")) return "📊";

    return "📚";
  };

  const openSession = (sessionId) => {
    navigate(`/study/${sessionId}`);
  };

  return (
    <div className="study-page">
      <div className="study-orb orb-one"></div>
      <div className="study-orb orb-two"></div>
      <div className="study-orb orb-three"></div>

      <div className="study-container">
        {/* HEADER */}
        <header className="study-header">
          <div>
            <span className="study-eyebrow">YOUR PERSONAL LEARNING SPACE</span>

            <h1>
              Study <span>Planner.</span>
            </h1>

            <p>Plan smarter, learn faster, and track your learning journey.</p>
          </div>

          <div className="study-header-icon">🎓</div>
        </header>

        {/* STATS */}
        <div className="study-stats">
          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <div>
              <h3>{sessions.length}</h3>
              <p>Total Sessions</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🚀</span>
            <div>
              <h3>{sessions.filter((s) => s.status === "active").length}</h3>
              <p>Active Sessions</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div>
              <h3>{sessions.filter((s) => s.status === "completed").length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* CREATE SESSION */}
        <section className="create-section">
          <div className="section-heading">
            <div>
              <span className="section-label">GET STARTED</span>
              <h2>Create Study Session</h2>
              <p>Set your learning target and start making progress.</p>
            </div>

            <div className="heading-icon">✨</div>
          </div>

          <form onSubmit={handleSubmit} className="study-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Example: Java"
                  required
                />
              </div>

              <div className="form-group">
                <label>Topic</label>
                <input
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="Example: Arrays"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Learning Goal</label>
              <textarea
                name="goal"
                value={form.goal}
                onChange={handleChange}
                rows="3"
                placeholder="What do you want to achieve?"
              />
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>

              <div className="difficulty-options">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`difficulty-btn ${
                      form.difficulty === level ? "selected" : ""
                    }`}
                    onClick={() => setForm({ ...form, difficulty: level })}
                  >
                    {level === "Beginner" && "🌱"}
                    {level === "Intermediate" && "🔥"}
                    {level === "Advanced" && "🚀"}
                    <span>{level}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="create-btn"
            >
              {loading ? "Creating Session..." : "＋ Create Study Session"}
            </button>
          </form>

          {error && <div className="message error-message">{error}</div>}
          {success && <div className="message success-message">{success}</div>}
        </section>

        {/* SESSION LIST */}
        <section className="sessions-section">
          <div className="section-heading sessions-heading">
            <div>
              <span className="section-label">YOUR PROGRESS</span>
              <h2>My Study Sessions</h2>
              <p>All your learning sessions in one place.</p>
            </div>

            <span className="session-count">{sessions.length} Sessions</span>
          </div>

          {fetching ? (
            <div className="empty-state">
              <div className="loading-spinner"></div>
              <p>Loading your study sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No sessions yet</h3>
              <p>Create your first study session to get started.</p>
            </div>
          ) : (
            <div className="sessions-grid">
              {sessions.map((session) => {
                const progress = Math.min(
                  Math.max(Number(session.progress) || 0, 0),
                  100,
                );

                return (
                  <article
                    className="session-card"
                    key={session._id}
                    onClick={() => openSession(session._id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openSession(session._id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${session.subject} ${session.topic} study session`}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-top">
                      <div className="subject-icon">
                        {getSubjectIcon(session.subject)}
                      </div>

                      <span
                        className={`difficulty-tag ${(
                          session.difficulty || "Beginner"
                        ).toLowerCase()}`}
                      >
                        {session.difficulty || "Beginner"}
                      </span>
                    </div>

                    <span className="subject-name">{session.subject}</span>

                    <h3>{session.topic}</h3>

                    <p className="session-goal">
                      {session.goal || "No learning goal added"}
                    </p>

                    <div className="progress-info">
                      <span>Learning Progress</span>
                      <strong>{progress}%</strong>
                    </div>

                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginTop: "14px",
                        fontSize: "12px",
                      }}
                    >
                      <span>
                        {session.lessonCompleted ? "✓ Lesson" : "○ Lesson"}
                      </span>

                      <span>{session.quizCompleted ? "✓ Quiz" : "○ Quiz"}</span>
                    </div>

                    <div className="card-footer">
                      <span
                        className={`status ${
                          session.status === "completed"
                            ? "completed"
                            : "active"
                        }`}
                      >
                        <span className="status-dot"></span>
                        {session.status || "active"}
                      </span>

                      <span className="session-arrow">Continue Learning →</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="study-footer">
          <span>✦</span> Small steps every day lead to big achievements.
        </footer>
      </div>
    </div>
  );
}

export default Study;

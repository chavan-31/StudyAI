
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getStudySession,
  askAI,
  markLessonComplete,
} from "../services/api";
import "./StudySessionDetail.css";

function StudySessionDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [session, setSession] = useState(null);
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH STUDY SESSION
  // ==========================================

  useEffect(() => {
    const fetchSession = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getStudySession(sessionId, token);
        setSession(data.session || null);
      } catch (err) {
        setError(err.message || "Failed to load study session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, token, navigate]);

  // ==========================================
  // GENERATE AI LESSON
  // ==========================================

  const generateLesson = async () => {
    if (!session || generating) return;

    setGenerating(true);
    setError("");
    setLesson("");

    const prompt = `
You are MentorIQ AI, a friendly and expert computer science tutor.

Create a complete beginner-friendly lesson for the following study session.

Subject: ${session.subject}
Topic: ${session.topic}
Difficulty: ${session.difficulty}
Learning goal: ${session.goal || "Understand the topic clearly"}

Follow this structure:

# Lesson: ${session.topic}

## 1. Introduction
Explain what the topic means in simple language.

## 2. Important Concepts
Explain the important concepts step by step.

## 3. Practical Example
Give a simple, correct example relevant to the subject.
If the subject is Java, use Java code.

## 4. Step-by-Step Explanation
Explain the example line by line.

## 5. Real-World Applications
Explain where this topic is used.

## 6. Key Points to Remember
List the most important points.

## 7. Quick Revision
Give a short revision summary.

Use simple English, clear headings, and beginner-friendly explanations.
Do not generate quiz questions.
`;

    try {
      const data = await askAI(prompt, token);

      const generatedLesson =
        data?.answer || data?.response || data?.message;

      if (!generatedLesson) {
        throw new Error("AI did not return lesson content.");
      }

      setLesson(generatedLesson);
    } catch (err) {
      setError(err.message || "Failed to generate lesson.");
    } finally {
      setGenerating(false);
    }
  };

  // ==========================================
  // MARK LESSON COMPLETE
  // ==========================================

  const handleCompleteLesson = async () => {
    if (!session || completing) return;

    if (!lesson.trim()) {
      setError("Generate and read the lesson before completing it.");
      return;
    }

    setCompleting(true);
    setError("");

    try {
      const data = await markLessonComplete(sessionId, token);
      setSession(data.session);
    } catch (err) {
      setError(err.message || "Failed to complete lesson.");
    } finally {
      setCompleting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-setup-card">
          <h2>Loading your study session...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR / NOT FOUND
  // ==========================================

  if (!session) {
    return (
      <div className="quiz-page">
        <div className="quiz-setup-card">
          <h1>Study Session Not Found</h1>
          <p>{error || "Unable to find this study session."}</p>
          <button
            className="generate-quiz-button"
            onClick={() => navigate("/study")}
          >
            Back to Study
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SESSION DETAILS
  // ==========================================

  const progress = session.progress || 0;
  const lessonCompleted = session.lessonCompleted === true;
  const quizCompleted = session.quizCompleted === true;
  const sessionCompleted = session.status === "completed";

  return (
    <div className="quiz-page">
      <div
        className="quiz-question-card"
        style={{
          width: "min(900px, 94%)",
          maxWidth: "900px",
          margin: "40px auto",
        }}
      >
        <button
          className="quiz-back-button"
          onClick={() => navigate("/study")}
        >
          ← Back to Study Planner
        </button>

        <p className="quiz-label">
          MENTORIQ AI • PERSONALIZED LEARNING
        </p>

        <h1>{session.topic}</h1>

        <p className="quiz-description">
          Study your lesson, understand the concepts, and complete your quiz.
        </p>

        <div className="result-details">
          <div>
            <span>Subject</span>
            <strong>{session.subject}</strong>
          </div>

          <div>
            <span>Difficulty</span>
            <strong>{session.difficulty}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{sessionCompleted ? "Completed" : "Active"}</strong>
          </div>
        </div>

        {/* PROGRESS */}

        <div style={{ margin: "25px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <strong>Study Progress</strong>
            <strong>{progress}%</strong>
          </div>

          <div
            style={{
              height: "10px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #22d3ee, #8b5cf6)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* COMPLETION CHECKLIST */}

        <div className="result-details">
          <div>
            <span>Lesson</span>
            <strong>
              {lessonCompleted ? "✓ Completed" : "Not completed"}
            </strong>
          </div>

          <div>
            <span>Quiz</span>
            <strong>
              {quizCompleted ? "✓ Completed" : "Not completed"}
            </strong>
          </div>
        </div>

        {/* LESSON */}

        <div style={{ marginTop: "30px" }}>
          <h2>📘 Your Personalized AI Lesson</h2>

          <p className="quiz-description">
            MentorIQ AI will prepare an explanation based on your selected topic
            and difficulty.
          </p>

          {!lesson && (
            <button
              className="generate-quiz-button"
              onClick={generateLesson}
              disabled={generating || lessonCompleted}
            >
              {generating
                ? "Generating Your Lesson..."
                : "✦ Generate AI Lesson"}
            </button>
          )}

          {generating && (
            <p style={{ marginTop: "15px" }}>
              MentorIQ AI is preparing your personalized lesson. Please wait...
            </p>
          )}

          {lesson && (
            <div
              style={{
                marginTop: "20px",
                padding: "22px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                whiteSpace: "pre-wrap",
                lineHeight: "1.8",
                overflowWrap: "anywhere",
              }}
            >
              {lesson}
            </div>
          )}
        </div>

        {error && (
          <div className="quiz-error" style={{ marginTop: "20px" }}>
            ⚠ {error}
          </div>
        )}

        {/* LESSON COMPLETION */}

        <div style={{ marginTop: "25px" }}>
          <button
            className="submit-answer-button"
            onClick={handleCompleteLesson}
            disabled={
              completing ||
              lessonCompleted ||
              !lesson.trim() ||
              sessionCompleted
            }
          >
            {lessonCompleted
              ? "✓ Lesson Completed"
              : completing
                ? "Saving Completion..."
                : "Mark Lesson as Completed"}
          </button>
        </div>

        {/* QUIZ */}

        <div style={{ marginTop: "25px" }}>
          <h2>🧠 Test Your Knowledge</h2>

          <p className="quiz-description">
            Complete a quiz to test what you learned. Your quiz progress will be
            verified by the server.
          </p>

          <button
            className="generate-quiz-button"
            onClick={() => navigate(`/quiz?sessionId=${sessionId}`)}
            disabled={sessionCompleted || quizCompleted}
          >
            {quizCompleted ? "✓ Quiz Completed" : "Start Study Quiz →"}
          </button>
        </div>

        {sessionCompleted && (
          <div className="quiz-session-info" style={{ marginTop: "25px" }}>
            🎉 Congratulations! You have completed this study session.
          </div>
        )}
      </div>
    </div>
  );
}

export default StudySessionDetail;

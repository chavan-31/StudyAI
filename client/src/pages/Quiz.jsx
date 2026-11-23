
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  generateQuiz,
  submitQuizAnswer,
  completeQuizBatch,
} from "../services/api";

const QUIZ_QUESTION_COUNT = 20;

function Quiz() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("sessionId");

  const [subject, setSubject] = useState("Java");
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("Beginner");

  const [questions, setQuestions] = useState([]);
  const [batchId, setBatchId] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);

  // ==========================================
  // GENERATE QUIZ
  // ==========================================

  const startQuiz = async () => {
    if (!token) {
      setError("Please login first.");
      return;
    }

    if (!subject.trim() || !topic.trim()) {
      setError("Please enter subject and topic.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const quizData = {
        subject: subject.trim(),
        topic: topic.trim(),
        difficulty,
        numberOfQuestions: QUIZ_QUESTION_COUNT,
      };

      if (sessionId) {
        quizData.studySessionId = sessionId;
      }

      const data = await generateQuiz(quizData, token);

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No quiz questions were generated.");
      }

      if (!data.batchId) {
        throw new Error("Quiz batch ID was not returned by the server.");
      }

      setQuestions(data.questions);
      setBatchId(data.batchId);

      setSubject(data.subject || subject);
      setTopic(data.topic || topic);
      setDifficulty(data.difficulty || difficulty);

      setCurrentQuestion(0);
      setSelectedAnswer("");
      setScore(0);
      setFeedback(null);

      setStarted(true);
      setFinished(false);
    } catch (err) {
      console.error("Generate quiz error:", err);
      setError(err.message || "Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUBMIT ANSWER
  // ==========================================

  const handleAnswer = async () => {
    if (!selectedAnswer) {
      setError("Please select an answer.");
      return;
    }

    if (submitting || feedback) return;

    const question = questions[currentQuestion];

    if (!question) {
      setError("Question not found.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await submitQuizAnswer(
        question.id,
        selectedAnswer,
        30,
        token,
      );

      if (result.correct) {
        setScore((previous) => previous + 1);
      }

      setFeedback({
        correct: result.correct,
        correctAnswer: result.quiz?.correctAnswer || "Not available",
        explanation:
          result.quiz?.explanation || "No explanation is available.",
      });
    } catch (err) {
      console.error("Submit answer error:", err);
      setError(err.message || "Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // NEXT QUESTION / COMPLETE QUIZ
  // ==========================================

  const handleNextQuestion = async () => {
    if (!feedback || completing) return;

    setError("");

    if (currentQuestion === questions.length - 1) {
      setCompleting(true);

      try {
        if (!batchId) {
          throw new Error("Quiz batch ID is missing.");
        }

        const result = await completeQuizBatch(batchId, token);

        if (!result.success) {
          throw new Error("The server could not confirm quiz completion.");
        }

        setFinished(true);
      } catch (err) {
        console.error("Quiz completion error:", err);
        setError(err.message || "Failed to complete quiz.");
      } finally {
        setCompleting(false);
      }

      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer("");
    setFeedback(null);
  };

  // ==========================================
  // RESET QUIZ
  // ==========================================

  const resetQuiz = () => {
    setStarted(false);
    setFinished(false);
    setQuestions([]);
    setBatchId("");

    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);

    setFeedback(null);
    setError("");
    setCompleting(false);
  };

  // ==========================================
  // QUIZ SETUP
  // ==========================================

  if (!started) {
    return (
      <div className="quiz-page">
        <div className="quiz-setup-card">
          <div className="quiz-main-icon">🧠</div>

          <p className="quiz-label">
            MENTORIQ AI • ADAPTIVE LEARNING
          </p>

          <h1>AI Quiz Generator</h1>

          <p className="quiz-description">
            Test your knowledge and let MentorIQ AI adapt the difficulty based
            on your performance.
          </p>

          <div className="quiz-session-info">
            🎯 Each quiz contains {QUIZ_QUESTION_COUNT} questions.
          </div>

          {sessionId && (
            <div className="quiz-session-info">
              🎓 Quiz linked to your selected study session.
            </div>
          )}

          {error && <div className="quiz-error">⚠ {error}</div>}

          <div className="quiz-field">
            <label>📚 Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="Java">Java</option>
              <option value="DSA">DSA</option>
              <option value="DBMS">DBMS</option>
              <option value="MERN Stack">MERN Stack</option>
            </select>
          </div>

          <div className="quiz-field">
            <label>📝 Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Example: Arrays"
            />
          </div>

          <div className="quiz-field">
            <label>📈 Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <button
            className="generate-quiz-button"
            onClick={startQuiz}
            disabled={loading}
          >
            {loading
              ? "Generating 20 Questions..."
              : "🚀 Generate 20 Questions"}
          </button>

          <button
            className="quiz-back-button"
            onClick={() => navigate(sessionId ? `/study/${sessionId}` : "/ai")}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // QUIZ RESULT
  // ==========================================

  if (finished) {
    const percentage =
      questions.length > 0
        ? Math.round((score / questions.length) * 100)
        : 0;

    return (
      <div className="quiz-page">
        <div className="quiz-result-card">
          <div className="result-trophy">🏆</div>

          <p className="quiz-label">QUIZ COMPLETED</p>
          <h1>Great work!</h1>

          <div className="score-circle">
            <span>{percentage}%</span>
          </div>

          <p className="result-text">
            You answered <strong>{score}</strong> out of{" "}
            <strong>{questions.length}</strong> questions correctly.
          </p>

          <div className="result-details">
            <div>
              <span>Subject</span>
              <strong>{subject}</strong>
            </div>

            <div>
              <span>Topic</span>
              <strong>{topic}</strong>
            </div>

            <div>
              <span>Difficulty</span>
              <strong>{difficulty}</strong>
            </div>
          </div>

          <button className="generate-quiz-button" onClick={resetQuiz}>
            🔄 Try Again
          </button>

          <button
            className="quiz-back-button"
            onClick={() =>
              navigate(sessionId ? `/study/${sessionId}` : "/dashboard")
            }
          >
            ← Back to Study Session
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // CURRENT QUESTION
  // ==========================================

  const question = questions[currentQuestion];

  if (!question) {
    return (
      <div className="quiz-page">
        <div className="quiz-setup-card">
          <h1>No questions found</h1>
          <button className="generate-quiz-button" onClick={resetQuiz}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // ==========================================
  // QUESTION UI
  // ==========================================

  return (
    <div className="quiz-page">
      <div className="quiz-question-card">
        <div className="quiz-header">
          <div>
            <span className="quiz-small-label">{subject}</span>
            <h2>{topic}</h2>
          </div>

          <div className="difficulty-badge">{difficulty}</div>
        </div>

        <div className="question-progress">
          <div style={{ width: `${progress}%` }} />
        </div>

        <div className="question-number">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <h1 className="question-text">{question.question}</h1>

        <div className="quiz-options">
          {question.options?.map((option, index) => (
            <button
              key={index}
              disabled={Boolean(feedback) || submitting || completing}
              className={`quiz-option ${
                selectedAnswer === option ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer(option)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          ))}
        </div>

        {error && <div className="quiz-error">⚠ {error}</div>}

        {feedback && (
          <div
            className={`quiz-answer-feedback ${
              feedback.correct ? "correct" : "incorrect"
            }`}
          >
            <h3>
              {feedback.correct ? "✅ Correct Answer!" : "❌ Incorrect Answer"}
            </h3>

            <p>
              <strong>Correct answer:</strong> {feedback.correctAnswer}
            </p>

            <p>
              <strong>Explanation:</strong> {feedback.explanation}
            </p>
          </div>
        )}

        {!feedback ? (
          <button
            className="submit-answer-button"
            onClick={handleAnswer}
            disabled={!selectedAnswer || submitting || completing}
          >
            {submitting ? "Checking Answer..." : "Submit Answer"}
          </button>
        ) : (
          <button
            className="submit-answer-button"
            onClick={handleNextQuestion}
            disabled={completing}
          >
            {completing
              ? "Verifying Quiz Completion..."
              : currentQuestion === questions.length - 1
                ? "Finish Quiz ✓"
                : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;

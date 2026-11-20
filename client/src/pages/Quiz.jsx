import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    generateQuiz,
    submitQuizAnswer
} from "../services/api";


function Quiz() {

    const navigate = useNavigate();

    const { token } = useAuth();


    // ================================
    // STATE
    // ================================

    const [subject, setSubject] =
        useState("Java");

    const [topic, setTopic] =
        useState("Arrays");

    const [difficulty, setDifficulty] =
        useState("Beginner");


    const [questions, setQuestions] =
        useState([]);

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [selectedAnswer, setSelectedAnswer] =
        useState("");

    const [score, setScore] =
        useState(0);


    const [started, setStarted] =
        useState(false);

    const [finished, setFinished] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ================================
    // GENERATE QUIZ
    // ================================

    const startQuiz = async () => {

        if (!token) {

            setError(
                "Please login first."
            );

            return;
        }


        if (!subject || !topic) {

            setError(
                "Please enter subject and topic."
            );

            return;
        }


        setLoading(true);

        setError("");


        try {

            const data =
                await generateQuiz(
                    {
                        subject,
                        topic,
                        difficulty,
                        numberOfQuestions: 5
                    },
                    token
                );


            setQuestions(
                data.questions || []
            );


            setDifficulty(
                data.difficulty ||
                difficulty
            );


            setCurrentQuestion(0);

            setSelectedAnswer("");

            setScore(0);

            setStarted(true);

            setFinished(false);


        } catch (err) {

            setError(
                err.message ||
                "Failed to generate quiz"
            );


        } finally {

            setLoading(false);

        }
    };


    // ================================
    // SUBMIT ANSWER
    // ================================

    const handleAnswer = async () => {

        if (!selectedAnswer) {

            setError(
                "Please select an answer."
            );

            return;
        }


        const question =
            questions[currentQuestion];


        if (!question) {

            setError(
                "Question not found."
            );

            return;
        }


        setError("");


        try {

            const result =
                await submitQuizAnswer(
                    question.id,
                    selectedAnswer,
                    30,
                    token
                );


            if (result.correct) {

                setScore(
                    previous =>
                        previous + 1
                );

            }


            if (
                currentQuestion ===
                questions.length - 1
            ) {

                setFinished(true);

            } else {

                setCurrentQuestion(
                    previous =>
                        previous + 1
                );

                setSelectedAnswer("");

            }


        } catch (err) {

            setError(
                err.message ||
                "Failed to submit answer"
            );

        }
    };


    // ================================
    // RESET QUIZ
    // ================================

    const resetQuiz = () => {

        setStarted(false);

        setFinished(false);

        setQuestions([]);

        setCurrentQuestion(0);

        setSelectedAnswer("");

        setScore(0);

        setError("");

    };


    // ================================
    // QUIZ SETUP
    // ================================

    if (!started) {

        return (

            <div className="quiz-page">

                <div className="quiz-setup-card">

                    <div className="quiz-main-icon">
                        🧠
                    </div>


                    <p className="quiz-label">
                        STUDYAI • ADAPTIVE LEARNING
                    </p>


                    <h1>
                        AI Quiz Generator
                    </h1>


                    <p className="quiz-description">
                        Test your knowledge and let
                        StudyAI adapt the difficulty
                        based on your performance.
                    </p>


                    {error && (

                        <div className="quiz-error">
                            ⚠ {error}
                        </div>

                    )}


                    {/* SUBJECT */}

                    <div className="quiz-field">

                        <label>
                            📚 Subject
                        </label>


                        <select
                            value={subject}
                            onChange={(e) =>
                                setSubject(
                                    e.target.value
                                )
                            }
                        >

                            <option value="Java">
                                Java
                            </option>

                            <option value="DSA">
                                DSA
                            </option>

                            <option value="DBMS">
                                DBMS
                            </option>

                            <option value="MERN Stack">
                                MERN Stack
                            </option>

                        </select>

                    </div>


                    {/* TOPIC */}

                    <div className="quiz-field">

                        <label>
                            📝 Topic
                        </label>


                        <input
                            type="text"
                            value={topic}
                            onChange={(e) =>
                                setTopic(
                                    e.target.value
                                )
                            }
                            placeholder="Example: Arrays"
                        />

                    </div>


                    {/* DIFFICULTY */}

                    <div className="quiz-field">

                        <label>
                            📈 Difficulty
                        </label>


                        <select
                            value={difficulty}
                            onChange={(e) =>
                                setDifficulty(
                                    e.target.value
                                )
                            }
                        >

                            <option value="Beginner">
                                Beginner
                            </option>

                            <option value="Intermediate">
                                Intermediate
                            </option>

                            <option value="Advanced">
                                Advanced
                            </option>

                        </select>

                    </div>


                    {/* GENERATE */}

                    <button
                        className="generate-quiz-button"
                        onClick={startQuiz}
                        disabled={loading}
                    >

                        {loading
                            ? "Generating Quiz..."
                            : "🚀 Generate Quiz"}

                    </button>


                    {/* BACK */}

                    <button
                        className="quiz-back-button"
                        onClick={() =>
                            navigate("/ai")
                        }
                    >
                        ← Back to AI Assistant
                    </button>


                </div>

            </div>

        );
    }


    // ================================
    // RESULT
    // ================================

    if (finished) {

        const percentage =
            questions.length > 0
                ? Math.round(
                    (score /
                        questions.length) *
                    100
                )
                : 0;


        return (

            <div className="quiz-page">

                <div className="quiz-result-card">


                    <div className="result-trophy">
                        🏆
                    </div>


                    <p className="quiz-label">
                        QUIZ COMPLETED
                    </p>


                    <h1>
                        Great work!
                    </h1>


                    <div className="score-circle">

                        <span>
                            {percentage}%
                        </span>

                    </div>


                    <p className="result-text">

                        You answered{" "}

                        <strong>
                            {score}
                        </strong>

                        {" "}out of{" "}

                        <strong>
                            {questions.length}
                        </strong>

                        {" "}questions correctly.

                    </p>


                    <div className="result-details">


                        <div>

                            <span>
                                Subject
                            </span>

                            <strong>
                                {subject}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Topic
                            </span>

                            <strong>
                                {topic}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Difficulty
                            </span>

                            <strong>
                                {difficulty}
                            </strong>

                        </div>


                    </div>


                    <button
                        className="generate-quiz-button"
                        onClick={resetQuiz}
                    >
                        🔄 Try Again
                    </button>


                    <button
                        className="quiz-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                </div>

            </div>

        );

    }


    // ================================
    // QUESTION
    // ================================

    const question =
        questions[currentQuestion];


    if (!question) {

        return (

            <div className="quiz-page">

                <div className="quiz-setup-card">

                    <h1>
                        No questions found
                    </h1>

                    <button
                        className="generate-quiz-button"
                        onClick={resetQuiz}
                    >
                        ← Back
                    </button>

                </div>

            </div>

        );

    }


    const progress =
        (
            (currentQuestion + 1) /
            questions.length
        ) * 100;


    // ================================
    // QUESTION UI
    // ================================

    return (

        <div className="quiz-page">

            <div className="quiz-question-card">


                {/* HEADER */}

                <div className="quiz-header">

                    <div>

                        <span className="quiz-small-label">
                            {subject}
                        </span>


                        <h2>
                            {topic}
                        </h2>

                    </div>


                    <div className="difficulty-badge">
                        {difficulty}
                    </div>

                </div>


                {/* PROGRESS */}

                <div className="question-progress">

                    <div
                        style={{
                            width:
                                `${progress}%`
                        }}
                    />

                </div>


                {/* NUMBER */}

                <div className="question-number">

                    Question{" "}

                    {currentQuestion + 1}

                    {" "}of{" "}

                    {questions.length}

                </div>


                {/* QUESTION */}

                <h1 className="question-text">

                    {question.question}

                </h1>


                {/* OPTIONS */}

                <div className="quiz-options">

                    {question.options?.map(
                        (option, index) => (

                            <button
                                key={index}
                                className={
                                    selectedAnswer === option
                                        ? "quiz-option selected"
                                        : "quiz-option"
                                }
                                onClick={() =>
                                    setSelectedAnswer(
                                        option
                                    )
                                }
                            >

                                <span className="option-letter">

                                    {String.fromCharCode(
                                        65 + index
                                    )}

                                </span>


                                <span>
                                    {option}
                                </span>

                            </button>

                        )
                    )}

                </div>


                {/* ERROR */}

                {error && (

                    <div className="quiz-error">
                        ⚠ {error}
                    </div>

                )}


                {/* NEXT */}

                <button
                    className="submit-answer-button"
                    onClick={handleAnswer}
                    disabled={!selectedAnswer}
                >

                    {currentQuestion ===
                    questions.length - 1
                        ? "Finish Quiz ✓"
                        : "Next Question →"}

                </button>


            </div>

        </div>

    );

}


export default Quiz;
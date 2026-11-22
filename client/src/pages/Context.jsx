import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudySessions } from "../services/api";

function CodeAssistant() {

    const navigate = useNavigate();

    // ==========================================
    // CODE STATES
    // ==========================================

    const [language, setLanguage] = useState("Java");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const [result, setResult] = useState("");

    const [loading, setLoading] = useState(false);

    const [mode, setMode] = useState("");


    // ==========================================
    // STUDY CONTEXT
    // ==========================================

    const [studyContext, setStudyContext] = useState({
        subject: "Programming",
        topic: "Programming",
        learningLevel: "Beginner",
        goal: "Learning"
    });

    const [contextLoading, setContextLoading] =
        useState(true);


    const [contextError, setContextError] =
        useState("");


    // ==========================================
    // LOAD STUDY CONTEXT
    // ==========================================

    useEffect(() => {

        const loadStudyContext = async () => {

            try {

                const token =
                    localStorage.getItem("token");


                // ------------------------------------------
                // CHECK LOGIN
                // ------------------------------------------

                if (!token) {

                    navigate("/login");

                    return;
                }


                // ------------------------------------------
                // GET STUDY SESSIONS
                // ------------------------------------------

                const data =
                    await getStudySessions(token);


                let sessions = [];


                if (Array.isArray(data)) {

                    sessions = data;

                }
                else if (
                    Array.isArray(data.sessions)
                ) {

                    sessions = data.sessions;

                }
                else if (
                    Array.isArray(data.data)
                ) {

                    sessions = data.data;

                }


                // ------------------------------------------
                // GET LATEST SESSION
                // ------------------------------------------

                if (sessions.length > 0) {

                    const latestSession =
                        sessions[sessions.length - 1];


                    setStudyContext({

                        subject:
                            latestSession.subject ||
                            "Programming",

                        topic:
                            latestSession.topic ||
                            "Programming",

                        learningLevel:
                            latestSession.difficulty ||
                            "Beginner",

                        goal:
                            latestSession.goal ||
                            "Learning"

                    });

                }


            }
            catch (err) {

                console.error(
                    "Context loading error:",
                    err
                );


                setContextError(
                    "Unable to load study context"
                );

            }
            finally {

                setContextLoading(false);

            }

        };


        loadStudyContext();

    }, [navigate]);


    // ==========================================
    // EXPLAIN CODE
    // ==========================================

    const explainCode = async () => {

        if (!code.trim()) {

            alert(
                "Please enter your code"
            );

            return;
        }


        try {

            setLoading(true);

            setMode("explain");

            setResult("");


            const response =
                await fetch(
                   "https://studyai-k7bc.onrender.com/api/code/explain",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            language,

                            code,

                            context: studyContext

                        })

                    }
                );


            const data =
                await response.json();


            console.log(
                "Explain API response:",
                data
            );


            if (!response.ok) {

                throw new Error(

                    data.error ||
                    data.message ||
                    "Failed to explain code"

                );

            }


            if (!data.response) {

                throw new Error(
                    "AI returned an empty response"
                );

            }


            setResult(
                data.response
            );


        }
        catch (err) {

            console.error(
                "Explain Code Error:",
                err
            );


            setResult(
                "Error: " +
                err.message
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // DEBUG CODE
    // ==========================================

    const debugCode = async () => {

        if (!code.trim()) {

            alert(
                "Please enter your code"
            );

            return;
        }


        try {

            setLoading(true);

            setMode("debug");

            setResult("");


            const response =
                await fetch(
                    "https://studyai-k7bc.onrender.com/api/code/debug",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            language,

                            code,

                            error,

                            context: studyContext

                        })

                    }
                );


            const data =
                await response.json();


            console.log(
                "Debug API response:",
                data
            );


            if (!response.ok) {

                throw new Error(

                    data.error ||
                    data.message ||
                    "Failed to debug code"

                );

            }


            if (!data.response) {

                throw new Error(
                    "AI returned an empty response"
                );

            }


            setResult(
                data.response
            );


        }
        catch (err) {

            console.error(
                "Debug Code Error:",
                err
            );


            setResult(
                "Error: " +
                err.message
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // CLEAR
    // ==========================================

    const clearCode = () => {

        setCode("");

        setError("");

        setResult("");

        setMode("");

    };


    // ==========================================
    // LOADING CONTEXT
    // ==========================================

    if (contextLoading) {

        return (

            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >

                <h2>
                    🧠 Loading Study Context...
                </h2>

                <p>
                    StudyAI is loading your latest
                    learning context.
                </p>

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "auto"
            }}
        >

            {/* HEADER */}

            <h1>
                🤖 AI Code Assistant
            </h1>

            <p>
                Explain your code or find and fix
                errors using your learning context.
            </p>


            {/* ==========================================
                CURRENT CONTEXT
            ========================================== */}

            <div
                style={{
                    background: "#eef6ff",
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "25px"
                }}
            >

                <h2>
                    🧠 Current Study Context
                </h2>


                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "15px"
                    }}
                >

                    <div>

                        <strong>
                            Subject
                        </strong>

                        <p>
                            {studyContext.subject}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Topic
                        </strong>

                        <p>
                            {studyContext.topic}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Level
                        </strong>

                        <p>
                            {studyContext.learningLevel}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Goal
                        </strong>

                        <p>
                            {studyContext.goal}
                        </p>

                    </div>

                </div>


                {contextError && (

                    <p
                        style={{
                            color: "orange"
                        }}
                    >
                        ⚠️ {contextError}
                    </p>

                )}

            </div>


            {/* ==========================================
                LANGUAGE
            ========================================== */}

            <label>

                <strong>
                    Programming Language
                </strong>

            </label>


            <br />


            <select
                value={language}
                onChange={(e) =>
                    setLanguage(
                        e.target.value
                    )
                }
                style={{
                    padding: "10px",
                    marginTop: "8px",
                    marginBottom: "20px",
                    minWidth: "180px"
                }}
            >

                <option value="Java">
                    Java
                </option>

                <option value="JavaScript">
                    JavaScript
                </option>

                <option value="Python">
                    Python
                </option>

                <option value="C++">
                    C++
                </option>

            </select>


            {/* ==========================================
                CODE
            ========================================== */}

            <h3>
                Your Code
            </h3>


            <textarea
                value={code}
                onChange={(e) =>
                    setCode(
                        e.target.value
                    )
                }
                placeholder="Paste your code here..."
                rows={15}
                style={{
                    width: "100%",
                    padding: "15px",
                    fontFamily: "monospace",
                    fontSize: "15px",
                    boxSizing: "border-box",
                    resize: "vertical"
                }}
            />


            {/* ==========================================
                ERROR
            ========================================== */}

            <h3>

                Error Message

                <span
                    style={{
                        fontWeight: "normal",
                        fontSize: "14px"
                    }}
                >
                    {" "}
                    (optional)
                </span>

            </h3>


            <textarea
                value={error}
                onChange={(e) =>
                    setError(
                        e.target.value
                    )
                }
                placeholder="Paste the error message here..."
                rows={4}
                style={{
                    width: "100%",
                    padding: "15px",
                    boxSizing: "border-box",
                    resize: "vertical"
                }}
            />


            {/* ==========================================
                BUTTONS
            ========================================== */}

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "20px",
                    flexWrap: "wrap"
                }}
            >

                <button
                    onClick={explainCode}
                    disabled={loading}
                    style={{
                        padding:
                            "12px 20px"
                    }}
                >

                    {loading &&
                    mode === "explain"

                        ? "🤖 Explaining..."

                        : "Explain Code"}

                </button>


                <button
                    onClick={debugCode}
                    disabled={loading}
                    style={{
                        padding:
                            "12px 20px"
                    }}
                >

                    {loading &&
                    mode === "debug"

                        ? "🤖 Debugging..."

                        : "Debug Code"}

                </button>


                <button
                    onClick={clearCode}
                    disabled={loading}
                    style={{
                        padding:
                            "12px 20px"
                    }}
                >

                    Clear

                </button>

            </div>


            {/* ==========================================
                RESULT
            ========================================== */}

            <div
                style={{
                    marginTop: "30px"
                }}
            >

                <h2>
                    AI Result
                </h2>


                <div
                    style={{
                        background: "#f5f5f5",
                        padding: "20px",
                        borderRadius: "10px",
                        minHeight: "150px",
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.6",
                        overflowX: "auto"
                    }}
                >

                    {loading

                        ? "🤖 AI is analyzing your code..."

                        : result ||
                          "AI response will appear here."

                    }

                </div>

            </div>


        </div>

    );

}

export default CodeAssistant;
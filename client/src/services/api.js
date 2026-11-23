const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://studyai-k7bc.onrender.com/api";

// ==========================================
// COMMON API RESPONSE HANDLER
// ==========================================

async function handleResponse(response, defaultMessage) {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response received from the server.");
  }

  if (!response.ok) {
    throw new Error(data.message || defaultMessage);
  }

  return data;
}

// ==========================================
// REGISTER
// ==========================================

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response, "Registration failed");
}

// ==========================================
// LOGIN
// ==========================================

export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response, "Login failed");
}

// ==========================================
// AI ASSISTANT
// ==========================================

export async function askAI(question, token) {
  if (!token) {
    throw new Error("You are not logged in. Please login again.");
  }

  if (!question || !question.trim()) {
    throw new Error("Please enter a question.");
  }

  const response = await fetch(`${API_URL}/ai/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: question.trim(),
    }),
  });

  const data = await handleResponse(response, "AI request failed");

  if (!data.response) {
    throw new Error("AI response was not returned by the server.");
  }

  return data;
}

// ==========================================
// AI CHAT HISTORY
// ==========================================

export async function getAIHistory(token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/ai/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Failed to fetch AI history");
}

// ==========================================
// GET ALL STUDY SESSIONS
// ==========================================

export async function getStudySessions(token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/study`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Failed to fetch study sessions");
}

// ==========================================
// GET ONE STUDY SESSION
// ==========================================

export async function getStudySession(sessionId, token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  if (!sessionId) {
    throw new Error("Study session ID is required.");
  }

  const response = await fetch(`${API_URL}/study/${sessionId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Failed to fetch study session");
}

// ==========================================
// CREATE STUDY SESSION
// ==========================================

export async function createStudySession(sessionData, token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/study`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sessionData),
  });

  return handleResponse(response, "Failed to create study session");
}

// ==========================================
// MARK LESSON COMPLETE
// ==========================================

export async function markLessonComplete(sessionId, token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  if (!sessionId) {
    throw new Error("Study session ID is required.");
  }

  const response = await fetch(
    `${API_URL}/study/${sessionId}/lesson-complete`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response, "Failed to complete lesson");
}

// ==========================================
// COMPLETE VERIFIED QUIZ BATCH
// ==========================================

export async function completeQuizBatch(batchId, token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  if (!batchId) {
    throw new Error("Quiz batch ID is required.");
  }

  const response = await fetch(`${API_URL}/quiz/batch/${batchId}/complete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Failed to complete quiz");
}

// ==========================================
// LEARNING PROGRESS
// ==========================================

export async function getLearningProgress(token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/progress`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Failed to fetch progress");
}

// ==========================================
// UPDATE LEARNING PROGRESS
// ==========================================

export async function updateLearningProgress(progressData, token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(progressData),
  });

  return handleResponse(response, "Failed to update progress");
}

// ==========================================
// AI QUIZ GENERATOR
// ==========================================

export async function generateQuiz(quizData, token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/quiz/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(quizData),
  });

  return handleResponse(response, "Failed to generate quiz");
}

// ==========================================
// SUBMIT QUIZ ANSWER
// ==========================================

export async function submitQuizAnswer(quizId, userAnswer, timeSpent, token) {
  if (!token) {
    throw new Error("You are not logged in.");
  }

  if (!quizId || !userAnswer) {
    throw new Error("Quiz question ID and answer are required.");
  }

  const response = await fetch(`${API_URL}/quiz/${quizId}/answer`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userAnswer,
      timeSpent,
    }),
  });

  return handleResponse(response, "Failed to submit answer");
}

// ==========================================
// AI PERFORMANCE ANALYTICS
// ==========================================

export async function getProgressAnalytics(token) {
  if (!token) {
    throw new Error("Authentication token missing. Please login again.");
  }

  const response = await fetch(`${API_URL}/progress/analytics`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response, "Failed to fetch performance analytics");
}

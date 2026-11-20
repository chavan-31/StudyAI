const API_URL = "http://localhost:5000/api";

// ================================
// REGISTER
// ================================

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

// ================================
// LOGIN
// ================================

export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

// ================================
// AI ASSISTANT
// ================================

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "AI request failed");
  }

  if (!data.response) {
    throw new Error("AI response was not returned by the server.");
  }

  return data;
}

// ================================
// AI CHAT HISTORY
// ================================

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch AI history");
  }

  return data;
}

// ================================
// STUDY SESSIONS
// ================================

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch study sessions");
  }

  return data;
}

// ================================
// CREATE STUDY SESSION
// ================================

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create study session");
  }

  return data;
}

// ================================
// LEARNING PROGRESS
// ================================

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch progress");
  }

  return data;
}

// ================================
// UPDATE LEARNING PROGRESS
// ================================

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update progress");
  }

  return data;
}

// ================================
// AI QUIZ GENERATOR
// ================================

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to generate quiz");
  }

  return data;
}

// ================================
// SUBMIT QUIZ ANSWER
// ================================

export async function submitQuizAnswer(quizId, userAnswer, timeSpent, token) {
  if (!token) {
    throw new Error("You are not logged in.");
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit answer");
  }

  return data;
}

// ================================
// AI PERFORMANCE ANALYTICS
// ================================

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch performance analytics");
  }

  return data;
}

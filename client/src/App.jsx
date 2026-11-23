import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Study from "./pages/Study";
import StudySessionDetail from "./pages/StudySessionDetail";
import AIChat from "./pages/AIChat";
import Context from "./pages/Context";
import Quiz from "./pages/Quiz";
import CodeAssistant from "./pages/CodeAssistant";
import Progress from "./pages/Progress";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/study" element={<Study />} />
        <Route path="/study/:sessionId" element={<StudySessionDetail />} />

        <Route path="/ai" element={<AIChat />} />
        <Route path="/context" element={<Context />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/code-assistant" element={<CodeAssistant />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

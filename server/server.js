require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const studyRoutes = require("./routes/studyRoutes");
const aiRoutes = require("./routes/aiRoutes");
const quizRoutes = require("./routes/quizRoutes");
const progressRoutes = require("./routes/progressRoutes");
const codeRoutes = require("./routes/codeRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

// ==========================================
// CONNECT MONGODB
// ==========================================

connectDB();

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/study", studyRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/code", codeRoutes);

// ==========================================
// HOME / TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message:
            "AI Context-Aware Study Assistant API is running"
    });
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
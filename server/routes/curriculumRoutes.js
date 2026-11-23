const express = require("express");

const { getSemesters, getSubjects, getTopics } = require("../data/curriculum");

const router = express.Router();

// GET /api/curriculum/semesters
router.get("/semesters", (req, res) => {
  res.json({
    success: true,
    semesters: getSemesters(),
  });
});

// GET /api/curriculum/subjects/:semester
router.get("/subjects/:semester", (req, res) => {
  const semester = req.params.semester;
  const subjects = getSubjects(semester);

  if (subjects.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Invalid semester selected.",
    });
  }

  res.json({
    success: true,
    semester,
    subjects,
  });
});

// GET /api/curriculum/topics/:semester/:subject
router.get("/topics/:semester/:subject", (req, res) => {
  const { semester, subject } = req.params;
  const topics = getTopics(semester, subject);

  if (topics.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Invalid semester or subject selected.",
    });
  }

  res.json({
    success: true,
    semester,
    subject,
    topics,
  });
});

module.exports = router;

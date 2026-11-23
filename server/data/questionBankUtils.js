const difficulties = ["Beginner", "Intermediate", "Advanced"];

function normalizeQuestion(question) {
  return String(question || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getUniqueQuestions(questions = []) {
  const seen = new Set();

  return questions.filter((item) => {
    if (!item || !item.question || !Array.isArray(item.options)) {
      return false;
    }

    const key = normalizeQuestion(item.question);

    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function validateQuestionBank(bank, expectedCount = 20) {
  const result = {};

  for (const difficulty of difficulties) {
    const questions = getUniqueQuestions(bank?.[difficulty] || []);

    result[difficulty] = {
      questions,
      count: questions.length,
      complete: questions.length >= expectedCount,
    };
  }

  return result;
}

function shuffleQuestions(questions = []) {
  const result = [...questions];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

module.exports = {
  difficulties,
  getUniqueQuestions,
  validateQuestionBank,
  shuffleQuestions,
};

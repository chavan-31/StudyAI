const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error("PDF file not found");
  }

  const dataBuffer = fs.readFileSync(filePath);

  const parser = new PDFParse({
    data: dataBuffer,
  });

  const result = await parser.getText();

  await parser.destroy();

  if (!result.text || !result.text.trim()) {
    throw new Error("No readable text found in PDF");
  }

  return result.text.trim();
};

const splitTextIntoChunks = (
  text,
  chunkSize = 1000,
  overlap = 200
) => {
  if (!text || !text.trim()) {
    return [];
  }

  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const chunks = [];

  let start = 0;

  while (start < cleanedText.length) {
    const end = Math.min(
      start + chunkSize,
      cleanedText.length
    );

    const chunk = cleanedText
      .slice(start, end)
      .trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= cleanedText.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
};

module.exports = {
  extractTextFromPDF,
  splitTextIntoChunks,
};
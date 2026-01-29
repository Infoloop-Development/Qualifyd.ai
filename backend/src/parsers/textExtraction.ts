import mammoth from "mammoth";
import { logger } from "../utils/logger";

// pdf-parse uses CommonJS, need dynamic import or require
const pdfParse = require("pdf-parse");

export async function extractText(file: Express.Multer.File): Promise<string> {
  const mime = file.mimetype || "";
  try {
    if (mime.includes("pdf")) {
      const data = await pdfParse(file.buffer);
      return data.text || "";
    }

    if (mime.includes("word") || mime.includes("officedocument") || file.originalname.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value || "";
    }
  } catch (err) {
    logger.warn({ err }, "Extraction failed, falling back to raw buffer");
  }

  // Simple fallback: treat buffer as UTF-8 text
  return file.buffer.toString("utf8");
}


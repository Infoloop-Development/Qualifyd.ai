import mammoth from "mammoth";
import { logger } from "../utils/logger";

// pdf-parse is CommonJS, need to handle it properly
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParseLib = require("pdf-parse");

// Extract the actual function - pdf-parse might export it directly or as default
const pdfParse: (buffer: Buffer) => Promise<{ text: string }> = 
  typeof pdfParseLib === "function" 
    ? pdfParseLib 
    : pdfParseLib.default || pdfParseLib;

export async function extractText(file: Express.Multer.File): Promise<string> {
  const mime = file.mimetype || "";
  try {
    if (mime.includes("pdf")) {
      if (typeof pdfParse !== "function") {
        throw new Error("pdfParse is not a function");
      }
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


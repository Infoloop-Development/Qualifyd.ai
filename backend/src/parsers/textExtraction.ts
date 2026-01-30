import mammoth from "mammoth";
import { logger } from "../utils/logger";

// pdf-parse is CommonJS, exports an object with PDFParse property
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParseLib = require("pdf-parse");

// Extract the actual function - pdf-parse v2.4.5 exports PDFParse property
const pdfParse: (buffer: Buffer) => Promise<{ text: string }> = 
  pdfParseLib.PDFParse || (typeof pdfParseLib === "function" ? pdfParseLib : pdfParseLib.default);

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


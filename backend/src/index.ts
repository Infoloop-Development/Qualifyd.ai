import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { router as apiRouter } from "./api/routes";
import { authRouter } from "./api/auth";
import { logger } from "./utils/logger";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

app.use((req, _res, next) => {
  // Attach uploader so routes can use consistent config
  (req as any).upload = upload;
  next();
});

// Auth routes (register/login)
app.use("/api/auth", authRouter);

app.use("/api", apiRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Also expose health at /api/health for nginx proxying
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  logger.info(`Backend listening on port ${port}`);
});


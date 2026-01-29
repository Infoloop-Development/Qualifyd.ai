import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { jobStore } from "./store";
import { processJob } from "./service";
import { rewriteWithGemini } from "../ai/gemini";
import { verifyToken } from "./auth";
import { listAnalysesForUser, getAnalysisForUser } from "../db";

export const router = express.Router();

// Types are loose to keep scaffolding simple.
const upload = multer();

router.post(
  "/analyze",
  upload.single("resume_file"),
  async (req: express.Request, res: express.Response) => {
    const jdText = (req.body.jd_text as string) || "";
    const file = req.file;

    if (!jdText || !file) {
      return res.status(400).json({ error: "jd_text and resume_file are required" });
    }

    let userId: number | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.id;
      }
    }

    // Persist uploaded resume so it can be downloaded later from profile
    const uploadsDir = path.join(process.cwd(), "uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });
    const safeName = `${Date.now()}_${file.originalname || "resume"}`.replace(/[^\w.\-]/g, "_");
    const storedPath = path.join(uploadsDir, safeName);
    fs.writeFileSync(storedPath, file.buffer);

    const job = jobStore.create({
      jdText,
      file,
      userId,
      resumePath: storedPath,
      resumeOriginalName: file.originalname,
    });
    // Fire and forget for now; later swap to BullMQ/worker
    processJob(job).catch((err) => {
      jobStore.fail(job.id, err);
    });

    res.json({ job_id: job.id });
  }
);

router.get("/status/:jobId", (req, res) => {
  const job = jobStore.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: "job not found" });
  res.json(job);
});

router.post("/rewrite", async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: "Gemini is disabled (GEMINI_API_KEY not set)" });
  }
  try {
    const body = req.body || {};
    const result = await rewriteWithGemini({
      jdKeywords: body.jdKeywords,
      jdSkills: body.jdSkills,
      summary: body.summary,
      bullets: body.bullets,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// List analyses for the currently authenticated user
router.get("/analyses", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const analyses = listAnalysesForUser(payload.id).map((a) => ({
    id: a.id,
    jobId: a.job_id,
    jobTitle: a.job_title,
    jdText: a.jd_text,
    resumeOriginalName: a.resume_original_name,
    createdAt: a.created_at,
    scores: a.scores,
    suggestions: a.suggestions,
  }));

  res.json(analyses);
});

// Download the original resume file for a given analysis
router.get("/analyses/:id/resume", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const analysisId = Number(req.params.id);
  if (!Number.isFinite(analysisId)) {
    return res.status(400).json({ error: "Invalid analysis id" });
  }

  const analysis = getAnalysisForUser(payload.id, analysisId);
  if (!analysis || !analysis.resume_path) {
    return res.status(404).json({ error: "Resume not found for this analysis" });
  }

  if (!fs.existsSync(analysis.resume_path)) {
    return res.status(404).json({ error: "Resume file no longer exists" });
  }

  res.download(analysis.resume_path, analysis.resume_original_name || "resume");
});


import { jobStore, JobRecord } from "./store";
import { extractText } from "../parsers/textExtraction";
import { parseJD } from "../parsers/jdParser";
import { parseResume } from "../parsers/resumeParser";
import { scoreAll } from "../scoring/scoreEngine";
import { buildSuggestions } from "../suggestions/suggestionsEngine";
import { logger } from "../utils/logger";
import { saveAnalysis } from "../db";

export async function processJob(job: JobRecord) {
  jobStore.start(job.id);

  if (!job.file) {
    throw new Error("Missing file");
  }

  const resumeText = await extractText(job.file);
  const parsedJD = parseJD(job.jdText);
  const parsedResume = parseResume(resumeText);
  const scores = scoreAll(parsedJD, parsedResume);
  const suggestions = buildSuggestions(parsedJD, parsedResume);

  jobStore.complete(job.id, {
    result: { scores, suggestions },
    parsed: { jd: parsedJD, resume: parsedResume },
  });

  if (job.userId) {
    try {
      saveAnalysis({
        userId: job.userId,
        jobId: job.id,
        jobTitle: parsedJD.titleHint,
        jdText: job.jdText,
        resumePath: job.resumePath,
        resumeOriginalName: job.resumeOriginalName,
        scores,
        suggestions,
      });
    } catch (err) {
      logger.warn({ err, jobId: job.id }, "Failed to persist analysis");
    }
  }

  logger.info({ jobId: job.id }, "job completed");
}


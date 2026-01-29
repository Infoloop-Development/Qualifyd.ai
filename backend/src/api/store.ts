import { randomUUID } from "crypto";
import { ParsedResume, ParsedJD, ScoredResult } from "../types";

export type JobStatus = "queued" | "processing" | "failed" | "done";

export interface JobRecord {
  id: string;
  status: JobStatus;
  jdText: string;
  file?: Express.Multer.File;
  userId?: number;
  resumePath?: string;
  resumeOriginalName?: string;
  error?: string;
  result?: ScoredResult;
  parsed?: {
    resume?: ParsedResume;
    jd?: ParsedJD;
  };
}

class InMemoryJobStore {
  private jobs = new Map<string, JobRecord>();

  create(input: {
    jdText: string;
    file: Express.Multer.File;
    userId?: number;
    resumePath?: string;
    resumeOriginalName?: string;
  }): JobRecord {
    const id = randomUUID();
    const job: JobRecord = {
      id,
      status: "queued",
      jdText: input.jdText,
      file: input.file,
      userId: input.userId,
      resumePath: input.resumePath,
      resumeOriginalName: input.resumeOriginalName,
    };
    this.jobs.set(id, job);
    return job;
  }

  start(id: string) {
    const job = this.jobs.get(id);
    if (job) job.status = "processing";
  }

  complete(id: string, payload: { result: ScoredResult; parsed: { resume: ParsedResume; jd: ParsedJD } }) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = "done";
    job.result = payload.result;
    job.parsed = payload.parsed;
  }

  fail(id: string, err: Error) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = "failed";
    job.error = err.message;
  }

  get(id: string) {
    return this.jobs.get(id);
  }
}

export const jobStore = new InMemoryJobStore();


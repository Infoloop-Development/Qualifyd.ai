import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import type { Scores, ScoredResult } from "./types";

export interface UserRecord {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

const db = new Database("data.db");

// Initialize schema (simple users table for auth)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    job_id TEXT NOT NULL,
    job_title TEXT,
    jd_text TEXT NOT NULL,
    resume_path TEXT,
    resume_original_name TEXT,
    scores_json TEXT NOT NULL,
    suggestions_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

export function findUserByEmail(email: string): UserRecord | undefined {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email) as UserRecord | undefined;
}

export function createUser(fullName: string, email: string, password: string): UserRecord {
  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(password, 10);
  const normalizedEmail = email.toLowerCase().trim();

  // Double-check for existing user before insert (defense in depth)
  const existing = findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const insert = db.prepare(
    "INSERT INTO users (full_name, email, password_hash, created_at) VALUES (?, ?, ?, ?)"
  );
  
  try {
    const result = insert.run(fullName, normalizedEmail, passwordHash, now);
    const select = db.prepare("SELECT * FROM users WHERE id = ?");
    return select.get(result.lastInsertRowid as number) as UserRecord;
  } catch (err: any) {
    // Re-throw with clearer message if unique constraint violation
    if (err?.code === "SQLITE_CONSTRAINT_UNIQUE" || err?.message?.includes("UNIQUE constraint")) {
      throw new Error("User with this email already exists");
    }
    throw err;
  }
}

export function verifyPassword(user: UserRecord, password: string): boolean {
  return bcrypt.compareSync(password, user.password_hash);
}

export interface AnalysisRecord {
  id: number;
  user_id: number;
  job_id: string;
  job_title?: string;
  jd_text: string;
  resume_path?: string;
  resume_original_name?: string;
  scores: Scores;
  suggestions: ScoredResult["suggestions"];
  created_at: string;
}

export function saveAnalysis(input: {
  userId: number;
  jobId: string;
  jobTitle?: string;
  jdText: string;
  resumePath?: string;
  resumeOriginalName?: string;
  scores: Scores;
  suggestions: ScoredResult["suggestions"];
}): void {
  const insert = db.prepare(
    "INSERT INTO analyses (user_id, job_id, job_title, jd_text, resume_path, resume_original_name, scores_json, suggestions_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  const now = new Date().toISOString();
  insert.run(
    input.userId,
    input.jobId,
    input.jobTitle || null,
    input.jdText,
    input.resumePath || null,
    input.resumeOriginalName || null,
    JSON.stringify(input.scores),
    JSON.stringify(input.suggestions),
    now
  );
}

export function listAnalysesForUser(userId: number): AnalysisRecord[] {
  const stmt = db.prepare(
    "SELECT id, user_id, job_id, job_title, jd_text, resume_path, resume_original_name, scores_json, suggestions_json, created_at FROM analyses WHERE user_id = ? ORDER BY created_at DESC"
  );
  const rows = stmt.all(userId) as Array<{
    id: number;
    user_id: number;
    job_id: string;
    job_title?: string;
    jd_text: string;
    resume_path?: string;
    resume_original_name?: string;
    scores_json: string;
    suggestions_json: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    job_id: row.job_id,
    job_title: row.job_title || undefined,
    jd_text: row.jd_text,
    resume_path: row.resume_path || undefined,
    resume_original_name: row.resume_original_name || undefined,
    scores: JSON.parse(row.scores_json) as Scores,
    suggestions: JSON.parse(row.suggestions_json) as ScoredResult["suggestions"],
    created_at: row.created_at,
  }));
}

export function getAnalysisForUser(userId: number, analysisId: number): AnalysisRecord | undefined {
  const stmt = db.prepare(
    "SELECT id, user_id, job_id, job_title, jd_text, resume_path, resume_original_name, scores_json, suggestions_json, created_at FROM analyses WHERE user_id = @userId AND id = @analysisId"
  );
  const row = stmt.get({ userId, analysisId }) as
    | {
        id: number;
        user_id: number;
        job_id: string;
        job_title?: string;
        jd_text: string;
        resume_path?: string;
        resume_original_name?: string;
        scores_json: string;
        suggestions_json: string;
        created_at: string;
      }
    | undefined;

  if (!row) return undefined;

  return {
    id: row.id,
    user_id: row.user_id,
    job_id: row.job_id,
    job_title: row.job_title || undefined,
    jd_text: row.jd_text,
    resume_path: row.resume_path || undefined,
    resume_original_name: row.resume_original_name || undefined,
    scores: JSON.parse(row.scores_json) as Scores,
    suggestions: JSON.parse(row.suggestions_json) as ScoredResult["suggestions"],
    created_at: row.created_at,
  };
}



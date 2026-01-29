const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AnalyzeResponse {
  job_id: string;
}

export type JobStatus = "queued" | "processing" | "failed" | "done";

export interface JobStatusResponse {
  status: JobStatus;
  error?: string;
  result?: {
    scores: {
      fit: number;
      ats: number;
      writing: number;
      breakdown: Record<string, number>;
    };
    suggestions: {
      missingSkills: string[];
      keywordsToAdd: string[];
      bulletIssues: string[];
      spellingIssues: string[];
      summaryHint: string;
      missingSections: string[];
      formatFlags: string[];
    };
  };
  parsed?: {
    resume?: {
      summary?: string;
    };
    jd?: unknown;
  };
}

export interface RewriteRequest {
  jdKeywords?: string[];
  jdSkills?: string[];
  summary?: string;
  bullets?: string[];
}

export interface RewriteResponse {
  summary?: string;
  bullets?: string[];
}

export interface AnalysisItem {
  id: number;
  jobId: string;
  jobTitle?: string;
  jdText: string;
  resumeOriginalName?: string;
  createdAt: string;
  scores: {
    fit: number;
    ats: number;
    writing: number;
    breakdown?: Record<string, number>;
  };
  suggestions: {
    missingSkills: string[];
    keywordsToAdd: string[];
    bulletIssues: string[];
    spellingIssues?: string[];
    summaryHint: string;
    missingSections: string[];
    formatFlags: string[];
  };
}

export async function registerUser(payload: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Registration failed");
  }
  return res.json();
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Login failed");
  }
  return res.json();
}

export async function analyzeResume(jdText: string, file: File): Promise<AnalyzeResponse> {
  const form = new FormData();
  form.append("jd_text", jdText);
  form.append("resume_file", file);

  const token = localStorage.getItem("ra_token");
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to submit analysis");
  }
  return res.json();
}

export async function fetchJobStatus(jobId: string): Promise<JobStatusResponse> {
  const res = await fetch(`${API_BASE}/status/${jobId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch job status");
  }
  return res.json();
}

export async function requestRewrite(payload: RewriteRequest): Promise<RewriteResponse> {
  const res = await fetch(`${API_BASE}/rewrite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Rewrite failed");
  }
  return res.json();
}

export async function fetchAnalyses(): Promise<AnalysisItem[]> {
  const token = localStorage.getItem("ra_token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/analyses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to load analyses");
  }
  return res.json();
}

export async function downloadResumeForAnalysis(analysisId: number): Promise<Blob> {
  const token = localStorage.getItem("ra_token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/analyses/${analysisId}/resume`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to download resume");
  }

  return res.blob();
}


export interface ParsedJD {
  titleHint?: string;
  seniorityRange?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  yearsExperience?: string;
  responsibilities: string[];
  keywords: string[];
}

export interface ExperienceItem {
  company?: string;
  title?: string;
  start?: string;
  end?: string;
  bullets: string[];
}

export interface ParsedResume {
  summary?: string;
  experiences: ExperienceItem[];
  skills: string[];
  education?: string[];
  projects?: string[];
  flags?: {
    hasColumns?: boolean;
    hasImages?: boolean;
    sectionsPresent?: {
      summary: boolean;
      skills: boolean;
      education: boolean;
      projects: boolean;
      experience: boolean;
    };
  };
}

export interface Scores {
  fit: number;
  ats: number;
  writing: number;
  breakdown: Record<string, number>;
}

export interface ScoredResult {
  scores: Scores;
  suggestions: {
    missingSkills: string[];
    keywordsToAdd: string[];
    bulletIssues: string[];
    spellingIssues: string[];
    summaryHint: string;
    missingSections: string[];
    formatFlags: string[];
  };
}


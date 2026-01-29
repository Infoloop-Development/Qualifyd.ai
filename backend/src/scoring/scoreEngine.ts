import { ParsedJD, ParsedResume, Scores } from "../types";

const weights = {
  fit: { skills: 0.5, coreSkills: 0.2, experience: 0.15, keywords: 0.1, formatting: 0.05 },
  ats: { keywords: 0.5, parseability: 0.25, cleanliness: 0.15, length: 0.1 },
  writing: { spelling: 0.3, grammar: 0.3, bullets: 0.25, readability: 0.15 },
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreAll(jd: ParsedJD, resume: ParsedResume): Scores {
  const skillMatches = resume.skills.filter((s) => jd.requiredSkills.includes(s));
  const requiredCoverage = jd.requiredSkills.length
    ? skillMatches.length / jd.requiredSkills.length
    : 0;

  const preferredMatches = resume.skills.filter((s) => jd.preferredSkills.includes(s));
  const keywordMatches = jd.keywords.filter((k) => resume.summary?.toLowerCase().includes(k.toLowerCase()));

  const fitScore =
    weights.fit.skills * (resume.skills.length ? (skillMatches.length / resume.skills.length) : 0) * 100 +
    weights.fit.coreSkills * requiredCoverage * 100 +
    weights.fit.experience * 70 + // placeholder
    weights.fit.keywords * (jd.keywords.length ? keywordMatches.length / jd.keywords.length : 0) * 100 +
    weights.fit.formatting * 80; // placeholder

  const atsScore =
    weights.ats.keywords * (jd.keywords.length ? keywordMatches.length / jd.keywords.length : 0) * 100 +
    weights.ats.parseability * 90 +
    weights.ats.cleanliness * 85 +
    weights.ats.length * 80;

  const writingScore =
    weights.writing.spelling * 80 +
    weights.writing.grammar * 80 +
    weights.writing.bullets * 70 +
    weights.writing.readability * 85;

  return {
    fit: clampScore(fitScore),
    ats: clampScore(atsScore),
    writing: clampScore(writingScore),
    breakdown: {
      requiredCoverage: clampScore(requiredCoverage * 100),
      preferredMatches: preferredMatches.length,
    },
  };
}


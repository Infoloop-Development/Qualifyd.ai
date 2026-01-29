import { ParsedResume, ExperienceItem } from "../types";
import { skillTaxonomy, synonymMap } from "../data/skills";

const sectionHeaders = ["experience", "work history", "summary", "skills", "education", "projects"];

function normalizeSkill(token: string): string | undefined {
  const lower = token.toLowerCase();
  if (synonymMap[lower]) return synonymMap[lower];
  if (skillTaxonomy.includes(lower)) return lower;
  return undefined;
}

export function parseResume(text: string): ParsedResume {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const sections: Record<string, string[]> = {};
  let current = "summary";

  sections[current] = [];

  lines.forEach((line) => {
    const lower = line.toLowerCase();
    const header = sectionHeaders.find((h) => lower.startsWith(h));
    if (header) {
      current = header;
      sections[current] = [];
      return;
    }
    sections[current] = sections[current] || [];
    sections[current].push(line);
  });

  const skills = new Set<string>();
  (sections["skills"] || []).forEach((line) => {
    line
      .split(/[,;•]/)
      .map((t) => t.trim())
      .forEach((token) => {
        const norm = normalizeSkill(token);
        if (norm) skills.add(norm);
      });
  });

  const experiences: ExperienceItem[] = [];
  (sections["experience"] || sections["work history"] || []).forEach((line) => {
    const bullet = line.startsWith("-") || line.startsWith("•");
    if (bullet && experiences.length) {
      experiences[experiences.length - 1].bullets.push(line.replace(/^[-•]\s*/, ""));
    } else {
      experiences.push({ title: line, bullets: [] });
    }
  });

  return {
    summary: (sections["summary"] || []).join(" "),
    experiences,
    skills: Array.from(skills),
    education: sections["education"],
    projects: sections["projects"],
    flags: {
      sectionsPresent: {
        summary: Boolean(sections["summary"]?.length),
        skills: Boolean(sections["skills"]?.length),
        education: Boolean(sections["education"]?.length),
        projects: Boolean(sections["projects"]?.length),
        experience: Boolean(sections["experience"]?.length || sections["work history"]?.length),
      },
      hasColumns: undefined,
      hasImages: undefined,
    },
  };
}


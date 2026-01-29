import { ParsedJD } from "../types";
import { skillTaxonomy, synonymMap } from "../data/skills";

const requiredRegex = /(required|must have|mandatory)/i;
const preferredRegex = /(nice to have|preferred|bonus)/i;
const yearsRegex = /(\d+\s*\+?\s*years?)/i;

function normalizeSkill(token: string): string | undefined {
  const lower = token.toLowerCase();
  if (synonymMap[lower]) return synonymMap[lower];
  if (skillTaxonomy.includes(lower)) return lower;
  return undefined;
}

export function parseJD(text: string): ParsedJD {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const requiredSkills = new Set<string>();
  const preferredSkills = new Set<string>();
  const keywords = new Set<string>();
  let yearsExperience: string | undefined;
  let titleHint: string | undefined;

  lines.forEach((line, idx) => {
    const words = line.split(/[,•\-;/]/).map((w) => w.trim()).filter(Boolean);
    words.forEach((word) => {
      const norm = normalizeSkill(word);
      if (norm) {
        keywords.add(word);
        if (requiredRegex.test(line)) requiredSkills.add(norm);
        else if (preferredRegex.test(line)) preferredSkills.add(norm);
        else requiredSkills.add(norm);
      }
    });

    if (!yearsExperience) {
      const match = line.match(yearsRegex);
      if (match) yearsExperience = match[1];
    }

    if (idx === 0 && !titleHint) {
      titleHint = line;
    }
  });

  return {
    titleHint,
    seniorityRange: undefined,
    requiredSkills: Array.from(requiredSkills),
    preferredSkills: Array.from(preferredSkills),
    yearsExperience,
    responsibilities: [],
    keywords: Array.from(keywords),
  };
}


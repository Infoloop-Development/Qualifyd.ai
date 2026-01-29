import { ParsedJD, ParsedResume } from "../types";

const weakVerbs = ["responsible for", "helped", "assisted", "supporting", "worked on"];
const passiveRegex = /\b(was|were|been|being|be)\s+\w+ed\b/i;

// Simple list of common resume typos to flag; this keeps things deterministic and lightweight
const commonTypos = [
  "teh",
  "recieve",
  "recieved",
  "mangement",
  "manger",
  "enviroment",
  "definately",
  "occured",
  "seperated",
  "adress",
  "responisble",
  "acheive",
  "acheived",
];

function collectSpellingIssues(text: string | undefined, sourceLabel: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const issues: string[] = [];

  commonTypos.forEach((typo) => {
    if (lower.includes(typo)) {
      issues.push(
        `Possible spelling issue "${typo}" detected in ${sourceLabel}. Re-check this text for spelling: "${text
          .slice(0, 80)
          .trim()}...".`
      );
    }
  });

  return issues;
}

export function buildSuggestions(jd: ParsedJD, resume: ParsedResume) {
  const missingSkills = jd.requiredSkills.filter((s) => !resume.skills.includes(s));
  const keywordsToAdd = jd.keywords.filter(
    (k) => !(resume.summary || "").toLowerCase().includes(k.toLowerCase())
  );

  const bulletIssues: string[] = [];
  const spellingIssues: string[] = [];

  // Check spelling in summary first
  spellingIssues.push(...collectSpellingIssues(resume.summary, "your summary"));

  // Limit how many alignment notes we surface so the list stays focused
  let alignmentSuggestions = 0;
  const maxAlignmentSuggestions = 6;

  resume.experiences.forEach((exp, expIdx) => {
    exp.bullets.forEach((b, bulletIdx) => {
      const cleaned = b.trim();
      if (!cleaned) return;

      const lower = cleaned.toLowerCase();
      const wordCount = cleaned.split(/\s+/).length;

      // Spelling detection for each bullet
      spellingIssues.push(
        ...collectSpellingIssues(
          cleaned,
          `experience section bullet ${bulletIdx + 1} (role ${expIdx + 1})`
        )
      );

      // 1) Make bullets more results‑driven
      if (!/\d/.test(cleaned)) {
        bulletIssues.push(
          `Add at least one concrete metric (%, $, #, time saved) to quantify impact in: "${cleaned.slice(
            0,
            80
          )}..."`
        );
      }

      // 2) Keep bullets sharp and concise
      if (wordCount > 30) {
        bulletIssues.push(
          `Split or tighten this long bullet (${wordCount} words) so it fits on 1–2 lines: "${cleaned.slice(
            0,
            80
          )}..."`
        );
      }

      // 3) Stronger, ownership‑driven verbs
      if (weakVerbs.some((w) => lower.startsWith(w))) {
        bulletIssues.push(
          `Rewrite the opening with a stronger ownership verb (e.g., "Led", "Owned", "Designed") instead of "${cleaned
            .slice(0, 25)
            .trim()}...".`
        );
      }

      // 4) Avoid soft passive constructions
      if (passiveRegex.test(cleaned)) {
        bulletIssues.push(
          `Convert this passive sentence into a direct "I/We did X that drove Y" statement: "${cleaned.slice(
            0,
            80
          )}..."`
        );
      }

      // 5) Explicitly tie bullets back to JD language for stronger perceived fit
      if (alignmentSuggestions < maxAlignmentSuggestions) {
        const jdSkillHits = jd.requiredSkills.filter((s) => lower.includes(s.toLowerCase()));
        const jdKeywordHits = jd.keywords.filter((k) => lower.includes(k.toLowerCase()));

        if (!jdSkillHits.length && !jdKeywordHits.length && jd.requiredSkills.length) {
          const coreSamples = jd.requiredSkills.slice(0, 3).join(", ");
          bulletIssues.push(
            `Tie this bullet directly to the JD by name‑dropping 1–2 core skills (e.g., ${coreSamples}) in: "${cleaned.slice(
              0,
              80
            )}..."`
          );
          alignmentSuggestions += 1;
        }
      }
    });
  });

  const missingSections: string[] = [];
  const sectionsPresent = resume.flags?.sectionsPresent;
  if (sectionsPresent) {
    if (!sectionsPresent.projects) {
      missingSections.push(
        "Projects: add 1–2 recent, impact‑focused projects that mirror this JD's tools and scope."
      );
    }
    if (!sectionsPresent.education) {
      missingSections.push("Education: list degree, institution, and graduation year (or 'in progress').");
    }
    if (!sectionsPresent.skills) {
      missingSections.push(
        "Skills: create a curated skills section that leads with this JD's core skills and keywords."
      );
    }
    if (!sectionsPresent.summary) {
      missingSections.push(
        "Summary: write a 2–3 line headline with title, years of experience, top 5–7 skills, and one strong metric."
      );
    }
  }

  const formatFlags: string[] = [];
  if (resume.flags?.hasColumns) {
    formatFlags.push("Columns detected; convert to a single‑column layout so ATS can parse your resume reliably.");
  }
  if (resume.flags?.hasImages) {
    formatFlags.push("Images detected; remove icons/graphics so ATS focuses on your text and keywords.");
  }

  const topMissingSkills = missingSkills.slice(0, 7).join(", ");
  const topKeywords = keywordsToAdd.slice(0, 5).join(", ");

  const summaryHint =
    !resume.summary || !resume.summary.trim()
      ? [
          "Write a sharp, JD‑aligned summary at the top that reads like a headline, not a paragraph.",
          jd.titleHint
            ? `Lead with the target title (e.g., "${jd.titleHint}") plus your total experience (e.g., "Senior ${jd.titleHint} | ${jd.yearsExperience || "X+ years"}").`
            : "Lead with your target title plus total experience (e.g., \"Senior Product Manager | 7+ years\").",
          topMissingSkills
            ? `Explicitly list 4–7 of this JD's core skills near the front (for example: ${topMissingSkills}).`
            : undefined,
          topKeywords
            ? `Weave in 2–3 high‑value keywords from the JD (for example: ${topKeywords}).`
            : undefined,
          "Close with one stand‑out metric that proves scope (revenue, users, savings, or efficiency).",
        ]
          .filter(Boolean)
          .join(" ")
      : missingSkills.length || keywordsToAdd.length
      ? [
          "Tighten your summary so it mirrors this specific JD more directly.",
          topMissingSkills
            ? `Front‑load core JD skills (for example: ${topMissingSkills}) instead of a generic skills list.`
            : undefined,
          topKeywords
            ? `Add 2–3 of the JD's exact keywords in natural language so both recruiters and ATS see the match (for example: ${topKeywords}).`
            : undefined,
          "Keep it to 2–3 high‑impact lines: who you are, where you play, and the business outcomes you drive.",
        ]
          .filter(Boolean)
          .join(" ")
      : "Your summary is solid; it already surfaces core skills and should read as a strong match for this JD.";

  return {
    missingSkills,
    keywordsToAdd,
    bulletIssues,
    spellingIssues,
    summaryHint,
    missingSections,
    formatFlags,
  };
}


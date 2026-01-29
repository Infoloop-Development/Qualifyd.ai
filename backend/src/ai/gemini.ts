const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

interface RewriteRequest {
  jdKeywords?: string[];
  jdSkills?: string[];
  summary?: string;
  bullets?: string[];
}

interface RewriteResponse {
  summary?: string;
  bullets?: string[];
}

export async function rewriteWithGemini(req: RewriteRequest): Promise<RewriteResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set");
  }

  const prompt = buildPrompt(req);
  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini error: ${text}`);
  }

  const data = (await res.json()) as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return parseResponse(text);
}

function buildPrompt(req: RewriteRequest): string {
  const skills = (req.jdSkills || []).slice(0, 10).join(", ");
  const keywords = (req.jdKeywords || []).slice(0, 10).join(", ");
  const bullets = req.bullets?.join("\n- ") || "";
  const summary = req.summary || "";
  return `You are improving resume content to match a job description.
- Job required skills: ${skills || "n/a"}
- JD keywords: ${keywords || "n/a"}
- Existing summary: ${summary || "n/a"}
- Bullets to improve:
- ${bullets || "n/a"}

Rewrite concisely:
1) Provide a 2-3 line summary that includes title/years, top skills, and one metric.
2) Provide improved bullets, one per line, each with strong action verb + scope + metric + JD skill/keyword.
3) Do NOT invent facts; stay generic if info missing.
Return as:
Summary: <text>
Bullets:
- <bullet 1>
- <bullet 2>
`;
}

function parseResponse(text: string): RewriteResponse {
  const lines = text.split(/\r?\n/);
  let summary: string | undefined;
  const bullets: string[] = [];
  let inBullets = false;
  for (const line of lines) {
    if (line.toLowerCase().startsWith("summary")) {
      summary = line.replace(/summary\s*:\s*/i, "").trim();
      continue;
    }
    if (line.toLowerCase().startsWith("bullets")) {
      inBullets = true;
      continue;
    }
    if (inBullets && line.trim().startsWith("-")) {
      bullets.push(line.replace(/^-+\s*/, "").trim());
    }
  }
  return { summary, bullets };
}


import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// ---------------- Helpers ----------------
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function stripCodeFences(text: string) {
  // removes ```json ... ``` or ``` ... ```
  return text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function safeJsonParse(text: string) {
  const cleaned = stripCodeFences(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    // fallback: find first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match?.[0]) return JSON.parse(match[0]);
    throw new Error("Invalid JSON returned from model");
  }
}

function normalizeKeys(data: any) {
  // If model returns "jekyll", normalize to "jackal"
  if (data?.jekyll && !data?.jackal) {
    data.jackal = data.jekyll;
    delete data.jekyll;
  }
  return data;
}

function validateShape(data: any, consequencesOn: boolean) {
  const isStr = (v: any) => typeof v === "string" && v.trim().length > 0;

  if (!data || typeof data !== "object") throw new Error("Response not an object");

  data = normalizeKeys(data);

  if (!data.hyde || !data.jackal) throw new Error("Missing hyde/jackal");

  if (!isStr(data.hyde.title) || !isStr(data.hyde.advice))
    throw new Error("Hyde missing title/advice");

  if (!isStr(data.jackal.title) || !isStr(data.jackal.advice))
    throw new Error("Jackal missing title/advice");

  if (consequencesOn) {
    if (!isStr(data.hyde.short_term) || !isStr(data.hyde.long_term))
      throw new Error("Hyde missing consequences");
    if (!isStr(data.jackal.short_term) || !isStr(data.jackal.long_term))
      throw new Error("Jackal missing consequences");
  }

  return data;
}

function mockResponse(consequencesOn: boolean) {
  return {
    hyde: {
      title: "Immediate Advantage",
      advice:
        "Optimize for quick results and protect your image. Take the path that gives you the best outcome fast, even if it isn’t the most principled.",
      ...(consequencesOn
        ? {
            short_term: "Fast progress and less friction right now.",
            long_term: "Higher risk of trust/reputation damage later.",
          }
        : {}),
    },
    jackal: {
      title: "Earned Integrity",
      advice:
        "Choose the honest and considerate path. Protect your relationships and your future self by acting fairly, even if it costs you today.",
      ...(consequencesOn
        ? {
            short_term: "May feel harder or slower at first.",
            long_term: "Builds trust, confidence, and stable progress.",
          }
        : {}),
    },
  };
}

function buildPrompt(dilemma: string, consequencesOn: boolean) {
  return `
You are generating two contrasting advisory responses inspired by Jekyll vs Hyde.

Dilemma: "${dilemma}"

Rules:
- Return TWO responses in JSON only:
  - "hyde": self-interested, reputation-focused, short-term thinking, self-centered.
  - "jackal": principled, empathetic, long-term thinking, self-less.
- Keep each "advice" 3-4 sentences under 50 words.
${consequencesOn ? "- Include short_term and long_term outcomes (each under 14 words)." : ""}
- Do NOT wrap the JSON in markdown code fences (no \`\`\`).
- Use the key "jackal" (NOT "jekyll").

Return ONLY valid JSON in this format:

{
  "hyde": {
    "title": string,
    "advice": string${consequencesOn ? `,
    "short_term": string,
    "long_term": string` : ""}
  },
  "jackal": {
    "title": string,
    "advice": string${consequencesOn ? `,
    "short_term": string,
    "long_term": string` : ""}
  }
}
`.trim();
}

function extractRetryDelayMs(err: any) {
  // Gemini 429 often includes retryDelay like "12s"
  const details = err?.error?.details || err?.details;
  const retryInfo = Array.isArray(details)
    ? details.find((d: any) => String(d?.["@type"] || "").includes("RetryInfo"))
    : null;

  const retryDelay = retryInfo?.retryDelay || err?.retryDelay;
  if (typeof retryDelay === "string" && retryDelay.endsWith("s")) {
    const s = Number(retryDelay.slice(0, -1));
    if (!Number.isNaN(s)) return Math.max(0, Math.floor(s * 1000));
  }
  return null;
}

async function callGeminiWithRetry(prompt: string) {
  const model = "gemini-2.5-flash"; // ✅ keep this
  const maxRetries = 2;

  let lastErr: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const timeoutMs = 20000;

      const result: any = await Promise.race([
        ai.models.generateContent({ model, contents: prompt }),
        new Promise<never>((_, rej) =>
          setTimeout(() => rej(new Error("Model timeout")), timeoutMs)
        ),
      ]);

      // SDK versions differ; handle common shapes
      const text =
        typeof result?.text === "string"
          ? result.text
          : typeof result?.response?.text === "string"
          ? result.response.text
          : typeof result?.response?.candidates?.[0]?.content?.parts?.[0]?.text === "string"
          ? result.response.candidates[0].content.parts[0].text
          : null;

      if (!text) throw new Error("No response text from Gemini");
      return text;
    } catch (e: any) {
      lastErr = e;

      const status = e?.status || e?.response?.status;
      const msg = String(e?.message || "");

      const is429 =
        status === 429 || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("Quota exceeded");
      const is5xx = status >= 500 && status < 600;

      if (attempt < maxRetries && (is429 || is5xx)) {
        const serverDelay = extractRetryDelayMs(e);
        const backoff =
          serverDelay ?? (500 * Math.pow(2, attempt) + Math.floor(Math.random() * 250));
        await sleep(backoff);
        continue;
      }

      throw e;
    }
  }

  throw lastErr;
}

// ---------------- Route ----------------
export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV !== "production";

  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY on server" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    const dilemma = String(body?.dilemma ?? "").trim();
    const consequencesOn = Boolean(body?.consequencesOn ?? false);

    if (!dilemma) {
      return NextResponse.json({ error: "Dilemma is required" }, { status: 400 });
    }

    const prompt = buildPrompt(dilemma, consequencesOn);

    let text: string;
    try {
      text = await callGeminiWithRetry(prompt);
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      const message = String(err?.message || "");

      console.error("Gemini call failed; returning mock fallback.", { status, message });

      return NextResponse.json(
        {
          ...mockResponse(consequencesOn),
          ...(isDev ? { _debug: { status, message } } : {}),
        },
        { status: 200 }
      );
    }

    // Parse + validate + normalize keys
    try {
      let data: any = safeJsonParse(text);
      data = validateShape(data, consequencesOn); // includes normalizeKeys()
      return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
      console.error("Parse/validation failed; returning mock fallback.", {
        message: String(err?.message || err),
        rawText: text,
      });

      return NextResponse.json(
        {
          ...mockResponse(consequencesOn),
          ...(isDev
            ? {
                _debug: {
                  status: "PARSE_FAIL",
                  message: String(err?.message || err),
                },
              }
            : {}),
        },
        { status: 200 }
      );
    }
  } catch (err: any) {
    console.error("Unexpected server error; returning mock fallback.", err);

    return NextResponse.json(
      {
        ...mockResponse(true),
        ...(process.env.NODE_ENV !== "production"
          ? { _debug: { status: "SERVER_FAIL", message: String(err?.message || err) } }
          : {}),
      },
      { status: 200 }
    );
  }
}
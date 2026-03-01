export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/* ───────────────────────── Rate Limiter ───────────────────────── */

const hits = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  return true;
}

/* ─────────────────────── Safe JSON Extractor ───────────────────── */

function extractJSON(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No valid JSON found in AI response");
  }
  return JSON.parse(text.slice(start, end + 1));
}

/* ─────────────────────────── Handler ─────────────────────────── */

export async function POST(req: Request) {
  try {
    /* ───── Rate Limit Protection ───── */

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    /* ───── Validate API Key ───── */

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    /* ───── Parse Body ───── */

    const body = await req.json();
    const {
      mode,
      dilemma,
      consequencesOn,
      choices,
      jekyllCount,
      hydeCount,
    } = body;

    /* ───────────────── FINAL PERSONALITY ANALYSIS ───────────────── */

    if (mode === "final") {
      if (!choices || !Array.isArray(choices) || choices.length === 0) {
        return NextResponse.json(
          { error: "Choices are required" },
          { status: 400 }
        );
      }

      const choiceList = choices
        .map(
          (
            c: { dilemma: string; picked: string; novel?: string },
            i: number
          ) =>
            `${i + 1}. [${c.novel ?? "Custom"}] "${c.dilemma}" → chose ${
              c.picked === "jekyll"
                ? "Reason (Jekyll)"
                : "Impulse (Hyde)"
            }`
        )
        .join("\n");

      const finalPrompt = `
You are a psychological profiler.

A user has faced moral dilemmas and chosen between:
- Jekyll (altruistic, rational, long-term)
- Hyde (self-interested, impulsive, short-term)

Choice history (${choices.length} total):
${choiceList}

Jekyll choices: ${jekyllCount}
Hyde choices: ${hydeCount}

Provide a deep psychological profile.

Respond ONLY with valid JSON:

{
  "persona_name": "string",
  "persona_description": "2–3 sentences",
  "dominant_trait": "string",
  "shadow_trait": "string",
  "literary_parallel": "Character + work",
  "insight": "3–4 sentence psychologist message"
}
`;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: finalPrompt,
      });

      if (!result.text) {
        throw new Error("No response text from Gemini");
      }

      const data = extractJSON(result.text);

      return NextResponse.json(data);
    }

    /* ───────────── DILEMMA RESPONSE GENERATION ───────────── */

    if (!dilemma || typeof dilemma !== "string" || dilemma.length > 1000) {
      return NextResponse.json(
        { error: "Valid dilemma is required (max 1000 chars)" },
        { status: 400 }
      );
    }

    const dilemmaPrompt = `
You are generating two contrasting advisory responses to a moral dilemma.

Dilemma: "${dilemma}"

Rules:
- Create TWO responses:
  - jekyll: empathetic, ethical, long-term thinking.
  - hyde: self-interested, reputation-focused, short-term thinking.
- Keep each advice under 50 words, 3-4 sentences.
${consequencesOn ? "- Include short_term and long_term outcomes." : ""}

Return ONLY valid JSON:

{
  "jekyll": {
    "title": "string",
    "advice": "string"${
      consequencesOn
        ? `,
    "short_term": "string",
    "long_term": "string"`
        : ""
    }
  },
  "hyde": {
    "title": "string",
    "advice": "string"${
      consequencesOn
        ? `,
    "short_term": "string",
    "long_term": "string"`
        : ""
    }
  }
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: dilemmaPrompt,
    });

    if (!result.text) {
      throw new Error("No response text from Gemini");
    }

    const data = extractJSON(result.text);

    if (!data.jekyll || !data.hyde) {
      throw new Error("Malformed AI response");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/* ─────────────────────────── Setup ─────────────────────────── */

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* ───────────────────── Safe JSON Extractor ───────────────────── */

function extractJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Invalid JSON returned from Gemini");
  }
}

/* ─────────────────────────── Handler ─────────────────────────── */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      mode,
      dilemma,
      consequencesOn,
      choices,
      jekyllCount,
      hydeCount,
    } = body;

    /* ───────────── FINAL PERSONALITY ANALYSIS ───────────── */

    if (mode === "final") {
      if (!choices || choices.length === 0) {
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
        model: "gemini-2.5-flash",
        contents: finalPrompt,
      });

      if (!result.text) {
        throw new Error("No response text from Gemini");
      }

      const data = extractJSON(result.text);

      return NextResponse.json(data);
    }

    /* ───────────── DILEMMA RESPONSE GENERATION ───────────── */

    if (!dilemma || typeof dilemma !== "string") {
      return NextResponse.json(
        { error: "Dilemma is required" },
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
- Hyde must NOT include illegal instructions, violence, or harmful behavior.
- Keep each advice under 100 words.
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
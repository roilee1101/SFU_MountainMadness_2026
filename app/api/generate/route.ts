export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

<<<<<<< HEAD
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

=======
// Ensure API key exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Safe JSON extractor (prevents demo crashes if model wraps JSON in text)
>>>>>>> origin
function extractJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Invalid JSON returned from Gemini");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, dilemma, consequencesOn, choices, jekyllCount, hydeCount } = body;

<<<<<<< HEAD
    // ── Final Personality Analysis ─────────────────────────────────────────────
    if (mode === "final") {
      if (!choices || choices.length === 0) {
        return NextResponse.json({ error: "Choices are required" }, { status: 400 });
      }

      const choiceList = choices
        .map(
          (c: { dilemma: string; picked: string; novel?: string }, i: number) =>
            `${i + 1}. [${c.novel ?? "Custom"}] "${c.dilemma}" → chose ${
              c.picked === "jekyll" ? "Reason (Jekyll)" : "Impulse (Hyde)"
            }`
        )
        .join("\n");

      const finalPrompt = `
You are a psychological profiler. A user has faced a series of moral dilemmas and chosen between Jekyll (altruistic, rational) and Hyde (self-interested, impulsive) for each one.

Choice history (${choices.length} total):
${choiceList}

Jekyll choices: ${jekyllCount} | Hyde choices: ${hydeCount}

Based on these patterns, provide a deep psychological profile of this person's moral identity.

Respond ONLY with valid JSON — no markdown code blocks, no extra text:

{
  "persona_name": "A unique, evocative name for this moral archetype (e.g. 'The Reluctant Saint', 'The Gilded Shadow')",
  "persona_description": "2–3 sentences capturing the core of this person's moral character",
  "dominant_trait": "Their most defining quality in one line",
  "shadow_trait": "The hidden tension within them in one line",
  "literary_parallel": "The literary character they most resemble, with novel/work title",
  "insight": "A psychologist's message to this person — 3–4 sentences, warm yet incisive"
}
`;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: finalPrompt,
      });

      if (!result.text) throw new Error("No response text from Gemini");
      const data = extractJSON(result.text);
      return NextResponse.json(data);
=======
    if (!dilemma || typeof dilemma !== "string") {
      return NextResponse.json(
        { error: "Dilemma is required" },
        { status: 400 }
      );
>>>>>>> origin
    }

    // ── Dilemma Jekyll/Hyde Response Generation ────────────────────────────────
    if (!dilemma) {
      return NextResponse.json({ error: "Dilemma is required" }, { status: 400 });
    }

    const dilemmaPrompt = `
You are generating two contrasting advisory responses to a moral dilemma.

Dilemma: "${dilemma}"

Rules:
- Create TWO responses:
<<<<<<< HEAD
  - jekyll: empathetic, ethical, long-term thinking, self-sacrificing.
  - hyde: self-interested, reputation-focused, impulsive, short-term thinking.
- Hyde must NOT include illegal instructions, violence, or harmful behavior.
- Keep each advice under 120 words.
- Respond in English.
=======
  - hyde: self-interested, reputation-focused, short-term thinking.
  - jekyll: empathetic, ethical, long-term thinking.
- Keep each advice under 50 words, 3-4 sentences.
>>>>>>> origin
${consequencesOn ? "- Include short_term and long_term outcomes." : ""}

Return ONLY valid JSON, no markdown code blocks:

{
  "jekyll": {
    "title": "string",
    "advice": "string"${consequencesOn ? `,
    "short_term": "string",
    "long_term": "string"` : ""}
  },
<<<<<<< HEAD
  "hyde": {
    "title": "string",
    "advice": "string"${consequencesOn ? `,
    "short_term": "string",
    "long_term": "string"` : ""}
=======
  "jekyll": {
    "title": string,
    "advice": string${
      consequencesOn
        ? `,
    "short_term": string,
    "long_term": string`
        : ""
    }
>>>>>>> origin
  }
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: dilemmaPrompt,
    });

<<<<<<< HEAD
    if (!result.text) throw new Error("No response text from Gemini");
    const data = extractJSON(result.text);
=======
    if (!result.text) {
      throw new Error("No response text from Gemini");
    }

    const data = extractJSON(result.text);

    // Final validation safeguard
    if (!data.hyde || !data.jekyll) {
      throw new Error("Malformed AI response");
    }

>>>>>>> origin
    return NextResponse.json(data);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
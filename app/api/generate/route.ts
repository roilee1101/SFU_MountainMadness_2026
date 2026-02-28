import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Fallback JSON extractor (prevents demo crashes)
function extractJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Invalid JSON returned from Gemini");
  }
}

export async function POST(req: Request) {
  try {
    const { dilemma, consequencesOn } = await req.json();

    if (!dilemma) {
      return NextResponse.json(
        { error: "Dilemma is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are generating two contrasting advisory responses.

Dilemma: "${dilemma}"

Rules:
- Create TWO responses:
  - hyde: self-interested, reputation-focused, short-term thinking.
  - jackal: empathetic, ethical, long-term thinking.
- Hyde must NOT include illegal instructions, violence, or harmful behavior.
- Keep each advice under 120 words.
${consequencesOn ? "- Include short_term and long_term outcomes." : ""}

Return ONLY valid JSON in this format:

{
  "hyde": {
    "title": string,
    "advice": string${
      consequencesOn
        ? `,
    "short_term": string,
    "long_term": string`
        : ""
    }
  },
  "jackal": {
    "title": string,
    "advice": string${
      consequencesOn
        ? `,
    "short_term": string,
    "long_term": string`
        : ""
    }
  }
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!result.text) {
        throw new Error("No response text from Gemini");
    }

const text = result.text;

    const data = extractJSON(text);

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
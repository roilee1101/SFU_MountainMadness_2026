"use client";

import { useMemo, useState } from "react";

type Side = {
  title: string;
  advice: string;
  short_term?: string;
  long_term?: string;
};

type ApiResponse = {
  hyde: Side;
  jackal: Side;
};

const MODES = [
  {
    key: "teamwork",
    label: "Teamwork",
    example: "My teammate isn’t doing their work. What should I do?",
  },
  {
    key: "relationships",
    label: "Relationships",
    example: "My friend hurt my feelings but thinks everything is fine. What should I do?",
  },
  {
    key: "career",
    label: "Career",
    example: "I can take credit for an idea at work and no one would know. Should I?",
  },
  {
    key: "social",
    label: "Social Media",
    example: "Someone posted something rude about me online. How should I respond?",
  },
] as const;

export default function Page() {
  const [mode, setMode] = useState<(typeof MODES)[number]["key"]>("teamwork");
  const [dilemma, setDilemma] = useState(MODES[0].example);
  const [consequencesOn, setConsequencesOn] = useState(true);

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const selectedMode = useMemo(
    () => MODES.find((m) => m.key === mode) ?? MODES[0],
    [mode]
  );

  async function generate() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dilemma, consequencesOn, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }

      setResult(data);
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function setExample(mKey: (typeof MODES)[number]["key"]) {
    const m = MODES.find((x) => x.key === mKey)!;
    setMode(mKey);
    setDilemma(m.example);
    setResult(null);
    setErr(null);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Jackal & Hyde — Two Voices
          </h1>
          <p className="text-neutral-300">
            Enter a dilemma. Get two contrasting answers: one self-serving (Hyde)
            and one empathetic (Jackal).
          </p>
        </div>

        {/* Controls */}
        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => setExample(m.key)}
                className={[
                  "rounded-full px-4 py-2 text-sm transition",
                  m.key === mode
                    ? "bg-neutral-100 text-neutral-900"
                    : "bg-neutral-800 text-neutral-100 hover:bg-neutral-700",
                ].join(" ")}
              >
                {m.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  type="checkbox"
                  checked={consequencesOn}
                  onChange={(e) => setConsequencesOn(e.target.checked)}
                  className="h-4 w-4 accent-neutral-100"
                />
                Consequences
              </label>

              <button
                onClick={generate}
                disabled={loading || !dilemma.trim()}
                className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-neutral-300">
                Mode: <span className="text-neutral-100">{selectedMode.label}</span>
              </span>
              <button
                onClick={() => {
                  setResult(null);
                  setErr(null);
                }}
                className="text-sm text-neutral-300 underline decoration-neutral-600 underline-offset-4 hover:text-neutral-100"
              >
                Clear
              </button>
            </div>

            <textarea
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              rows={4}
              placeholder="Type your dilemma here..."
              className="w-full resize-none rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600"
            />
          </div>

          {err && (
            <div className="mt-4 rounded-xl border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">
              {err}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {/* Hyde */}
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-950 to-neutral-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">🐺 Hyde</h2>
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-200">
                Self-serving
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-xl font-semibold text-neutral-100">
                {result?.hyde?.title ?? "—"}
              </h3>
              <p className="leading-relaxed text-neutral-200">
                {result?.hyde?.advice ?? "Generate to see Hyde’s answer."}
              </p>

              {consequencesOn && result?.hyde && (
                <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
                  <p className="text-sm font-semibold text-neutral-100">
                    Consequences
                  </p>
                  <p className="mt-2 text-sm text-neutral-200">
                    <span className="font-semibold text-neutral-100">
                      Short-term:
                    </span>{" "}
                    {result.hyde.short_term ?? "—"}
                  </p>
                  <p className="mt-2 text-sm text-neutral-200">
                    <span className="font-semibold text-neutral-100">
                      Long-term:
                    </span>{" "}
                    {result.hyde.long_term ?? "—"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Jackal */}
          <div className="rounded-2xl border border-neutral-200/30 bg-gradient-to-b from-white/90 to-white/70 p-6 text-neutral-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">🕊️ Jackal</h2>
              <span className="rounded-full bg-white px-3 py-1 text-xs text-neutral-700 ring-1 ring-neutral-300">
                Empathetic
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-xl font-semibold">
                {result?.jackal?.title ?? "—"}
              </h3>
              <p className="leading-relaxed text-neutral-800">
                {result?.jackal?.advice ?? "Generate to see Jackal’s answer."}
              </p>

              {consequencesOn && result?.jackal && (
                <div className="mt-4 rounded-xl bg-white/70 p-4 ring-1 ring-neutral-300">
                  <p className="text-sm font-semibold">Consequences</p>
                  <p className="mt-2 text-sm text-neutral-800">
                    <span className="font-semibold">Short-term:</span>{" "}
                    {result.jackal.short_term ?? "—"}
                  </p>
                  <p className="mt-2 text-sm text-neutral-800">
                    <span className="font-semibold">Long-term:</span>{" "}
                    {result.jackal.long_term ?? "—"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <p className="mt-8 text-sm text-neutral-400">
          Tip: Try the same dilemma with Consequences on/off to see how framing changes.
        </p>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import InputScreen from "@/components/InputScreen";
import ResultCharacter from "@/components/ResultCharacter";
import FinalScreen from "@/components/FinalScreen";

type Stage = "input" | "result" | "final";

type Side = {
  title: string;
  advice: string;
  short_term?: string;
  long_term?: string;
};

type ApiResponse = {
  hyde: Side;
  jackal: Side; // backend returns jackal = jekyll side
};

export default function Page() {
  const [stage, setStage] = useState<Stage>("input");
  const [dilemma, setDilemma] = useState("");
  const [consequencesOn, setConsequencesOn] = useState(true);

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [jekyllCount, setJekyllCount] = useState(0);
  const [hydeCount, setHydeCount] = useState(0);

  // ✅ cooldown for 429
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  // ✅ re-mount FinalScreen each time you open it (replays animation)
  const [finalRunId, setFinalRunId] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, []);

  const cooldownSeconds =
    cooldownUntil && now < cooldownUntil
      ? Math.ceil((cooldownUntil - now) / 1000)
      : 0;

  async function generate() {
    if (!dilemma.trim()) return;
    if (loading) return;
    if (cooldownSeconds > 0) return;

    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dilemma, consequencesOn }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          const wait = Number(json?.retrySeconds ?? 12);
          setCooldownUntil(Date.now() + wait * 1000);
          throw new Error(`Rate limit hit. Try again in ${wait}s.`);
        }
        throw new Error(json?.error || "Generate failed");
      }

      setData(json);
      setStage("result");
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function pick(p: "jekyll" | "hyde") {
    if (p === "jekyll") setJekyllCount((c) => c + 1);
    if (p === "hyde") setHydeCount((c) => c + 1);

    // unlimited rounds: go back to input
    setStage("input");
    setDilemma("");
  }

  function restart() {
    setStage("input");
    setDilemma("");
    setData(null);
    setErr(null);
    setJekyllCount(0);
    setHydeCount(0);
    setCooldownUntil(null);
  }

  function goFinal() {
    setFinalRunId((n) => n + 1);
    setStage("final");
  }

  return (
    <>
      {stage === "input" && (
        <div className="relative">
          {/* Top Right Controls */}
          <div className="absolute right-6 top-6 z-10 flex items-center gap-6 text-sm">
            <div className="text-white/70">
              Jekyll:{" "}
              <span className="text-blue-300 font-semibold">{jekyllCount}</span>{" "}
              Hyde:{" "}
              <span className="text-red-300 font-semibold">{hydeCount}</span>
            </div>

            <label className="flex items-center gap-2 text-white/80">
              <input
                type="checkbox"
                checked={consequencesOn}
                onChange={(e) => setConsequencesOn(e.target.checked)}
              />
              Consequences
            </label>

            <button
              onClick={goFinal}
              disabled={jekyllCount + hydeCount === 0}
              className="rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10 disabled:opacity-40"
            >
              Finish
            </button>
          </div>

          <InputScreen
            dilemma={dilemma}
            setDilemma={setDilemma}
            onGenerate={generate}
            isLoading={loading}
            cooldownSeconds={cooldownSeconds}
          />

          {err && (
            <div className="absolute inset-x-0 bottom-10 flex justify-center">
              <div className="rounded-xl border border-white/15 bg-black/60 px-4 py-2 text-sm text-white">
                {err}
              </div>
            </div>
          )}
        </div>
      )}

      {stage === "result" && data && (
        <ResultCharacter
          dilemma={dilemma}
          jekyll={data.jackal}
          hyde={data.hyde}
          consequencesOn={consequencesOn}
          onPick={pick}
          onFinish={goFinal}
        />
      )}

      {stage === "final" && (
        <FinalScreen
          key={finalRunId}
          jekyllCount={jekyllCount}
          hydeCount={hydeCount}
          onRestart={restart}
        />
      )}
    </>
  );
}
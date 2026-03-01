"use client";

import React, { useEffect, useState } from "react";

type ChoiceRecord = {
  dilemma: string;
  picked: "jekyll" | "hyde";
  novel?: string;
};

type PersonaAnalysis = {
  persona_name: string;
  persona_description: string;
  dominant_trait: string;
  shadow_trait: string;
  literary_parallel: string;
  insight: string;
};

type Props = {
  jekyllCount: number;
  hydeCount: number;
  choices: ChoiceRecord[];
  onRestart: () => void;
};

export default function FinalScreen({ jekyllCount, hydeCount, choices, onRestart }: Props) {
  const total = jekyllCount + hydeCount;
  const winner = jekyllCount > hydeCount ? "JEKYLL" : hydeCount > jekyllCount ? "HYDE" : "BALANCED";

  const [analysis, setAnalysis] = useState<PersonaAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "final", choices, jekyllCount, hydeCount }),
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setAnalysis(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (choices.length > 0) {
      fetchAnalysis();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white font-sans">
      {/* Background */}
      <div className={`pointer-events-none absolute inset-0 opacity-40 transition-all duration-1000 ${
        winner === "JEKYLL" ? "bg-blue-900/20" : winner === "HYDE" ? "bg-red-900/20" : "bg-purple-900/20"
      }`} />
      <div className="pointer-events-none absolute -left-60 -top-40 h-[800px] w-[800px] rounded-full bg-blue-500/10 blur-[160px]" />
      <div className="pointer-events-none absolute -right-60 -top-40 h-[800px] w-[800px] rounded-full bg-red-500/10 blur-[160px]" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-20">
        <div className="w-full space-y-12 text-center">

          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.5em] text-white/40 uppercase font-mono">
              Identity Assessment Complete
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase leading-tight">
              You are more{" "}
              {winner === "JEKYLL" ? (
                <span className="text-blue-500 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] font-sans">Jekyll</span>
              ) : winner === "HYDE" ? (
                <span className="text-red-600 font-serif italic drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]">Hyde</span>
              ) : (
                <span className="text-purple-400 font-light">Equilibrated</span>
              )}
            </h1>
          </div>

          {/* Score Grid */}
          <div className="grid grid-cols-2 gap-8 h-40">
            <div className={`flex flex-col justify-center rounded-[32px] border transition-all duration-700 ${
              winner === "JEKYLL"
                ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                : "border-white/5 bg-white/5"
            }`}>
              <div className="text-xs font-bold text-blue-400/60 uppercase tracking-widest">Altruism</div>
              <div className="mt-2 text-6xl font-black">{jekyllCount}</div>
            </div>
            <div className={`flex flex-col justify-center rounded-[32px] border transition-all duration-700 ${
              winner === "HYDE"
                ? "border-red-600/50 bg-red-600/10 shadow-[0_0_40px_rgba(220,38,38,0.15)]"
                : "border-white/5 bg-white/5"
            }`}>
              <div className="text-xs font-bold text-red-500/60 uppercase tracking-widest font-serif">Egoism</div>
              <div className="mt-2 text-6xl font-black">{hydeCount}</div>
            </div>
          </div>

          {/* Gemini Analysis Card */}
          <div className={`rounded-[32px] border text-left overflow-hidden transition-all duration-700 ${
            winner === "JEKYLL" ? "border-blue-500/20 bg-blue-500/5"
            : winner === "HYDE" ? "border-red-500/20 bg-red-500/5"
            : "border-purple-500/20 bg-purple-500/5"
          }`}>
            <div className="px-8 py-5 border-b border-white/5 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${loading ? "bg-yellow-500" : error ? "bg-red-500" : "bg-green-500"}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                Psychological Profile
              </span>
            </div>

            {loading ? (
              <div className="px-8 py-14 flex flex-col items-center gap-4 text-white/30">
                <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-white/30" />
                <p className="text-xs font-mono uppercase tracking-widest">Mapping your psyche...</p>
              </div>
            ) : error || !analysis ? (
              <div className="px-8 py-10 text-white/30 text-sm italic text-center">
                Analysis unavailable. Please check your API key.
              </div>
            ) : (
              <div className="px-8 py-8 space-y-7">
                {/* Persona Name */}
                <div>
                  <div className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-1">Your Persona</div>
                  <div className={`text-3xl font-black tracking-tighter ${
                    winner === "JEKYLL" ? "text-blue-400" : winner === "HYDE" ? "text-red-400" : "text-purple-400"
                  }`}>
                    {analysis.persona_name}
                  </div>
                </div>

                {/* Description */}
                <p className="text-base text-white/70 leading-relaxed">
                  {analysis.persona_description}
                </p>

                {/* Traits */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-blue-400/50 mb-2">Dominant Trait</div>
                    <p className="text-sm text-white/80 font-medium">{analysis.dominant_trait}</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-red-400/50 mb-2">Shadow Trait</div>
                    <p className="text-sm text-white/80 font-medium">{analysis.shadow_trait}</p>
                  </div>
                </div>

                {/* Literary Parallel */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 flex items-start gap-4">
                  <div className="text-2xl mt-0.5">📖</div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">Your Literary Counterpart</div>
                    <p className="text-sm font-bold text-white/80">{analysis.literary_parallel}</p>
                  </div>
                </div>

                {/* Insight */}
                <div className={`rounded-2xl p-5 border ${
                  winner === "JEKYLL" ? "border-blue-500/20 bg-blue-500/5"
                  : winner === "HYDE" ? "border-red-500/20 bg-red-500/5"
                  : "border-purple-500/20 bg-purple-500/5"
                }`}>
                  <div className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-2">The Analyst's Insight</div>
                  <p className="text-sm text-white/70 leading-relaxed italic">"{analysis.insight}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="space-y-6">
            <p className="text-sm font-mono text-white/30 italic">
              A total of {total} moral decision{total !== 1 && "s"} were mapped onto your psyche.
            </p>
            <button
              onClick={onRestart}
              className="group relative px-12 py-4 rounded-full border border-white/20 text-sm font-bold tracking-widest uppercase transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-xl shadow-black"
            >
              Reset Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
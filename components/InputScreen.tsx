"use client";

import React, { useMemo, useState } from "react";
import { NOVEL_DILEMMAS } from "@/data/novelDilemmas";

interface Props {
  dilemma: string;
  setDilemma: (v: string) => void;
  onGenerate: () => void;

  // optional feature (merge-safe): if parent doesn't care, it can pass a no-op
  onDilemmaSelect?: (prompt: string, novel?: string) => void;

  consequencesOn: boolean;
  setConsequencesOn: (v: boolean) => void;
  jekyllScore: number;
  hydeScore: number;
}

export default function InputScreen({
  dilemma,
  setDilemma,
  onGenerate,
  onDilemmaSelect,
  consequencesOn,
  setConsequencesOn,
  jekyllScore,
  hydeScore,
}: Props) {
  // ---- ratios (fixes your undefined vars) ----
  const { jekyllRatio, hydeRatio } = useMemo(() => {
    const total = jekyllScore + hydeScore;
    if (total === 0) return { jekyllRatio: 0.5, hydeRatio: 0.5 };
    return {
      jekyllRatio: jekyllScore / total,
      hydeRatio: hydeScore / total,
    };
  }, [jekyllScore, hydeScore]);

  // ---- Novel dilemmas picker (merge feature) ----
  const [selectedNovel, setSelectedNovel] = useState<string>("");

  const novelOptions = useMemo(() => {
    // Handles either shape:
    // 1) [{ novel: "...", prompt: "..." }, ...]
    // 2) { "Novel Title": ["prompt1", "prompt2"] }
    if (Array.isArray(NOVEL_DILEMMAS)) {
      const novels = Array.from(new Set(NOVEL_DILEMMAS.map((d: any) => d.novel).filter(Boolean)));
      return novels;
    }
    if (NOVEL_DILEMMAS && typeof NOVEL_DILEMMAS === "object") {
      return Object.keys(NOVEL_DILEMMAS as any);
    }
    return [];
  }, []);

  const getPromptsForNovel = (novel: string) => {
    if (!novel) return [];
    if (Array.isArray(NOVEL_DILEMMAS)) {
      return NOVEL_DILEMMAS.filter((d: any) => d.novel === novel).map((d: any) => d.prompt);
    }
    const obj = NOVEL_DILEMMAS as any;
    return Array.isArray(obj[novel]) ? obj[novel] : [];
  };

  const prompts = useMemo(() => getPromptsForNovel(selectedNovel), [selectedNovel]);

  const pickRandomPrompt = () => {
    if (!prompts.length) return;
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    setDilemma(prompt);
    onDilemmaSelect?.(prompt, selectedNovel);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Top Bar with Live Scores */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-12">
        <div className="flex gap-10 items-center">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 font-sans">
              Rationality
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter font-sans">
                Jekyll
              </span>
              <span className="text-3xl font-black text-blue-500 tabular-nums leading-none font-sans">
                {jekyllScore}
              </span>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-white/10 mb-1" />

          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 font-serif italic">
              Impulse
            </span>

            {/* scale animation now works because ratios exist */}
            <div
              className={`flex items-baseline gap-2 transition-all duration-500 ${
                hydeRatio > jekyllRatio ? "scale-110" : "scale-100"
              }`}
            >
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter font-serif">
                Hyde
              </span>
              <span className="text-3xl font-black text-red-600 font-serif tabular-nums italic leading-none">
                {hydeScore}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-3 h-3 rounded-full border border-white/20 transition-all ${
                consequencesOn
                  ? "bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  : "bg-transparent"
              }`}
            />
            <input
              type="checkbox"
              checked={consequencesOn}
              onChange={(e) => setConsequencesOn(e.target.checked)}
              className="hidden"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/70 transition-colors">
              Consequences
            </span>
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6">
        <div className="mb-20 text-center">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter flex items-center justify-center select-none">
            <span className="text-blue-500 animate-[bounce_5s_infinite]">Jekyll</span>
            <span className="mx-8 text-2xl font-light italic text-neutral-800 lowercase font-serif font-sans">
              or
            </span>
            <span className="font-serif uppercase tracking-widest text-red-600 animate-[bounce_6s_infinite]">
              Hyde
            </span>
          </h1>
        </div>

        {/* Novel dilemma picker (optional UI, won’t break anything) */}
        {novelOptions.length > 0 && (
          <div className="mb-8 w-full max-w-3xl flex items-center gap-4">
            <select
              value={selectedNovel}
              onChange={(e) => setSelectedNovel(e.target.value)}
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white outline-none"
            >
              <option value="" className="bg-neutral-950">
                Pick a novel (optional)
              </option>
              {novelOptions.map((n) => (
                <option key={n} value={n} className="bg-neutral-950">
                  {n}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={pickRandomPrompt}
              disabled={!selectedNovel || prompts.length === 0}
              className="rounded-full border border-white/10 bg-black/40 px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all disabled:opacity-30"
            >
              Random prompt
            </button>
          </div>
        )}

        <div className="w-full max-w-3xl relative">
          <textarea
            value={dilemma}
            onChange={(e) => setDilemma(e.target.value)}
            placeholder="Describe your inner conflict..."
            className="h-64 w-full resize-none rounded-[40px] border border-white/5 bg-white/[0.02] p-12 text-2xl text-white placeholder:text-neutral-800 focus:outline-none focus:bg-white/[0.05] transition-all duration-700"
          />

          <div className="mt-14 flex justify-center">
            <button
              onClick={onGenerate}
              disabled={!dilemma.trim()}
              className="group relative overflow-hidden rounded-full bg-white px-24 py-6 text-sm font-black uppercase tracking-[0.5em] text-black transition-all hover:scale-105 disabled:opacity-10"
            >
              <span className="relative z-10">Analyse Duality</span>
              <div className="absolute inset-0 z-0 w-0 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 transition-all duration-700 group-hover:w-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
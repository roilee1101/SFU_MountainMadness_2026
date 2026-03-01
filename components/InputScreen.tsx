"use client";

import React, { useMemo, useState } from "react";
import { NOVEL_DILEMMAS } from "@/data/novelDilemmas";

interface Props {
  dilemma: string;
  setDilemma: (v: string) => void;
  onGenerate: () => void;

  // optional: parent can ignore
  onDilemmaSelect?: (prompt: string, novel?: string) => void;

  consequencesOn: boolean;
  setConsequencesOn: (v: boolean) => void;
  jekyllScore: number;
  hydeScore: number;
}

type Tab = "custom" | "novels";

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
  const [tab, setTab] = useState<Tab>("custom");

  // ratios (fixes your earlier undefined vars)
  const { jekyllRatio, hydeRatio } = useMemo(() => {
    const total = jekyllScore + hydeScore;
    if (total === 0) return { jekyllRatio: 0.5, hydeRatio: 0.5 };
    return { jekyllRatio: jekyllScore / total, hydeRatio: hydeScore / total };
  }, [jekyllScore, hydeScore]);

  // novel cards
  const novels = useMemo(() => {
    return Array.from(new Set(NOVEL_DILEMMAS.map((d) => d.novel))).sort();
  }, []);

  const dilemmasByNovel = useMemo(() => {
    const map = new Map<string, typeof NOVEL_DILEMMAS>();
    for (const d of NOVEL_DILEMMAS) {
      const arr = map.get(d.novel) ?? [];
      arr.push(d);
      map.set(d.novel, arr);
    }
    return map;
  }, []);

  const pickRandomFromNovel = (novel: string) => {
    const list = dilemmasByNovel.get(novel) ?? [];
    if (!list.length) return;
    const d = list[Math.floor(Math.random() * list.length)];
    setDilemma(d.prompt);
    onDilemmaSelect?.(d.prompt, d.novel);
    // optional UX: jump back to custom tab so they can edit it
    setTab("custom");
  };

  const pickRandomGlobal = () => {
    if (!NOVEL_DILEMMAS.length) return;
    const d = NOVEL_DILEMMAS[Math.floor(Math.random() * NOVEL_DILEMMAS.length)];
    setDilemma(d.prompt);
    onDilemmaSelect?.(d.prompt, d.novel);
    setTab("custom");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Top Bar */}
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

      {/* Main */}
        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 pt-44 pb-24">        <div className="mb-12 text-center">
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

        {/* Tabs */}
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setTab("custom")}
                className={`rounded-full px-6 py-2 text-[11px] font-black uppercase tracking-[0.25em] transition-all ${
                  tab === "custom"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Custom
              </button>
              <button
                type="button"
                onClick={() => setTab("novels")}
                className={`rounded-full px-6 py-2 text-[11px] font-black uppercase tracking-[0.25em] transition-all ${
                  tab === "novels"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Novels
              </button>
            </div>

            {/* Global random */}
            <button
              type="button"
              onClick={pickRandomGlobal}
              className="rounded-full border border-white/10 bg-black/40 px-8 py-3 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all"
            >
              Random
            </button>
          </div>

          {/* Tab content */}
          <div className="mt-6">
            {tab === "custom" ? (
              <div className="w-full">
                <textarea
                  value={dilemma}
                  onChange={(e) => setDilemma(e.target.value)}
                  placeholder="Describe your inner conflict..."
                  className="h-64 w-full resize-none rounded-[40px] border border-white/5 bg-white/[0.02] p-12 text-2xl text-white placeholder:text-neutral-800 focus:outline-none focus:bg-white/[0.05] transition-all duration-700"
                />
              </div>
            ) : (
              <div className="rounded-[40px] border border-white/10 bg-white/[0.02] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-white/30">
                    Pick a novel
                  </div>
                  <div className="text-[10px] text-white/30">
                    Click a card to load a random prompt
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {novels.map((novel) => (
                    <button
                      key={novel}
                      type="button"
                      onClick={() => pickRandomFromNovel(novel)}
                      className="group text-left rounded-[28px] border border-white/10 bg-black/30 p-5 transition-all hover:bg-white/10 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <div className="text-sm font-black tracking-tight text-white">
                        {novel}
                      </div>
                      <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/30 group-hover:text-white/40">
                        Load random prompt
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generate */}
          <div className="mt-10 flex justify-center">
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
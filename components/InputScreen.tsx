"use client";

import React, { useState } from "react";
import { NOVEL_DILEMMAS } from "@/data/novelDilemmas";

interface Props {
  dilemma: string;
  setDilemma: (v: string) => void;
  onDilemmaSelect: (prompt: string, novel?: string) => void;
  onGenerate: () => void;
  consequencesOn: boolean;
  setConsequencesOn: (v: boolean) => void;
  jekyllScore: number;
  hydeScore: number;
}

export default function InputScreen({
  dilemma, setDilemma, onDilemmaSelect, onGenerate,
  consequencesOn, setConsequencesOn, jekyllScore, hydeScore,
}: Props) {
  const [mode, setMode] = useState<"custom" | "preset">("preset");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectPreset = (id: string) => {
    const found = NOVEL_DILEMMAS.find((d) => d.id === id);
    if (!found) return;
    setSelectedId(id);
    onDilemmaSelect(found.prompt, found.novel);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-12">
        <div className="flex gap-10 items-center">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">Rationality</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Jekyll</span>
              <span className="text-2xl font-black text-blue-500 tabular-nums">{jekyllScore}</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 font-serif italic">Impulse</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter font-serif">Hyde</span>
              <span className="text-2xl font-black text-red-600 font-serif tabular-nums italic">{hydeScore}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-3 h-3 rounded-full border border-white/20 transition-all ${consequencesOn ? "bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-transparent"}`} />
            <input type="checkbox" checked={consequencesOn} onChange={(e) => setConsequencesOn(e.target.checked)} className="hidden" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/70 transition-colors">Consequences</span>
          </label>
        </div>
      </div>

      {/* Main */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pt-32 pb-16">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter flex items-center justify-center select-none">
            <span className="text-blue-500 animate-[bounce_5s_infinite]">Jekyll</span>
            <span className="mx-6 text-2xl font-light italic text-neutral-800 lowercase font-serif">or</span>
            <span className="font-serif uppercase tracking-widest text-red-600 animate-[bounce_6s_infinite]">Hyde</span>
          </h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1 mb-10">
          <button
            onClick={() => setMode("preset")}
            className={`rounded-full px-8 py-2 text-[11px] font-black uppercase tracking-widest transition-all ${mode === "preset" ? "bg-white text-black" : "text-white/40 hover:text-white/70"}`}
          >
            Literary Dilemmas
          </button>
          <button
            onClick={() => { setMode("custom"); setSelectedId(null); setDilemma(""); }}
            className={`rounded-full px-8 py-2 text-[11px] font-black uppercase tracking-widest transition-all ${mode === "custom" ? "bg-white text-black" : "text-white/40 hover:text-white/70"}`}
          >
            Custom
          </button>
        </div>

        {/* Preset Grid */}
        {mode === "preset" && (
          <div className="w-full max-w-4xl mb-10">
            <p className="text-center text-[10px] uppercase tracking-[0.4em] text-white/20 mb-6">
              Moral crossroads from literature — which path would you take?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {NOVEL_DILEMMAS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectPreset(item.id)}
                  className={`group relative rounded-2xl border p-4 text-left transition-all duration-300 hover:scale-[1.02] ${
                    selectedId === item.id
                      ? "border-blue-500/60 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                      : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/30 mb-1 truncate">
                    {item.novel}
                  </div>
                  <div className={`text-xs font-black uppercase tracking-wider mb-2 ${selectedId === item.id ? "text-blue-400" : "text-white/60"}`}>
                    {item.situation}
                  </div>
                  <div className="text-[10px] text-white/40 leading-relaxed line-clamp-3">
                    {item.prompt}
                  </div>
                  {selectedId === item.id && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Selected preview */}
            {selectedId && (
              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
                <div className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-2">Selected Dilemma</div>
                <p className="text-base text-white/80 leading-relaxed italic">"{dilemma}"</p>
              </div>
            )}
          </div>
        )}

        {/* Custom Input */}
        {mode === "custom" && (
          <div className="w-full max-w-3xl mb-10">
            <textarea
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              placeholder="Describe your inner conflict..."
              className="h-52 w-full resize-none rounded-[32px] border border-white/5 bg-white/[0.02] p-10 text-xl text-white placeholder:text-neutral-700 focus:outline-none focus:bg-white/[0.05] transition-all duration-700"
            />
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={!dilemma.trim()}
          className="group relative overflow-hidden rounded-full bg-white px-20 py-5 text-sm font-black uppercase tracking-[0.5em] text-black transition-all hover:scale-105 disabled:opacity-10 disabled:cursor-not-allowed"
        >
          <span className="relative z-10">Analyse Duality</span>
          <div className="absolute inset-0 z-0 w-0 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 transition-all duration-700 group-hover:w-full" />
        </button>
      </div>
    </div>
  );
}
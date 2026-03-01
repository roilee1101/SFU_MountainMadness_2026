"use client";

import React from "react";

interface Props {
  dilemma: string;
  setDilemma: (v: string) => void;
  onGenerate: () => void;
  consequencesOn: boolean;
  setConsequencesOn: (v: boolean) => void;
  jekyllScore: number; 
  hydeScore: number;   
}

export default function InputScreen({ 
  dilemma, setDilemma, onGenerate, consequencesOn, setConsequencesOn, jekyllScore, hydeScore 
}: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Top Bar with Live Scores */}
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
            <div className={`w-3 h-3 rounded-full border border-white/20 transition-all ${consequencesOn ? 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-transparent'}`} />
            <input type="checkbox" checked={consequencesOn} onChange={(e) => setConsequencesOn(e.target.checked)} className="hidden" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/70 transition-colors">Consequences</span>
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6">
        <div className="mb-20 text-center">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter flex items-center justify-center select-none">
            <span className="text-blue-500 animate-[bounce_5s_infinite]">Jekyll</span>
            <span className="mx-8 text-2xl font-light italic text-neutral-800 lowercase font-serif font-sans">or</span>
            <span className="font-serif uppercase tracking-widest text-red-600 animate-[bounce_6s_infinite]">Hyde</span>
          </h1>
        </div>

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
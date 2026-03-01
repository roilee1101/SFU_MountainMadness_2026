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
  const total = jekyllScore + hydeScore || 1;
  const jekyllRatio = jekyllScore / total;
  const hydeRatio = hydeScore / total;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white transition-colors duration-1000">
      
      {/* 1. Background Aura: Dynamic glow based on Jekyll/Hyde scores */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(circle at 15% 15%, rgba(59, 130, 246, ${jekyllRatio * 0.2}), transparent 60%),
            radial-gradient(circle at 85% 15%, rgba(220, 38, 38, ${hydeRatio * 0.2}), transparent 60%)
          `
        }}
      />

      {/* 2. Top Right: Consequences Toggle (Isolated from scores) */}
      <div className="absolute top-0 right-0 z-50 p-12">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-3 h-3 rounded-full border border-white/20 transition-all ${consequencesOn ? 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-transparent'}`} />
          <input type="checkbox" checked={consequencesOn} onChange={(e) => setConsequencesOn(e.target.checked)} className="hidden" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/70 transition-colors font-sans">Consequences</span>
        </label>
      </div>

      {/* 3. Bottom Left: Scoreboard (Provides a grounded visual anchor) */}
      <div className="absolute bottom-0 left-0 z-50 p-12">
        <div className="flex gap-10 items-end">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 font-sans">Rationality</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter font-sans">Jekyll</span>
              <span className="text-3xl font-black text-blue-500 tabular-nums leading-none font-sans">{jekyllScore}</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10 mb-1" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 font-serif italic">Impulse</span>
            <div className={`flex items-baseline gap-2 transition-all duration-500 ${hydeRatio > jekyllRatio ? "scale-110" : "scale-100"}`}>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter font-serif">Hyde</span>
              <span className="text-3xl font-black text-red-600 font-serif tabular-nums italic leading-none">{hydeScore}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6">
        
        {/* 4. Title Section: Breathing animation for Jekyll and Hyde */}
        <div className="mb-20 text-center relative">
          <h1 className="relative z-10 text-8xl md:text-9xl font-black tracking-tighter flex items-center justify-center select-none font-sans">
            <span 
              className="text-blue-500 transition-all duration-1000 animate-breathing-jekyll"
              style={{ 
                textShadow: `0 0 ${25 + jekyllRatio * 40}px rgba(59, 130, 246, ${0.4 + jekyllRatio * 0.5})`,
                fontSize: `${1 + jekyllRatio * 0.1}em`
              }}
            >
              Jekyll
            </span>
            <span className="mx-8 text-2xl font-light italic text-neutral-800 lowercase font-serif">or</span>
            <span 
              className="font-serif uppercase tracking-widest text-red-600 transition-all duration-1000 italic animate-breathing-hyde"
              style={{ 
                textShadow: `0 0 ${25 + hydeRatio * 40}px rgba(220, 38, 38, ${0.4 + hydeRatio * 0.5})`,
                fontSize: `${1 + hydeRatio * 0.1}em`
              }}
            >
              Hyde
            </span>
          </h1>
        </div>

        {/* 5. Input Box Section: Rounded font and restricted glow area */}
        <div className="w-full max-w-3xl">
          <div className="relative group/box mb-12">
            <div 
              className="absolute -inset-1 rounded-[42px] blur-3xl opacity-0 transition-all duration-1000 group-focus-within/box:opacity-30"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${jekyllRatio * 100}%, #dc2626 ${hydeRatio * 100}%)`
              }}
            />
            <div className="absolute inset-0 rounded-[40px] pointer-events-none transition-all duration-500 group-hover/box:ring-1 group-hover/box:ring-white/20 group-hover/box:shadow-[0_0_25px_rgba(255,255,255,0.08)]" />
            <textarea
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              placeholder="Describe your inner conflict..."
              spellCheck={false}
              /* font-round for soft edges, font-medium for readability */
              className="relative z-10 h-64 w-full resize-none rounded-[40px] border border-white/5 bg-white/[0.01] p-12 text-2xl text-white/90 placeholder:text-neutral-800 focus:outline-none focus:bg-white/[0.04] transition-all duration-700 backdrop-blur-2xl font-round font-medium tracking-tight antialiased"
            />
          </div>
          
          {/* 6. Analyse Button: Clean, white button with duality hover effect */}
          <div className="flex justify-center">
            <button
              onClick={onGenerate}
              disabled={!dilemma.trim()}
              className="group/btn relative overflow-hidden rounded-full bg-white px-24 py-6 text-sm font-black uppercase tracking-[0.5em] text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-10 shadow-none font-sans"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-white">
                Analyse Duality
              </span>
              <div className="absolute inset-0 z-0 w-0 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 transition-all duration-700 ease-in-out group-hover/btn:w-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
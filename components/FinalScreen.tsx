"use client";

import React from "react";

/**
 * Props definition for the Final Results Screen
 * jekyllCount: Number of times 'Jekyll' (Selfless) was chosen
 * hydeCount: Number of times 'HYDE' (Selfish) was chosen
 * onRestart: Function to reset the application state
 */
type Props = {
  jekyllCount: number;
  hydeCount: number;
  onRestart: () => void;
};

export default function FinalScreen({ jekyllCount, hydeCount, onRestart }: Props) {
  const total = jekyllCount + hydeCount;
  
  // Logic to determine the dominant persona
  const winner = jekyllCount > hydeCount ? "JEKYLL" : hydeCount > jekyllCount ? "HYDE" : "BALANCED";

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white font-sans">
      
      {/* Dynamic Background Glow: Changes based on who won the struggle */}
      <div className={`pointer-events-none absolute inset-0 opacity-40 transition-all duration-1000 ${
        winner === "JEKYLL" ? "bg-blue-900/20" : winner === "HYDE" ? "bg-red-900/20" : "bg-purple-900/20"
      }`} />
      
      {/* Decorative Orbs for extra depth */}
      <div className="pointer-events-none absolute -left-60 -top-40 h-[800px] w-[800px] rounded-full bg-blue-500/10 blur-[160px]" />
      <div className="pointer-events-none absolute -right-60 -top-40 h-[800px] w-[800px] rounded-full bg-red-500/10 blur-[160px]" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
        <div className="w-full space-y-12 text-center">
          
          {/* Header Section: The Final Verdict */}
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.5em] text-white/40 uppercase font-mono">
              Identity Assessment Complete
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase leading-tight">
              You are more <br />
              {winner === "JEKYLL" ? (
                <span className="text-blue-500 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] font-sans">Jekyll</span>
              ) : winner === "HYDE" ? (
                <span className="text-red-600 font-serif italic drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]">Hyde</span>
              ) : (
                <span className="text-purple-400 font-light">Equilibrated</span>
              )}
            </h1>
          </div>

          {/* Statistical Breakdown: Grid showing the score for each persona */}
          <div className="grid grid-cols-2 gap-8 h-48">
            {/* Jekyll Column */}
            <div className={`flex flex-col justify-center rounded-[32px] border transition-all duration-700 ${
              winner === "JEKYLL" 
                ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.15)]" 
                : "border-white/5 bg-white/5"
            }`}>
              <div className="text-xs font-bold text-blue-400/60 uppercase tracking-widest">Altruism</div>
              <div className="mt-2 text-6xl font-black">{jekyllCount}</div>
            </div>
            
            {/* Hyde Column */}
            <div className={`flex flex-col justify-center rounded-[32px] border transition-all duration-700 ${
              winner === "HYDE" 
                ? "border-red-600/50 bg-red-600/10 shadow-[0_0_40px_rgba(220,38,38,0.15)]" 
                : "border-white/5 bg-white/5"
            }`}>
              <div className="text-xs font-bold text-red-500/60 uppercase tracking-widest font-serif">Egoism</div>
              <div className="mt-2 text-6xl font-black">{hydeCount}</div>
            </div>
          </div>

          {/* Metadata Footer: Displays total interactions */}
          <div className="space-y-6">
            <p className="text-sm font-mono text-white/30 italic">
              A total of {total} moral decision{total !== 1 && 's'} were mapped onto your psyche.
            </p>

            {/* Restart Button: Resets the state to the Input Screen */}
            <button
              onClick={onRestart}
              className="group relative px-12 py-4 rounded-full border border-white/20 text-sm font-bold tracking-widest uppercase transition-all 
                         hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-xl shadow-black"
            >
              Reset Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
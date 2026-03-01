"use client";

import React, { useState } from "react";
import ResultCharacter from "./ResultCharacter";

type Props = {
  dilemma: string;
  hyde: any;
  jekyll: any;
  jekyllCount: number;
  hydeCount: number;
  consequencesOn: boolean;
  onPick: (pick: "jekyll" | "hyde") => void;
  onNextLayout: () => void;
  onBack: () => void;
  onFinish: () => void;
};

export default function ResultSplit({
  dilemma, hyde, jekyll, jekyllCount, hydeCount,
  consequencesOn, onPick, onNextLayout, onBack, onFinish,
}: Props) {
  const [hovered, setHovered] = useState<"jekyll" | "hyde" | null>(null);

  const getAmbientColor = () => {
    if (jekyllCount > hydeCount) return "bg-blue-900/10";
    if (hydeCount > jekyllCount) return "bg-red-900/10";
    return "bg-neutral-900/40";
  };

  // Width computed once — no stutter
  const jekyllW = hovered === "jekyll" ? "58%" : hovered === "hyde" ? "42%" : "50%";
  const hydeW  = hovered === "hyde"   ? "58%" : hovered === "jekyll" ? "42%" : "50%";

  return (
    <div
      className={`relative h-screen w-full overflow-hidden transition-colors duration-700 ${getAmbientColor()} bg-neutral-950 text-white`}
    >
      {/* ── Top Nav ── */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-10">
        {/* Left: back + score */}
        <div className="flex items-center gap-5 min-w-[260px]">
          <button
            onClick={onBack}
            aria-label="Back to dilemma input"
            className="rounded-full border border-white/10 bg-black/40 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em]
              hover:bg-white hover:text-black transition-colors duration-200
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            ← Back
          </button>
          <div
            className="flex gap-3 text-[11px] font-black tracking-widest uppercase"
            aria-label={`Score: Jekyll ${jekyllCount}, Hyde ${hydeCount}`}
          >
            <span className="text-blue-400">J: {jekyllCount}</span>
            <span className="text-white/20">·</span>
            <span className="text-red-400 font-serif">H: {hydeCount}</span>
          </div>
        </div>

        {/* Center: dilemma label — truncated, no overflow */}
        <p
          className="flex-1 text-center text-sm italic text-white/40 px-6 truncate max-w-[40%]"
          title={dilemma}
          aria-label={`Current dilemma: ${dilemma}`}
        >
          "{dilemma}"
        </p>

        {/* Right: Layout B + Finish */}
        <div className="flex items-center gap-3 min-w-[260px] justify-end">
          <button
            onClick={onNextLayout}
            aria-label="Switch to Layout B"
            className="rounded-full border border-white/10 px-5 py-2 text-[10px] font-bold uppercase tracking-widest
              hover:bg-white/10 transition-colors duration-200
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Layout B →
          </button>
          <button
            onClick={onFinish}
            aria-label="Finish and see final results"
            className="rounded-full bg-white px-7 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-black
              hover:bg-white/85 transition-colors duration-200
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Finish
          </button>
        </div>
      </div>

      {/* Thin divider line in center — purely decorative */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-px bg-white/5 z-10 pointer-events-none"
        style={{ transform: "translateX(-50%)" }}
      />

      {/* ── Main Split ── */}
      <div className="flex h-full w-full">
        {/* Jekyll panel */}
        <div
          role="region"
          aria-label="Jekyll — the rational path"
          onMouseEnter={() => setHovered("jekyll")}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered("jekyll")}
          onBlur={() => setHovered(null)}
          style={{
            width: jekyllW,
            transition: "width 600ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
          className="h-full shrink-0"
        >
          <ResultCharacter
            type="jekyll"
            data={jekyll}
            isHovered={hovered === "jekyll"}
            consequencesOn={consequencesOn}
            onPick={() => onPick("jekyll")}
          />
        </div>

        {/* Hyde panel */}
        <div
          role="region"
          aria-label="Hyde — the impulsive path"
          onMouseEnter={() => setHovered("hyde")}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered("hyde")}
          onBlur={() => setHovered(null)}
          style={{
            width: hydeW,
            transition: "width 600ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
          className="h-full shrink-0"
        >
          <ResultCharacter
            type="hyde"
            data={hyde}
            isHovered={hovered === "hyde"}
            consequencesOn={consequencesOn}
            onPick={() => onPick("hyde")}
          />
        </div>
      </div>
    </div>
  );
}
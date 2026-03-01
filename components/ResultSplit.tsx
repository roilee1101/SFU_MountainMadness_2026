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
  consequencesOn, onPick, onNextLayout, onBack, onFinish 
}: Props) {
  const [hovered, setHovered] = useState<"jekyll" | "hyde" | null>(null);

  const getAmbientColor = () => {
    if (jekyllCount > hydeCount) return "bg-blue-900/10"; 
    if (hydeCount > jekyllCount) return "bg-red-900/10";  
    return "bg-neutral-900/40"; 
  };

  return (
    <div className={`relative h-screen w-full overflow-hidden transition-colors duration-1000 ${getAmbientColor()} bg-neutral-950 text-white`}>
      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-12">
        <div className="flex items-center gap-6 min-w-[320px]">
          <button onClick={onBack} className="rounded-full border border-white/10 bg-black/40 px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">← Back</button>
          <div className="flex gap-4 text-[11px] font-black tracking-widest uppercase">
            <span className="text-blue-400">Jekyll: {jekyllCount}</span>
            <span className="text-red-500 font-serif">Hyde: {hydeCount}</span>
          </div>
        </div>
        <div className="flex flex-col items-center flex-1 max-w-[35%] text-center italic opacity-60">"{dilemma}"</div>
        <div className="flex items-center gap-3 min-w-[320px] justify-end">
          <button onClick={onNextLayout} className="rounded-full border border-white/10 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10">Layout B →</button>
          <button onClick={onFinish} className="rounded-full bg-white px-8 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-black">Finish</button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex h-full w-full">
        <div onMouseEnter={() => setHovered("jekyll")} onMouseLeave={() => setHovered(null)}
          className={`h-full transition-all duration-700 ease-in-out ${hovered === "jekyll" ? "w-[60%]" : hovered === "hyde" ? "w-[40%]" : "w-1/2"}`}>
          <ResultCharacter type="jekyll" data={jekyll} isHovered={hovered === "jekyll"} consequencesOn={consequencesOn} onPick={() => onPick("jekyll")} />
        </div>
        <div onMouseEnter={() => setHovered("hyde")} onMouseLeave={() => setHovered(null)}
          className={`h-full transition-all duration-700 ease-in-out ${hovered === "hyde" ? "w-[60%]" : hovered === "jekyll" ? "w-[40%]" : "w-1/2"}`}>
          <ResultCharacter type="hyde" data={hyde} isHovered={hovered === "hyde"} consequencesOn={consequencesOn} onPick={() => onPick("hyde")} />
        </div>
      </div>
    </div>
  );
}
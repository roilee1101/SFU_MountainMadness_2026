"use client";

import React, { useState } from "react";
import InputScreen from "@/components/InputScreen";
import ResultSplit from "@/components/ResultSplit";
import ResultCharacter from "@/components/ResultCharacter";
import FinalScreen from "@/components/FinalScreen";

type ChoiceRecord = {
  dilemma: string;
  picked: "jekyll" | "hyde";
  novel?: string;
};

export default function Page() {
  const [dilemma, setDilemma] = useState("");
  const [currentNovel, setCurrentNovel] = useState<string | undefined>(undefined);
  const [view, setView] = useState<"input" | "split" | "character" | "final">("input");
  const [scores, setScores] = useState({ jekyll: 0, hyde: 0 });
  const [choices, setChoices] = useState<ChoiceRecord[]>([]);
  const [consequencesOn, setConsequencesOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [aiData, setAiData] = useState({
    jekyll: { title: "", advice: "", short_term: "", long_term: "" },
    hyde: { title: "", advice: "", short_term: "", long_term: "" },
  });

  const handleGenerate = async () => {
    if (!dilemma.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dilemma, consequencesOn }),
      });
      const data = await res.json();
      setAiData(data);
      setView("split");
    } catch (e) {
      console.error("Generation error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDilemmaSelect = (prompt: string, novel?: string) => {
    setDilemma(prompt);
    setCurrentNovel(novel);
  };

  const handlePick = (side: "jekyll" | "hyde") => {
    setScores((prev) => ({ ...prev, [side]: prev[side] + 1 }));
    setChoices((prev) => [...prev, { dilemma, picked: side, novel: currentNovel }]);
    setView("input");
    setDilemma("");
    setCurrentNovel(undefined);
  };

  const resetAll = () => {
    setDilemma("");
    setCurrentNovel(undefined);
    setScores({ jekyll: 0, hyde: 0 });
    setChoices([]);
    setView("input");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <main className="relative">
        {isLoading && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl">
            <div className="h-24 w-24 animate-spin rounded-full border-t-2 border-blue-500"></div>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[1em] text-white/40">Measuring Duality...</p>
          </div>
        )}

        {view === "input" && (
          <InputScreen
            dilemma={dilemma}
            setDilemma={setDilemma}
            onDilemmaSelect={handleDilemmaSelect}
            onGenerate={handleGenerate}
            consequencesOn={consequencesOn}
            setConsequencesOn={setConsequencesOn}
            jekyllScore={scores.jekyll}
            hydeScore={scores.hyde}
          />
        )}

        {view === "split" && (
          <ResultSplit
            dilemma={dilemma}
            jekyll={aiData.jekyll}
            hyde={aiData.hyde}
            jekyllCount={scores.jekyll}
            hydeCount={scores.hyde}
            consequencesOn={consequencesOn}
            onPick={handlePick}
            onNextLayout={() => setView("character")}
            onBack={() => setView("input")}
            onFinish={() => setView("final")}
          />
        )}

        {view === "character" && (
          <div className={`h-screen w-full relative transition-all duration-1000 ${
            scores.hyde > scores.jekyll ? "bg-red-950/20" : "bg-blue-950/20"
          }`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute top-0 left-0 right-0 z-50 flex justify-between px-10 py-10">
              <button onClick={() => setView("split")} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
                ← Merge Perspectives
              </button>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                Dominance:{" "}
                <span className={scores.hyde > scores.jekyll ? "text-red-500" : "text-blue-500"}>
                  {scores.hyde > scores.jekyll ? "Impulse" : "Reason"}
                </span>
              </div>
              <button onClick={() => setView("final")} className="bg-white text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                Finalize
              </button>
            </div>
            <div className="flex items-center justify-center h-full pt-10">
              <ResultCharacter
                type={scores.hyde > scores.jekyll ? "hyde" : "jekyll"}
                data={scores.hyde > scores.jekyll ? aiData.hyde : aiData.jekyll}
                isHovered={true}
                consequencesOn={consequencesOn}
                onPick={() => handlePick(scores.hyde > scores.jekyll ? "hyde" : "jekyll")}
              />
            </div>
          </div>
        )}

        {view === "final" && (
          <FinalScreen
            jekyllCount={scores.jekyll}
            hydeCount={scores.hyde}
            choices={choices}
            onRestart={resetAll}
          />
        )}
      </main>
    </div>
  );
}
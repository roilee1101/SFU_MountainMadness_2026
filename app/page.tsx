"use client";

import React, { useState } from "react";
import InputScreen from "@/components/InputScreen";
import ResultSplit from "@/components/ResultSplit";
import FinalScreen from "@/components/FinalScreen";

type ChoiceRecord = {
  dilemma: string;
  picked: "jekyll" | "hyde";
  novel?: string;
};

export default function Page() {
  /* ───────────────────────── STATE ───────────────────────── */

  const [dilemma, setDilemma] = useState("");
  const [currentNovel, setCurrentNovel] = useState<string | undefined>(
    undefined
  );

  const [view, setView] = useState<
    "input" | "split" | "character" | "final"
  >("input");

  const [scores, setScores] = useState({ jekyll: 0, hyde: 0 });
  const [choices, setChoices] = useState<ChoiceRecord[]>([]);
  const [consequencesOn, setConsequencesOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [aiData, setAiData] = useState({
    jekyll: { title: "", advice: "", short_term: "", long_term: "" },
    hyde: { title: "", advice: "", short_term: "", long_term: "" },
  });

  /* ───────────────────── PRESET SELECTION ───────────────────── */

  const handleDilemmaSelect = (prompt: string, novel?: string) => {
    setDilemma(prompt);
    setCurrentNovel(novel);
  };

  /* ───────────────────── AI GENERATION ───────────────────── */

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

      if (!res.ok) {
        console.error("API error:", data);
        return;
      }

      const fallback = {
        title: "",
        advice: "",
        short_term: "",
        long_term: "",
      };

      setAiData({
        jekyll: { ...fallback, ...(data.jekyll ?? {}) },
        hyde: { ...fallback, ...(data.hyde ?? {}) },
      });

      setView("split");
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ───────────────────── PICK HANDLING ───────────────────── */

  const handlePick = (side: "jekyll" | "hyde") => {
    setScores((prev) => ({
      ...prev,
      [side]: prev[side] + 1,
    }));

    setChoices((prev) => [
      ...prev,
      { dilemma, picked: side, novel: currentNovel },
    ]);

    setDilemma("");
    setCurrentNovel(undefined);
    setView("input");
  };

  /* ───────────────────── FINAL ANALYSIS ───────────────────── */

  const handleFinalize = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "final",
          choices,
          jekyllCount: scores.jekyll,
          hydeCount: scores.hyde,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Final analysis error:", data);
        return;
      }

      // FinalScreen will receive this via choices + scores,
      // or you can store separate finalAnalysis state if needed

      setView("final");
    } catch (err) {
      console.error("Final fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ───────────────────── RESET ───────────────────── */

  const resetAll = () => {
    setDilemma("");
    setCurrentNovel(undefined);
    setScores({ jekyll: 0, hyde: 0 });
    setChoices([]);
    setView("input");
  };

  /* ───────────────────── RENDER ───────────────────── */

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <main className="relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl">
            <div className="h-24 w-24 animate-spin rounded-full border-t-2 border-blue-500"></div>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[1em] text-white/40">
              Measuring Duality...
            </p>
          </div>
        )}

        {/* INPUT VIEW */}
        {view === "input" && (
          <InputScreen
            dilemma={dilemma}
            setDilemma={setDilemma}
            onGenerate={handleGenerate}
            onDilemmaSelect={handleDilemmaSelect}
            consequencesOn={consequencesOn}
            setConsequencesOn={setConsequencesOn}
            jekyllScore={scores.jekyll}
            hydeScore={scores.hyde}
          />
        )}

        {/* SPLIT VIEW */}
        {view === "split" && (
          <ResultSplit
            dilemma={dilemma}
            jekyll={aiData.jekyll}
            hyde={aiData.hyde}
            jekyllCount={scores.jekyll}
            hydeCount={scores.hyde}
            consequencesOn={consequencesOn}
            onPick={handlePick}
            onBack={() => setView("input")}
            onFinish={handleFinalize}
          />
        )}

        {/* FINAL VIEW */}
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
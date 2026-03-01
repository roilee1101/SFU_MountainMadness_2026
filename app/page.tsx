"use client";

import React, { useState } from "react";
import InputScreen from "@/components/InputScreen";
import ResultSplit from "@/components/ResultSplit";
import FinalScreen from "@/components/FinalScreen";

export default function Page() {
  /* ---------------- STATE ---------------- */

  const [dilemma, setDilemma] = useState("");
  const [view, setView] = useState<"input" | "split" | "character" | "final">(
    "input"
  );

  const [scores, setScores] = useState({ jekyll: 0, hyde: 0 });
  const [consequencesOn, setConsequencesOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [aiData, setAiData] = useState({
    jekyll: { title: "", advice: "", short_term: "", long_term: "" },
    hyde: { title: "", advice: "", short_term: "", long_term: "" },
  });

  /* ---------------- AI GENERATION ---------------- */
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

      // Safety fallback so UI never breaks
      const fallback = { title: "", advice: "", short_term: "", long_term: "" };

      setAiData({
        // if the model ever returns missing fields, we still render
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


  /* ---------------- SCORE HANDLING ---------------- */

  const handlePick = (side: "jekyll" | "hyde") => {
    setScores((prev) => ({
      ...prev,
      [side]: prev[side] + 1,
    }));

    setDilemma("");
    setView("input");
  };

  const resetAll = () => {
    setDilemma("");
    setScores({ jekyll: 0, hyde: 0 });
    setView("input");
  };

  /* ---------------- RENDER ---------------- */

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
            onFinish={() => setView("final")}
          />
        )}

        {/* CHARACTER VIEW (INLINE — NO ResultCharacter) */}
        {view === "character" && (() => {
          const isHydeDominant = scores.hyde > scores.jekyll;
          const isJekyll = !isHydeDominant;

          const data = isHydeDominant
            ? aiData.hyde
            : aiData.jekyll;

          return (
            <div
              className={`h-screen w-full relative overflow-hidden transition-all duration-1000 ${
                isHydeDominant ? "bg-red-950/20" : "bg-blue-950/20"
              }`}
            >
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 z-50 flex justify-between px-10 py-10">
                <button
                  onClick={() => setView("split")}
                  className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
                >
                  ← Merge Perspectives
                </button>

                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                  Dominance:{" "}
                  <span className={isHydeDominant ? "text-red-500" : "text-blue-500"}>
                    {isHydeDominant ? "Impulse" : "Reason"}
                  </span>
                </div>

                <button
                  onClick={() => setView("final")}
                  className="bg-white text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
                >
                  Finalize
                </button>
              </div>

              {/* Main Card */}
              <div className="flex items-center justify-center h-full pt-10 px-8">
                <div className="relative w-full max-w-5xl h-[78vh] rounded-[48px] border border-white/10 overflow-hidden">
                  {/* Image */}
                  <img
                    src={isHydeDominant ? "/hyde.png" : "/jekyll.png"}
                    alt="character"
                    className={`pointer-events-none absolute bottom-0 h-[85%] w-auto object-contain opacity-60 ${
                      isJekyll ? "left-[-3%]" : "right-[-3%]"
                    }`}
                  />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-16">
                    <h2
                      className={`text-xl font-black tracking-[0.4em] ${
                        isJekyll
                          ? "text-blue-400"
                          : "text-red-600 font-serif"
                      }`}
                    >
                      {isJekyll ? "JEKYLL" : "HYDE"}
                    </h2>

                    <h3
                      className={`mt-6 text-6xl font-extrabold leading-tight tracking-tighter ${
                        isJekyll ? "" : "font-serif uppercase"
                      }`}
                    >
                      {data.title}
                    </h3>

                    <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-3xl">
                      {data.advice}
                    </p>

                    {consequencesOn && (
                      <div className="mt-10 grid grid-cols-2 gap-10 pt-10 border-t border-white/10 max-w-3xl">
                        <div>
                          <div className="text-xs uppercase opacity-40">
                            Short-term
                          </div>
                          <p>{data.short_term}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase opacity-40">
                            Long-term
                          </div>
                          <p>{data.long_term}</p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        handlePick(isJekyll ? "jekyll" : "hyde")
                      }
                      className={`mt-8 w-fit rounded-full px-6 py-2 text-xs font-black uppercase tracking-widest ${
                        isJekyll ? "bg-blue-600" : "bg-red-700"
                      }`}
                    >
                      Pick {isJekyll ? "Reason" : "Impulse"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* FINAL VIEW */}
        {view === "final" && (
          <FinalScreen
            jekyllCount={scores.jekyll}
            hydeCount={scores.hyde}
            onRestart={resetAll}
          />
        )}
      </main>
    </div>
  );
}
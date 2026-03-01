"use client";

import React, { useState } from "react";
import InputScreen from "@/components/InputScreen";
import ResultSplit from "@/components/ResultSplit";
import FinalScreen from "@/components/FinalScreen";

// 선택 기록을 위한 타입 정의
type ChoiceRecord = {
  dilemma: string;
  picked: "jekyll" | "hyde";
  novel?: string;
};

export default function Page() {
  /* ───────────────────────── 1. 전역 상태 관리 ───────────────────────── */

  const [view, setView] = useState<"input" | "split" | "final">("input");
  const [dilemma, setDilemma] = useState("");
  const [currentNovel, setCurrentNovel] = useState<string | undefined>(undefined);
  
  // 점수 및 선택 기록
  const [scores, setScores] = useState({ jekyll: 0, hyde: 0 });
  const [choices, setChoices] = useState<ChoiceRecord[]>([]);
  
  // 설정 및 로딩 상태
  const [consequencesOn, setConsequencesOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // AI 분석 데이터 저장소
  const [aiData, setAiData] = useState({
    jekyll: { title: "", advice: "", short_term: "", long_term: "" },
    hyde: { title: "", advice: "", short_term: "", long_term: "" },
  });

  /* ───────────────────── 2. 주요 비즈니스 로직 ───────────────────── */

  // 소설 프리셋 선택 시
  const handleDilemmaSelect = (prompt: string, novel?: string) => {
    setDilemma(prompt);
    setCurrentNovel(novel);
  };

  // [중요] 고민 분석 시작 (API 호출)
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

      if (!res.ok) throw new Error("API error");

      setAiData({
        jekyll: { ...data.jekyll },
        hyde: { ...data.hyde },
      });
      setView("split"); // 분석 완료 후 Split 뷰로 이동
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // [중요] 사용자의 최종 선택 처리
  const handlePick = (side: "jekyll" | "hyde") => {
    setScores((prev) => ({ ...prev, [side]: prev[side] + 1 }));
    setChoices((prev) => [
      ...prev,
      { dilemma, picked: side, novel: currentNovel },
    ]);
    
    // 초기화 후 다시 입력 화면으로
    setDilemma("");
    setCurrentNovel(undefined);
    setView("input");
  };

  // [수정 포인트] Finish 버튼 클릭 시 최종 결과창으로 이동
  const handleFinalize = () => {
    // 이미 choices에 데이터가 쌓여있으므로, 
    // FinalScreen이 마운트될 때 내부 useEffect에서 API를 호출하도록 설계됨
    setView("final");
  };

  const resetAll = () => {
    setDilemma("");
    setScores({ jekyll: 0, hyde: 0 });
    setChoices([]);
    setView("input");
  };

  /* ───────────────────────── 3. 조건부 렌더링 ───────────────────────── */

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <main className="relative">
        
        {/* 전역 로딩 오버레이 */}
        {isLoading && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl">
            <div className="h-24 w-24 animate-spin rounded-full border-t-2 border-blue-500"></div>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[1em] text-white/40">
              Measuring Duality...
            </p>
          </div>
        )}

        {/* 뷰 전환 로직 */}
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
            // Finish 관련 Props 추가 연결
            onFinish={handleFinalize}
            hasChoices={choices.length > 0}
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
            onBack={() => setView("input")}
            onFinish={handleFinalize}
          />
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
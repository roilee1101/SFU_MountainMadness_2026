"use client";

import React, { useMemo, useState } from "react";

type Side = {
  title: string;
  advice: string;
  short_term?: string;
  long_term?: string;
};

type Props = {
  dilemma: string;
  hyde: Side | undefined;
  jekyll: Side | undefined;
  jekyllCount: number;
  hydeCount: number;
  consequencesOn: boolean;
  onPick: (pick: "jekyll" | "hyde") => void;
  onBack: () => void;
  onFinish: () => void;
};

const FALLBACK: Side = {
  title: "",
  advice: "",
  short_term: "",
  long_term: "",
};

export default function ResultSplit({
  dilemma,
  hyde,
  jekyll,
  jekyllCount,
  hydeCount,
  consequencesOn,
  onPick,
  onBack,
  onFinish,
}: Props) {
  const [hovered, setHovered] = useState<"jekyll" | "hyde" | null>(null);

  const safeJekyll = useMemo(
    () => ({ ...FALLBACK, ...(jekyll ?? {}) }),
    [jekyll]
  );

  const safeHyde = useMemo(
    () => ({ ...FALLBACK, ...(hyde ?? {}) }),
    [hyde]
  );

  const getAmbientColor = () => {
    if (jekyllCount > hydeCount) return "bg-blue-900/10";
    if (hydeCount > jekyllCount) return "bg-red-900/10";
    return "bg-neutral-900/40";
  };

  const onPanelKeyDown =
    (pick: "jekyll" | "hyde") =>
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPick(pick);
      }
    };

  return (
    <div
      className={`relative h-screen w-full overflow-hidden transition-colors duration-700 ${getAmbientColor()} bg-neutral-950 text-white`}
    >
      {/* Divider */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-px bg-white/10 z-10 pointer-events-none"
        style={{ transform: "translateX(-50%)" }}
      />

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-10">
        <div className="flex items-center gap-5 min-w-[260px]">
          <button
            onClick={onBack}
            className="rounded-full border border-white/10 bg-black/40 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em]
              hover:bg-white hover:text-black transition-colors duration-200"
          >
            ← Back
          </button>

          <div className="flex gap-3 text-[11px] font-black tracking-widest uppercase">
            <span className="text-blue-400">J: {jekyllCount}</span>
            <span className="text-white/20">·</span>
            <span className="text-red-400 font-serif">H: {hydeCount}</span>
          </div>
        </div>

        <p
          className="flex-1 text-center text-sm italic text-white/40 px-6 truncate max-w-[40%]"
          title={dilemma}
        >
          "{dilemma}"
        </p>

        <div className="min-w-[260px] flex justify-end">
          <button
            onClick={onFinish}
            className="rounded-full bg-white px-7 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-black
              hover:bg-white/85 transition-colors duration-200"
          >
            Finish
          </button>
        </div>
      </div>

      {/* Main Split */}
      <div className="flex h-full w-full">
        {/* Jekyll Panel */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={onPanelKeyDown("jekyll")}
          onClick={() => onPick("jekyll")}
          onMouseEnter={() => setHovered("jekyll")}
          onMouseLeave={() => setHovered(null)}
          className="relative h-full w-1/2 cursor-pointer select-none outline-none"
        >
          <img
            src="/jekyll.png"
            alt="Jekyll"
            className={`absolute bottom-0 left-[-5%] h-[75%] object-contain transition-all duration-700
              ${
                hovered === "jekyll"
                  ? "scale-105 opacity-70 translate-x-10"
                  : "opacity-35 grayscale"
              }`}
          />

          <div className="relative z-10 h-full flex flex-col justify-end p-16 max-w-[600px]">
            <h2 className="text-xl font-black tracking-[0.4em] text-blue-400">
              JEKYLL
            </h2>

            <h3 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tighter">
              {safeJekyll.title}
            </h3>

            <p className="mt-6 text-lg text-white/70 leading-relaxed">
              {safeJekyll.advice}
            </p>

            {consequencesOn && (
              <div className="mt-10 grid grid-cols-2 gap-8 pt-10 border-t border-white/10">
                <div>
                  <div className="text-[10px] uppercase opacity-40">
                    Short-term
                  </div>
                  <p>{safeJekyll.short_term}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase opacity-40">
                    Long-term
                  </div>
                  <p>{safeJekyll.long_term}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hyde Panel */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={onPanelKeyDown("hyde")}
          onClick={() => onPick("hyde")}
          onMouseEnter={() => setHovered("hyde")}
          onMouseLeave={() => setHovered(null)}
          className="relative h-full w-1/2 cursor-pointer select-none outline-none"
        >
          <img
            src="/hyde.png"
            alt="Hyde"
            className={`absolute bottom-0 right-[-5%] h-[75%] object-contain transition-all duration-700
              ${
                hovered === "hyde"
                  ? "scale-105 opacity-70 -translate-x-10"
                  : "opacity-35 grayscale"
              }`}
          />

          <div className="relative z-10 h-full flex flex-col justify-end items-end text-right p-16 max-w-[600px] ml-auto">
            <h2 className="text-xl font-black tracking-[0.4em] text-red-600 font-serif">
              HYDE
            </h2>

            <h3 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tighter font-serif uppercase">
              {safeHyde.title}
            </h3>

            <p className="mt-6 text-lg text-white/70 leading-relaxed">
              {safeHyde.advice}
            </p>

            {consequencesOn && (
              <div className="mt-10 grid grid-cols-2 gap-8 pt-10 border-t border-white/10 w-full">
                <div>
                  <div className="text-[10px] uppercase opacity-40">
                    Short-term
                  </div>
                  <p>{safeHyde.short_term}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase opacity-40">
                    Long-term
                  </div>
                  <p>{safeHyde.long_term}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
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

const FALLBACK: Side = { title: "", advice: "", short_term: "", long_term: "" };

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

  const safeJekyll = useMemo(() => ({ ...FALLBACK, ...(jekyll ?? {}) }), [jekyll]);
  const safeHyde = useMemo(() => ({ ...FALLBACK, ...(hyde ?? {}) }), [hyde]);

  const getAmbientColor = () => {
    if (jekyllCount > hydeCount) return "bg-blue-900/10";
    if (hydeCount > jekyllCount) return "bg-red-900/10";
    return "bg-neutral-900/40";
  };

  const onPanelKeyDown =
    (pick: "jekyll" | "hyde") => (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPick(pick);
      }
    };

  return (
    <div
      className={`relative h-screen w-full overflow-hidden transition-colors duration-1000 ${getAmbientColor()} bg-neutral-950 text-white`}
    >
      {/* Center Divider */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-[120] w-px bg-white/15" />

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-12">
        <div className="flex items-center gap-6 min-w-[320px]">
          <button
            onClick={onBack}
            className="rounded-full border border-white/10 bg-black/40 px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
          >
            ← Back
          </button>

          <div className="flex gap-4 text-[11px] font-black tracking-widest uppercase">
            <span className="text-blue-400">Jekyll: {jekyllCount}</span>
            <span className="text-red-500 font-serif">Hyde: {hydeCount}</span>
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 max-w-[35%] text-center italic opacity-60">
          “{dilemma}”
        </div>

        <div className="flex items-center gap-3 min-w-[320px] justify-end">
          <button
            onClick={onFinish}
            className="rounded-full bg-white px-8 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-black"
          >
            Finish
          </button>
        </div>
      </div>

      {/* Main Split (NO WIDTH ANIMATIONS → NO TEXT SHIFT) */}
      <div className="flex h-full w-full">
        {/* Jekyll Panel (click anywhere) */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={onPanelKeyDown("jekyll")}
          onClick={() => onPick("jekyll")}
          onMouseEnter={() => setHovered("jekyll")}
          onMouseLeave={() => setHovered(null)}
          className="relative h-full w-1/2 cursor-pointer select-none outline-none"
        >
          {/* Image (clickable) */}
          <img
            src="/jekyll.png"
            alt="jekyll"
            className={`absolute bottom-0 left-[-5%] h-[75%] w-auto object-contain transition-all duration-700 z-0
              ${
                hovered === "jekyll"
                  ? "scale-105 opacity-70 translate-x-10"
                  : "opacity-35 grayscale"
              }`}
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 z-[1] transition-opacity duration-700 ${
              hovered === "jekyll"
                ? "opacity-100 bg-gradient-to-tr from-blue-900/30 via-transparent to-transparent"
                : "opacity-70 bg-gradient-to-tr from-blue-900/15 via-transparent to-transparent"
            }`}
          />

          {/* Content (fixed position + fixed width → doesn’t move) */}
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
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300/40">
                    Short-term
                  </div>
                  <p className="text-sm text-white/80">{safeJekyll.short_term}</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300/40">
                    Long-term
                  </div>
                  <p className="text-sm text-white/80">{safeJekyll.long_term}</p>
                </div>
              </div>
            )}

            {/* Button still exists, but panel is clickable too */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPick("jekyll");
              }}
              className="mt-8 self-start rounded-full bg-blue-600 px-6 py-2 text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Pick Reason
            </button>
          </div>
        </div>

        {/* Hyde Panel (click anywhere) */}
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
            alt="hyde"
            className={`absolute bottom-0 right-[-5%] h-[75%] w-auto object-contain transition-all duration-700 z-0
              ${
                hovered === "hyde"
                  ? "scale-105 opacity-70 -translate-x-10"
                  : "opacity-35 grayscale"
              }`}
          />

          <div
            className={`absolute inset-0 z-[1] transition-opacity duration-700 ${
              hovered === "hyde"
                ? "opacity-100 bg-gradient-to-tl from-red-900/30 via-transparent to-transparent"
                : "opacity-70 bg-gradient-to-tl from-red-900/15 via-transparent to-transparent"
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
                  <div className="text-[10px] font-bold uppercase tracking-widest text-red-500/40">
                    Short-term
                  </div>
                  <p className="text-sm text-white/80">{safeHyde.short_term}</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-red-500/40">
                    Long-term
                  </div>
                  <p className="text-sm text-white/80">{safeHyde.long_term}</p>
                </div>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onPick("hyde");
              }}
              className="mt-8 self-end rounded-full bg-red-700 px-6 py-2 text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Pick Impulse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
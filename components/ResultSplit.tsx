"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

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

// ─── 이 부분이 누락되어 에러가 났던 것입니다 ───────────────────────────────────────
const FALLBACK: Side = { title: "", advice: "", short_term: "", long_term: "" };

// ─── ElevenLabs Voice IDs ──────────────────────────────────────────────────────
const VOICE_IDS = {
  jekyll: "21m00Tcm4TlvDq8ikWAM", 
  hyde:   "N2lVS1w4EtoT3dr4eOWO", 
};

const VOICE_SETTINGS = {
  jekyll: { stability: 0.92, similarity_boost: 0.80, style: 0.04, use_speaker_boost: true },
  hyde:   { stability: 0.08, similarity_boost: 0.90, style: 0.98, use_speaker_boost: true },
};

async function fetchElevenLabsAudio(text: string, type: "jekyll" | "hyde"): Promise<ArrayBuffer> {
  const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("Missing NEXT_PUBLIC_ELEVENLABS_API_KEY in .env.local");

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_IDS[type]}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: VOICE_SETTINGS[type],
    }),
  });

  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  return res.arrayBuffer();
}

type VoiceStatus = "idle" | "loading" | "playing" | "error";

function VoiceButton({
  status,
  onPlay,
  isJekyll,
}: {
  status: VoiceStatus;
  onPlay: () => void;
  isJekyll: boolean;
}) {
  const accent = isJekyll ? "text-blue-400" : "text-red-400";
  const glowClass = isJekyll
    ? "border-blue-400 bg-blue-400/20 shadow-[0_0_14px_rgba(96,165,250,0.55)]"
    : "border-red-400 bg-red-400/20 shadow-[0_0_14px_rgba(248,113,113,0.55)]";

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onPlay(); }}
      disabled={status === "loading"}
      className={`relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 disabled:cursor-not-allowed z-20
        ${status === "playing" ? glowClass
        : status === "error"   ? "border-red-500 bg-red-500/10"
        :                        "border-white/20 bg-white/5 hover:bg-white/15"}`}
    >
      {status === "loading" && (
        <svg className={`w-4 h-4 animate-spin ${accent}`} viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {status === "playing" && (
        <span className="flex items-end gap-[2px] h-4">
          {[40, 100, 60, 85, 40].map((h, i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full ${isJekyll ? "bg-blue-400" : "bg-red-400"}`}
              style={{ height: `${h}%`, animation: `pulse 0.6s ease-in-out ${i * 0.1}s infinite alternate` }}
            />
          ))}
        </span>
      )}
      {status === "idle" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${accent} opacity-70`}>
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
          <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
        </svg>
      )}
    </button>
  );
}

function useVoice(data: Side, type: "jekyll" | "hyde", consequencesOn: boolean) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef   = useRef<AudioBufferSourceNode | null>(null);

  const buildText = useCallback(() => {
    const base = `${data.title}. ${data.advice}`;
    if (!consequencesOn) return base;
    return `${base}. In the short term: ${data.short_term ?? ""}. In the long term: ${data.long_term ?? ""}.`;
  }, [data, consequencesOn]);

  const stop = useCallback(() => {
    sourceRef.current?.stop();
    sourceRef.current = null;
    setStatus("idle");
  }, []);

  const play = useCallback(async () => {
    if (status === "playing") { stop(); return; }
    if (status === "loading") return;

    setStatus("loading");
    try {
      const buffer = await fetchElevenLabsAudio(buildText(), type);
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") await ctx.resume();

      const decoded = await ctx.decodeAudioData(buffer);
      const source  = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);
      source.onended = () => setStatus("idle");
      sourceRef.current = source;
      source.start(0);
      setStatus("playing");
    } catch (e) {
      console.error(e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }, [status, buildText, stop, type]);

  return { status, play, stop };
}

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
  const safeHyde   = useMemo(() => ({ ...FALLBACK, ...(hyde   ?? {}) }), [hyde]);

  const jekyllVoice = useVoice(safeJekyll, "jekyll", consequencesOn);
  const hydeVoice   = useVoice(safeHyde,   "hyde",   consequencesOn);

  const getAmbientColor = () => {
    if (jekyllCount > hydeCount) return "bg-blue-900/10";
    if (hydeCount > jekyllCount) return "bg-red-900/10";
    return "bg-neutral-900/40";
  };

  const onPanelKeyDown = (pick: "jekyll" | "hyde") => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(pick); }
  };

  return (
    <div className={`relative h-screen w-full overflow-hidden transition-colors duration-700 ${getAmbientColor()} bg-neutral-950 text-white`}>
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/10 z-10 pointer-events-none" style={{ transform: "translateX(-50%)" }} />

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-10">
        <div className="flex items-center gap-5 min-w-[260px]">
          <button onClick={onBack} className="rounded-full border border-white/10 bg-black/40 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors duration-200">
            ← Back
          </button>
          <div className="flex gap-3 text-[11px] font-black tracking-widest uppercase">
            <span className="text-blue-400">J: {jekyllCount}</span>
            <span className="text-white/20">·</span>
            <span className="text-red-400 font-serif">H: {hydeCount}</span>
          </div>
        </div>

        <p className="flex-1 text-center text-xl italic text-white px-6 truncate max-w-[50%]" title={dilemma}>
          &quot;{dilemma}&quot;
        </p>

        {/* Finish 버튼은 UI에서 삭제됨 */}
        <div className="min-w-[260px] flex justify-end" />
      </div>

      <div className="flex h-full w-full">
        {/* Jekyll Panel */}
        <div role="button" tabIndex={0} onKeyDown={onPanelKeyDown("jekyll")} onClick={() => {jekyllVoice.stop(); hydeVoice.stop();onPick("jekyll")}} onMouseEnter={() => setHovered("jekyll")} onMouseLeave={() => setHovered(null)} className="relative h-full w-1/2 cursor-pointer select-none outline-none">
          <img src="/jekyll.png" alt="Jekyll" className={`absolute bottom-0 left-[-5%] h-[75%] object-contain transition-all duration-700 ${hovered === "jekyll" ? "scale-105 opacity-70 translate-x-10" : "opacity-35 grayscale"}`} />
          <div className="relative z-10 h-full flex flex-col justify-end p-16 max-w-[600px]">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-black tracking-[0.4em] text-blue-400">JEKYLL</h2>
              <VoiceButton status={jekyllVoice.status} onPlay={jekyllVoice.play} isJekyll={true} />
            </div>
            <h3 className="text-5xl font-extrabold leading-[1.1] tracking-tighter">{safeJekyll.title}</h3>
            <p className="mt-6 text-lg text-white/70 leading-relaxed">{safeJekyll.advice}</p>
            {consequencesOn && (
              <div className="mt-10 grid grid-cols-2 gap-8 pt-10 border-t border-white/10">
                <div><div className="text-[10px] uppercase opacity-40">Short-term</div><p>{safeJekyll.short_term}</p></div>
                <div><div className="text-[10px] uppercase opacity-40">Long-term</div><p>{safeJekyll.long_term}</p></div>
              </div>
            )}
          </div>
        </div>

        {/* Hyde Panel */}
        <div role="button" tabIndex={0} onKeyDown={onPanelKeyDown("hyde")} onClick={() => {jekyllVoice.stop(); hydeVoice.stop();onPick("hyde")}} onMouseEnter={() => setHovered("hyde")} onMouseLeave={() => setHovered(null)} className="relative h-full w-1/2 cursor-pointer select-none outline-none">
          <img src="/hyde.png" alt="Hyde" className={`absolute bottom-0 right-[-5%] h-[75%] object-contain transition-all duration-700 ${hovered === "hyde" ? "scale-105 opacity-70 -translate-x-10" : "opacity-35 grayscale"}`} />
          <div className="relative z-10 h-full flex flex-col justify-end items-end text-right p-16 max-w-[600px] ml-auto">
            <div className="flex items-center gap-3 mb-6">
              <VoiceButton status={hydeVoice.status} onPlay={hydeVoice.play} isJekyll={false} />
              <h2 className="text-xl font-black tracking-[0.4em] text-red-600 font-serif">HYDE</h2>
            </div>
            <h3 className="text-5xl font-extrabold leading-[1.1] tracking-tighter font-serif uppercase">{safeHyde.title}</h3>
            <p className="mt-6 text-lg text-white/70 leading-relaxed">{safeHyde.advice}</p>
            {consequencesOn && (
              <div className="mt-10 grid grid-cols-2 gap-8 pt-10 border-t border-white/10 w-full">
                <div><div className="text-[10px] uppercase opacity-40">Short-term</div><p>{safeHyde.short_term}</p></div>
                <div><div className="text-[10px] uppercase opacity-40">Long-term</div><p>{safeHyde.long_term}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
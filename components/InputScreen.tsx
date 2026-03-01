"use client";

import React, { useMemo, useRef, useState } from "react";
import { NOVEL_DILEMMAS } from "@/data/novelDilemmas";

interface Props {
  dilemma: string;
  setDilemma: (v: string) => void;
  onGenerate: () => void;
  onDilemmaSelect?: (prompt: string, novel?: string) => void;
  consequencesOn: boolean;
  setConsequencesOn: (v: boolean) => void;
  jekyllScore: number;
  hydeScore: number;
  onFinish: () => void;
  hasChoices: boolean;
}

type Tab = "custom" | "novels";

export default function InputScreen({
  dilemma,
  setDilemma,
  onGenerate,
  onDilemmaSelect,
  consequencesOn,
  setConsequencesOn,
  jekyllScore,
  hydeScore,
  onFinish,
  hasChoices,
}: Props) {
  const [tab, setTab] = useState<Tab>("custom");

  // --- Speech-to-text via ElevenLabs Scribe ---
  type MicStatus = "idle" | "recording" | "transcribing" | "error";
  const [micStatus, setMicStatus] = useState<MicStatus>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadFrameRef = useRef<number | null>(null);

  const SILENCE_THRESHOLD = 10;
  const SILENCE_DELAY_MS = 1800;

  const stopRecording = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (vadFrameRef.current) cancelAnimationFrame(vadFrameRef.current);
    mediaRecorderRef.current?.stop();
  };

  const handleMic = async () => {
    if (micStatus === "recording") { stopRecording(); return; }
    if (micStatus === "transcribing") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;
      const dataArray = new Uint8Array(analyser.fftSize);
      const checkSilence = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / dataArray.length) * 100;
        if (rms > SILENCE_THRESHOLD) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        } else {
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => { stopRecording(); }, SILENCE_DELAY_MS);
          }
        }
        vadFrameRef.current = requestAnimationFrame(checkSilence);
      };
      vadFrameRef.current = requestAnimationFrame(checkSilence);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (vadFrameRef.current) cancelAnimationFrame(vadFrameRef.current);
        audioCtx.close();
        stream.getTracks().forEach((t) => t.stop());
        setMicStatus("transcribing");
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", blob, "recording.webm");
          formData.append("model_id", "scribe_v1");
          const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ?? "";
          const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
            method: "POST",
            headers: { "xi-api-key": apiKey },
            body: formData,
          });
          if (!res.ok) throw new Error(`STT error ${res.status}`);
          const json = await res.json();
          const text: string = json.text ?? "";
          if (text.trim()) {
            const next = dilemma.trim() ? `${dilemma} ${text.trim()}` : text.trim();
            setDilemma(next);
          }          
          setMicStatus("idle");
        } catch (err) {
          console.error(err);
          setMicStatus("error");
          setTimeout(() => setMicStatus("idle"), 2500);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setMicStatus("recording");
    } catch (err) {
      console.error(err);
      setMicStatus("error");
      setTimeout(() => setMicStatus("idle"), 2500);
    }
  };

  const { jekyllRatio, hydeRatio } = useMemo(() => {
    const total = jekyllScore + hydeScore;
    if (total === 0) return { jekyllRatio: 0.5, hydeRatio: 0.5 };
    return { jekyllRatio: jekyllScore / total, hydeRatio: hydeScore / total };
  }, [jekyllScore, hydeScore]);

  const novels = useMemo(() => Array.from(new Set(NOVEL_DILEMMAS.map((d) => d.novel))).sort(), []);
  const dilemmasByNovel = useMemo(() => {
    const map = new Map<string, typeof NOVEL_DILEMMAS>();
    for (const d of NOVEL_DILEMMAS) {
      const arr = map.get(d.novel) ?? [];
      arr.push(d);
      map.set(d.novel, arr);
    }
    return map;
  }, []);

  const pickRandomFromNovel = (novel: string) => {
    const list = dilemmasByNovel.get(novel) ?? [];
    if (!list.length) return;
    const d = list[Math.floor(Math.random() * list.length)];
    setDilemma(d.prompt);
    onDilemmaSelect?.(d.prompt, d.novel);
    setTab("custom");
  };

  const pickRandomGlobal = () => {
    if (!NOVEL_DILEMMAS.length) return;
    const d = NOVEL_DILEMMAS[Math.floor(Math.random() * NOVEL_DILEMMAS.length)];
    setDilemma(d.prompt);
    onDilemmaSelect?.(d.prompt, d.novel);
    setTab("custom");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* 1. TOP BAR - Scores & Global Actions */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-12">
        <div className="flex gap-10 items-center">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 font-sans">Rationality</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter font-sans">Jekyll</span>
              <span className="text-3xl font-black text-blue-500 tabular-nums leading-none font-sans">{jekyllScore}</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10 mb-1" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 font-serif italic">Impulse</span>
            <div className={`flex items-baseline gap-2 transition-all duration-500 ${hydeRatio > jekyllRatio ? "scale-110" : "scale-100"}`}>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter font-serif">Hyde</span>
              <span className="text-3xl font-black text-red-600 font-serif tabular-nums italic leading-none">{hydeScore}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-3 h-3 rounded-full border border-white/20 transition-all ${consequencesOn ? "bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-transparent"}`} />
            <input type="checkbox" checked={consequencesOn} onChange={(e) => setConsequencesOn(e.target.checked)} className="hidden" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/70 transition-colors">Consequences</span>
          </label>

          {/* 우상단 Finish 버튼 */}
          {hasChoices && (
            <button
              onClick={onFinish}
              className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-black"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Final Analysis</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 transition-transform group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 pt-44 pb-24">
        <div className="mb-12 text-center">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter flex items-center justify-center select-none">
            <span className="text-blue-500 animate-[bounce_5s_infinite]">Jekyll</span>
            <span className="mx-8 text-2xl font-light italic text-neutral-800 lowercase font-serif font-sans">or</span>
            <span className="font-serif uppercase tracking-widest text-red-600 animate-[bounce_6s_infinite]">Hyde</span>
          </h1>
        </div>

        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button type="button" onClick={() => setTab("custom")} className={`rounded-full px-6 py-2 text-[11px] font-black uppercase tracking-[0.25em] transition-all ${tab === "custom" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}>Custom</button>
              <button type="button" onClick={() => setTab("novels")} className={`rounded-full px-6 py-2 text-[11px] font-black uppercase tracking-[0.25em] transition-all ${tab === "novels" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}>Novels</button>
            </div>
            <button type="button" onClick={pickRandomGlobal} className="rounded-full border border-white/10 bg-black/40 px-8 py-3 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all">Random</button>
          </div>

          <div className="mt-6">
            {tab === "custom" ? (
              <div className="w-full">
                <textarea value={dilemma} onChange={(e) => setDilemma(e.target.value)} placeholder="Describe your inner conflict..." className="h-64 w-full resize-none rounded-[40px] border border-white/5 bg-white/[0.02] p-12 text-2xl text-white placeholder:text-neutral-800 focus:outline-none focus:bg-white/[0.05] transition-all duration-700 shadow-inner" />
              </div>
            ) : (
              <div className="rounded-[40px] border border-white/10 bg-white/[0.02] p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {novels.map((novel) => (
                    <button key={novel} type="button" onClick={() => pickRandomFromNovel(novel)} className="group text-left rounded-[28px] border border-white/10 bg-black/30 p-5 transition-all hover:bg-white/10 hover:scale-[1.01] active:scale-[0.99]">
                      <div className="text-sm font-black tracking-tight text-white">{novel}</div>
                      <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/30 group-hover:text-white/40">Load random prompt</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. GENERATE ACTION */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={onGenerate}
              disabled={!dilemma.trim()}
              className="group relative overflow-hidden rounded-full bg-white px-24 py-6 text-sm font-black uppercase tracking-[0.5em] text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-10 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10">Analyse Duality</span>
              <div className="absolute inset-0 z-0 w-0 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 transition-all duration-700 group-hover:w-full" />
            </button>

            <button
              onClick={handleMic}
              disabled={micStatus === "transcribing"}
              className={`relative flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-300 ${micStatus === "recording" ? "border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse" : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"}`}
            >
              {micStatus === "transcribing" ? (
                <div className="w-5 h-5 animate-spin border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${micStatus === "recording" ? "text-red-400" : "text-white/60"}`}>
                  <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                  <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

type Props = {
  dilemma: string;
  setDilemma: (v: string) => void;
  onGenerate: () => void;
};

export default function InputScreen({ dilemma, setDilemma, onGenerate }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#E8E4D8]">
      {/* Soft blobs */}
      <div className="pointer-events-none absolute left-[-220px] top-[-120px] h-[620px] w-[620px] rounded-full bg-blue-400/40 blur-3xl" />
      <div className="pointer-events-none absolute right-[-220px] top-[-120px] h-[620px] w-[620px] rounded-full bg-red-400/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6">
        {/* Title */}
        <h1 className="mb-8 text-5xl font-light tracking-tight">
          <span className="text-blue-600">Jekyll</span>{" "}
          <span className="text-neutral-900/70">or</span>{" "}
          <span className="text-red-600 font-semibold">HYDE</span>
        </h1>

        {/* Input */}
        <div className="w-full max-w-2xl">
          <div className="border border-neutral-800 bg-black/10">
            <textarea
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              placeholder="Type your question"
              className="h-28 w-full resize-none bg-transparent p-6 text-2xl text-neutral-900 placeholder:text-neutral-900/50 focus:outline-none"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onGenerate}
              disabled={!dilemma.trim()}
              className="border border-neutral-800 bg-transparent px-6 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-[#E8E4D8] disabled:opacity-40"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
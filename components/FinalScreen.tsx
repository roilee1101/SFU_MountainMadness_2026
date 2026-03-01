"use client";

type Props = {
  jekyllCount: number;
  hydeCount: number;
  onRestart: () => void;
};

export default function FinalScreen({ jekyllCount, hydeCount, onRestart }: Props) {
  const total = jekyllCount + hydeCount;
  const winner =
    jekyllCount > hydeCount ? "JEKYLL" : hydeCount > jekyllCount ? "HYDE" : "BALANCED";

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute left-[-240px] top-[-170px] h-[700px] w-[700px] rounded-full bg-blue-500/25 blur-[160px]" />
      <div className="pointer-events-none absolute right-[-240px] top-[-170px] h-[700px] w-[700px] rounded-full bg-red-500/25 blur-[160px]" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
        <div className="w-full rounded-3xl border border-white/15 bg-white/5 p-8 text-center">
          <div className="text-sm text-white/60">Result</div>
          <h1 className="mt-2 text-4xl font-semibold">
            You are more of{" "}
            {winner === "JEKYLL" ? (
              <span className="text-blue-300">JEKYLL</span>
            ) : winner === "HYDE" ? (
              <span className="text-red-300">HYDE</span>
            ) : (
              <span className="text-white/80">a BALANCED</span>
            )}{" "}
            person
          </h1>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-blue-300 font-semibold">JEKYLL</div>
              <div className="mt-2 text-3xl font-semibold">{jekyllCount}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-red-300 font-semibold">HYDE</div>
              <div className="mt-2 text-3xl font-semibold">{hydeCount}</div>
            </div>
          </div>

          <div className="mt-4 text-sm text-white/60">
            {total === 0 ? "No picks yet." : `Based on ${total} pick${total === 1 ? "" : "s"}.`}
          </div>

          <button
            onClick={onRestart}
            className="mt-6 rounded-xl border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
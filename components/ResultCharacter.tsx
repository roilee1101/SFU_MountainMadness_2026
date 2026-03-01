"use client";

type Side = {
  title: string;
  advice: string;
  short_term?: string;
  long_term?: string;
};

type Props = {
  dilemma: string;
  hyde: Side;
  jekyll: Side;
  consequencesOn: boolean;
  onPick: (pick: "jekyll" | "hyde") => void;
  onBackToLayoutA: () => void;
  onFinish: () => void;
};

export default function ResultCharacter({
  dilemma,
  hyde,
  jekyll,
  consequencesOn,
  onPick,
  onBackToLayoutA,
  onFinish,
}: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* blobs */}
      <div className="pointer-events-none absolute left-[-240px] top-[-170px] h-[700px] w-[700px] rounded-full bg-blue-500/25 blur-[160px]" />
      <div className="pointer-events-none absolute right-[-240px] top-[-170px] h-[700px] w-[700px] rounded-full bg-red-500/25 blur-[160px]" />

      {/* header */}
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <button
          onClick={onBackToLayoutA}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
        >
          ← Layout A
        </button>

        <div className="min-w-0 text-center">
          <div className="text-sm text-white/60">Your prompt</div>
          <div className="truncate text-base text-white/90">{dilemma}</div>
        </div>

        <button
          onClick={onFinish}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
        >
          Finish
        </button>
      </div>

      {/* two tall panels */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-10 md:grid-cols-2">
        {/* Jekyll panel */}
        <div className="relative h-[70vh] overflow-hidden rounded-2xl border border-white/15 bg-white/5">
          {/* big character placeholder */}
          <img
                src="/jekyll.png"
                alt="Jekyll"
                className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-auto opacity-60 z-0"
            />

          <div className="absolute right-0 top-0 flex h-full w-[55%] flex-col p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-300">JEKYLL</h2>
              <button
                onClick={() => onPick("jekyll")}
                className="rounded-full bg-blue-500/20 px-4 py-2 text-sm hover:bg-blue-500/30"
              >
                Pick
              </button>
            </div>

            <h3 className="mt-4 text-2xl font-semibold">{jekyll.title ?? "—"}</h3>
            <p className="mt-3 whitespace-pre-wrap text-white/85">
              {jekyll.advice ?? "—"}
            </p>

            {consequencesOn && (
              <div className="mt-auto rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-semibold text-white/80">Consequences</div>
                <div className="mt-2 text-sm text-white/75">
                  <span className="font-semibold text-white/90">Short-term:</span>{" "}
                  {jekyll.short_term ?? "—"}
                </div>
                <div className="mt-2 text-sm text-white/75">
                  <span className="font-semibold text-white/90">Long-term:</span>{" "}
                  {jekyll.long_term ?? "—"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hyde panel */}
        <div className="relative h-[70vh] overflow-hidden rounded-2xl border border-white/15 bg-white/5">
          {/* big character placeholder */}
          <img
                src="/hyde.png"
                alt="Hyde"
                className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-auto opacity-60 z-0"
            />

          <div className="absolute left-0 top-0 flex h-full w-[55%] flex-col p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-red-300">HYDE</h2>
              <button
                onClick={() => onPick("hyde")}
                className="rounded-full bg-red-500/20 px-4 py-2 text-sm hover:bg-red-500/30"
              >
                Pick
              </button>
            </div>

            <h3 className="mt-4 text-2xl font-semibold">{hyde.title ?? "—"}</h3>
            <p className="mt-3 whitespace-pre-wrap text-white/85">
              {hyde.advice ?? "—"}
            </p>

            {consequencesOn && (
              <div className="mt-auto rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-semibold text-white/80">Consequences</div>
                <div className="mt-2 text-sm text-white/75">
                  <span className="font-semibold text-white/90">Short-term:</span>{" "}
                  {hyde.short_term ?? "—"}
                </div>
                <div className="mt-2 text-sm text-white/75">
                  <span className="font-semibold text-white/90">Long-term:</span>{" "}
                  {hyde.long_term ?? "—"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
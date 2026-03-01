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
  onNextLayout: () => void;
  onBack: () => void;
  onFinish: () => void;
};

export default function ResultSplit({
  dilemma,
  hyde,
  jekyll,
  consequencesOn,
  onPick,
  onNextLayout,
  onBack,
  onFinish,
}: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* blobs */}
      <div className="pointer-events-none absolute left-[-220px] top-[-140px] h-[620px] w-[620px] rounded-full bg-blue-500/25 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-220px] top-[-140px] h-[620px] w-[620px] rounded-full bg-red-500/25 blur-[140px]" />

      {/* top bar */}
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <button
          onClick={onBack}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
        >
          ← Back
        </button>

        <div className="min-w-0 text-center">
          <div className="text-sm text-white/60">Your prompt</div>
          <div className="truncate text-base text-white/90">{dilemma}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNextLayout}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Layout B →
          </button>
          <button
            onClick={onFinish}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Finish
          </button>
        </div>
      </div>

      {/* split */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-10 md:grid-cols-2">
        {/* Jekyll */}
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6">
          {/* character placeholder — replace later with <img src="/jekyll.png" .../> */}
          <img
                src="/jekyll.png"
                alt="Jekyll"
                className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-auto opacity-60 z-0"
            />

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blue-300">JEKYLL</h2>
            <button
              onClick={() => onPick("jekyll")}
              className="rounded-full bg-blue-500/20 px-4 py-2 text-sm hover:bg-blue-500/30"
            >
              Pick Jekyll
            </button>
          </div>

          <h3 className="mt-4 text-2xl font-semibold">{jekyll.title ?? "—"}</h3>
          <p className="mt-3 whitespace-pre-wrap text-white/85">
            {jekyll.advice ?? "—"}
          </p>

          {consequencesOn && (
            <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
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

        {/* Hyde */}
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6">
          {/* character placeholder — replace later with <img src="/hyde.png" .../> */}
         <img
                src="/hyde.png"
                alt="Hyde"
                className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-auto opacity-60 z-0"
            />

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-red-300">HYDE</h2>
            <button
              onClick={() => onPick("hyde")}
              className="rounded-full bg-red-500/20 px-4 py-2 text-sm hover:bg-red-500/30"
            >
              Pick Hyde
            </button>
          </div>

          <h3 className="mt-4 text-2xl font-semibold">{hyde.title ?? "—"}</h3>
          <p className="mt-3 whitespace-pre-wrap text-white/85">
            {hyde.advice ?? "—"}
          </p>

          {consequencesOn && (
            <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
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
  );
}
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
  onFinish: () => void;
};

export default function ResultCharacter({
  dilemma,
  hyde,
  jekyll,
  consequencesOn,
  onPick,
  onFinish,
}: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* ================= FULL PAGE BACKGROUND IMAGES ================= */}
      <div className="pointer-events-none absolute inset-0">
        {/* Left Half – Jekyll */}
        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <img
            src="/jekyll.png"
            alt="Jekyll background"
            className="absolute inset-y-0 left-[-16%] h-full w-auto object-contain opacity-18 scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/25 via-black/50 to-black/80" />
        </div>

        {/* Right Half – Hyde */}
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <img
            src="/hyde.png"
            alt="Hyde background"
            className="absolute inset-y-0 right-[-16%] h-full w-auto object-contain opacity-18 scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-red-500/25 via-black/50 to-black/80" />
        </div>

        {/* Soft glow accents */}
        <div className="absolute left-[-240px] top-[-170px] h-[720px] w-[720px] rounded-full bg-blue-500/20 blur-[170px]" />
        <div className="absolute right-[-240px] top-[-170px] h-[720px] w-[720px] rounded-full bg-red-500/20 blur-[170px]" />
      </div>

      {/* ================= HEADER (center prompt, right finish) ================= */}
      <div className="relative mx-auto flex max-w-6xl items-center justify-center px-6 py-6">
        <div className="min-w-0 text-center">
          <div className="text-sm text-white/60">Your prompt</div>
          <div className="truncate text-base text-white/90">{dilemma}</div>
        </div>

        <div className="absolute right-6">
          <button
            onClick={onFinish}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Finish
          </button>
        </div>
      </div>

      {/* ================= PANELS ================= */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-10 md:grid-cols-2">
        {/* ================= JEKYLL PANEL ================= */}
        <button
          onClick={() => onPick("jekyll")}
          className="group relative h-[75vh] overflow-hidden rounded-2xl border border-white/15 bg-white/5 text-left transition-all hover:scale-[1.01] hover:border-blue-400/40"
        >
          <div className="no-scrollbar flex h-full flex-col p-8 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-300">JEKYLL</h2>
              <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm opacity-70 group-hover:opacity-100">
                Select
              </span>
            </div>

            <h3 className="mt-6 text-4xl font-semibold leading-tight">
              {jekyll.title ?? "—"}
            </h3>

            <p className="mt-6 whitespace-pre-wrap text-white/85 text-lg leading-relaxed">
              {jekyll.advice ?? "—"}
            </p>

            {consequencesOn && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm">
                <div className="text-sm font-semibold text-white/80">Consequences</div>
                <div className="mt-3 text-sm text-white/75">
                  <span className="font-semibold text-white/90">Short-term:</span>{" "}
                  {jekyll.short_term ?? "—"}
                </div>
                <div className="mt-3 text-sm text-white/75">
                  <span className="font-semibold text-white/90">Long-term:</span>{" "}
                  {jekyll.long_term ?? "—"}
                </div>
              </div>
            )}
          </div>
        </button>

        {/* ================= HYDE PANEL ================= */}
        <button
          onClick={() => onPick("hyde")}
          className="group relative h-[75vh] overflow-hidden rounded-2xl border border-white/15 bg-white/5 text-left transition-all hover:scale-[1.01] hover:border-red-400/40"
        >
          <div className="no-scrollbar flex h-full flex-col p-8 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-red-300">HYDE</h2>
              <span className="rounded-full bg-red-500/20 px-4 py-2 text-sm opacity-70 group-hover:opacity-100">
                Select
              </span>
            </div>

            <h3 className="mt-6 text-4xl font-semibold leading-tight">
              {hyde.title ?? "—"}
            </h3>

            <p className="mt-6 whitespace-pre-wrap text-white/85 text-lg leading-relaxed">
              {hyde.advice ?? "—"}
            </p>

            {consequencesOn && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm">
                <div className="text-sm font-semibold text-white/80">Consequences</div>
                <div className="mt-3 text-sm text-white/75">
                  <span className="font-semibold text-white/90">Short-term:</span>{" "}
                  {hyde.short_term ?? "—"}
                </div>
                <div className="mt-3 text-sm text-white/75">
                  <span className="font-semibold text-white/90">Long-term:</span>{" "}
                  {hyde.long_term ?? "—"}
                </div>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
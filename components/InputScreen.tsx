"use client";

type Props = {
  dilemma: string;
  setDilemma: (v: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  cooldownSeconds: number;
};

export default function InputScreen({
  dilemma,
  setDilemma,
  onGenerate,
  isLoading,
  cooldownSeconds,
}: Props) {
  const canGenerate =
    !isLoading && cooldownSeconds === 0 && dilemma.trim().length > 0;

  const buttonLabel = isLoading
    ? "Generating..."
    : cooldownSeconds > 0
    ? `Try again in ${cooldownSeconds}s`
    : "Generate";

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <img
            src="/jekyll.png"
            alt="Jekyll background"
            className="absolute inset-y-0 left-[-16%] h-full w-auto object-contain opacity-10 scale-[1.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-black/60 to-black/90" />
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <img
            src="/hyde.png"
            alt="Hyde background"
            className="absolute inset-y-0 right-[-16%] h-full w-auto object-contain opacity-10 scale-[1.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-red-500/20 via-black/60 to-black/90" />
        </div>
        <div className="absolute left-[-240px] top-[-170px] h-[720px] w-[720px] rounded-full bg-blue-500/16 blur-[170px]" />
        <div className="absolute right-[-240px] top-[-170px] h-[720px] w-[720px] rounded-full bg-red-500/16 blur-[170px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-12">
        <div className="w-full rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight">
              <span className="text-blue-300">JEKYLL</span>{" "}
              <span className="text-white/60">vs</span>{" "}
              <span className="text-red-300">HYDE</span>
            </h1>
            <p className="mt-3 text-white/70">
              Describe a dilemma. We’ll generate two paths: one selfless, one selfish.
            </p>
            <p className="mt-2 text-xs text-white/45">
              Tip: Press <span className="text-white/70">Enter</span> to generate •{" "}
              <span className="text-white/70">Shift+Enter</span> for a new line
            </p>
          </div>

          {/* Form submit makes Enter work reliably */}
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (canGenerate) onGenerate();
            }}
          >
            <textarea
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              onKeyDown={(e) => {
                // Prevent Enter from adding a newline unless Shift is held
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  if (canGenerate) onGenerate();
                }
              }}
              placeholder="Example: My friend copied my homework and wants me to cover for them…"
              className="min-h-[140px] w-full resize-none rounded-2xl border border-white/15 bg-black/40 p-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
            />

            <div className="mt-4 flex items-center justify-center">
              <button
                type="submit"
                disabled={!canGenerate}
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-2 text-sm hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {buttonLabel}
              </button>
            </div>

            {/* Optional helper line */}
            <div className="mt-3 text-center text-xs text-white/45">
              {cooldownSeconds > 0
                ? "Rate limit protection is active."
                : isLoading
                ? "Hang tight—building both paths."
                : "Your choices aren’t saved. This is just for your session."}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
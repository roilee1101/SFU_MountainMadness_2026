"use client";

type Props = {
  jekyllCount: number;
  hydeCount: number;
  onRestart: () => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function FinalScreen({ jekyllCount, hydeCount, onRestart }: Props) {
  const total = jekyllCount + hydeCount;
  const jPct = total === 0 ? 50 : Math.round((jekyllCount / total) * 100);
  const hPct = 100 - jPct;

  const isBalanced = Math.abs(jPct - hPct) <= 5;

  const verdict = isBalanced ? "BALANCED" : jPct > hPct ? "JEKYLL" : "HYDE";

  const jWins = !isBalanced && jPct > hPct;
  const hWins = !isBalanced && hPct > jPct;

  // Visibility tuning (winner pops via opacity + color, NOT blur)
  const jImgOpacity = isBalanced ? 0.18 : jWins ? 0.34 : 0.10;
  const hImgOpacity = isBalanced ? 0.18 : hWins ? 0.34 : 0.10;

  // Winner gets a stronger "presence" filter; balanced keeps both equal
  const jFilter = isBalanced
    ? "saturate(1.05) contrast(1.02)"
    : jWins
    ? "saturate(1.25) contrast(1.08)"
    : "saturate(0.85) contrast(0.98)";

  const hFilter = isBalanced
    ? "saturate(1.05) contrast(1.02)"
    : hWins
    ? "saturate(1.25) contrast(1.08)"
    : "saturate(0.85) contrast(0.98)";

  // Percentage-based wash across the FULL screen:
  // blue covers 0..jPct, red covers jPct..100
  const split = clamp(jPct, 0, 100);

  // Wash strength: stronger overall, winner slightly stronger, balanced equal
  const washBase = isBalanced ? 0.34 : 0.30;
  const jBoost = isBalanced ? 0 : jWins ? 0.10 : -0.06;
  const hBoost = isBalanced ? 0 : hWins ? 0.10 : -0.06;

  const blueA = clamp(washBase + jBoost, 0.18, 0.55);
  const redA = clamp(washBase + hBoost, 0.18, 0.55);

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* ===== Background (percentage-based split across whole screen) ===== */}
      <div className="pointer-events-none absolute inset-0">
        {/* Character images (no blur) */}
        <img
          src="/jekyll.png"
          alt="Jekyll background"
          className="absolute inset-y-0 left-[-10%] h-full w-auto object-contain"
          style={{
            opacity: jImgOpacity,
            filter: jFilter,
            transform: "scale(1.08)",
          }}
        />
        <img
          src="/hyde.png"
          alt="Hyde background"
          className="absolute inset-y-0 right-[-10%] h-full w-auto object-contain"
          style={{
            opacity: hImgOpacity,
            filter: hFilter,
            transform: "scale(1.08)",
          }}
        />

        {/* Score-based color wash (this is the “Blue 25% | Red 75%” effect) */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right,
              rgba(59,130,246,1) 0%,
              rgba(59,130,246,1) ${split}%,
              rgba(239,68,68,1) ${split}%,
              rgba(239,68,68,1) 100%
            )`,
            opacity: 0.18,
          }}
        />

        {/* Darkening + vignette so text stays readable */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55" />

        {/* Add “winner emphasis” by tinting winner’s side slightly more */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right,
              rgba(59,130,246,1) 0%,
              rgba(59,130,246,1) ${split}%,
              rgba(239,68,68,1) ${split}%,
              rgba(239,68,68,1) 100%
            )`,
            opacity: 0, // base off; we layer side tints below instead
          }}
        />

        {/* Side tints (separate so BALANCED is truly equal) */}
        <div
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            background:
              "linear-gradient(to right, rgba(59,130,246,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 100%)",
            opacity: blueA,
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{
            background:
              "linear-gradient(to left, rgba(239,68,68,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 100%)",
            opacity: redA,
          }}
        />

        {/* Divider exactly at the score split */}
        <div
          className="absolute inset-y-0 w-px bg-white/10"
          style={{ left: `${split}%` }}
        />

        {/* Soft glows */}
        <div className="absolute left-[-260px] top-[-200px] h-[760px] w-[760px] rounded-full bg-blue-500/14 blur-[180px]" />
        <div className="absolute right-[-260px] top-[-200px] h-[760px] w-[760px] rounded-full bg-red-500/14 blur-[180px]" />
      </div>

      {/* ===== Center panel ===== */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
        <div className="relative w-full rounded-3xl border border-white/15 bg-white/6 p-10 shadow-2xl">
          {/* lighter glass so winner background stays visible */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-black/30" />
          <div className="pointer-events-none absolute inset-0 rounded-3xl backdrop-blur-[6px]" />

          <div className="relative">
            <div className="text-center">
              <div className="text-xs tracking-widest text-white/60">Final Verdict</div>

              <h1 className="mt-3 text-5xl font-semibold tracking-tight">
                You lean{" "}
                <span
                  className={
                    verdict === "JEKYLL"
                      ? "text-blue-300"
                      : verdict === "HYDE"
                      ? "text-red-300"
                      : "text-white/80"
                  }
                >
                  {verdict}
                </span>
              </h1>

              <div className="mt-3 text-sm text-white/65">
                Based on <span className="font-semibold text-white/80">{total}</span>{" "}
                {total === 1 ? "choice" : "choices"}.
              </div>
            </div>

            {/* Labels */}
            <div className="mt-10 flex items-center justify-between text-sm text-white/70">
              <div>
                Jekyll:{" "}
                <span className="font-semibold text-white/85">
                  {jekyllCount} ({jPct}%)
                </span>
              </div>
              <div>
                Hyde:{" "}
                <span className="font-semibold text-white/85">
                  {hydeCount} ({hPct}%)
                </span>
              </div>
            </div>

            {/* Bar */}
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div className="flex h-full w-full">
                <div className="h-full bg-blue-500/70" style={{ width: `${jPct}%` }} />
                <div className="h-full bg-red-500/70" style={{ width: `${hPct}%` }} />
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={onRestart}
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-2 text-sm hover:bg-white/10"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
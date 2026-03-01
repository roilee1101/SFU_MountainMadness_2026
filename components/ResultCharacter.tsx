"use client";

type Side = {
  title: string;
  advice: string;
  short_term?: string;
  long_term?: string;
};

type Props = {
  type: "jekyll" | "hyde";
  data: Side;
  isHovered: boolean;
  consequencesOn: boolean;
  onPick: () => void;
};

export default function ResultCharacter({ type, data, isHovered, consequencesOn, onPick }: Props) {
  const isJekyll = type === "jekyll";

  return (
    <div
      className={`relative h-full flex flex-col overflow-hidden
        ${isJekyll ? "border-r border-white/5" : ""}`}
      style={{ padding: "4rem" }}
    >
      {/* Character Image — GPU-composited, no layout impact */}
      <img
        src={`/${type}.png`}
        alt={isJekyll ? "Jekyll — the rational self" : "Hyde — the impulsive self"}
        className={`pointer-events-none absolute bottom-0 w-auto object-contain z-0 select-none
          ${isJekyll ? "left-[-5%]" : "right-[-5%]"}`}
        style={{
          height: "75%",
          opacity: isHovered ? 0.55 : 0.15,
          filter: isHovered ? "none" : "grayscale(1)",
          transform: isHovered
            ? `scale(1.04) translateX(${isJekyll ? "28px" : "-28px"})`
            : "scale(1) translateX(0)",
          transition: "opacity 700ms ease, filter 700ms ease, transform 700ms ease",
          willChange: "transform, opacity, filter",
        }}
      />

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-[1] pointer-events-none
          ${isJekyll
            ? "bg-gradient-to-tr from-blue-900/25 via-transparent to-transparent"
            : "bg-gradient-to-tl from-red-900/25 via-transparent to-transparent"}`}
      />

      {/* ── Content — fills height, scrollable, anchored to TOP not bottom ── */}
      <div
        className={`relative z-10 flex flex-col h-full overflow-y-auto
          ${!isJekyll ? "items-end text-right" : "items-start"}
          scrollbar-none`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Spacer pushes content to vertical center */}
        <div className="flex-1 min-h-[3rem]" />

        {/* Fixed-width inner box so text never reflows on width change */}
        <div className="w-[380px] max-w-full shrink-0">

          {/* Header row */}
          <div className={`flex items-center gap-4 mb-6 ${!isJekyll ? "justify-end" : ""}`}>
            {isJekyll && (
              <h2 className="text-xl font-black tracking-[0.4em] text-blue-400 shrink-0">JEKYLL</h2>
            )}
            <button
              onClick={onPick}
              aria-label={`Choose ${isJekyll ? "Reason (Jekyll)" : "Impulse (Hyde)"}`}
              className={`rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest shrink-0
                transition-transform duration-200 hover:scale-105 active:scale-95
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                ${isJekyll
                  ? "bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-400"
                  : "bg-red-700 hover:bg-red-600 focus-visible:outline-red-400"}`}
            >
              Pick {isJekyll ? "Reason" : "Impulse"}
            </button>
            {!isJekyll && (
              <h2 className="text-xl font-black tracking-[0.4em] text-red-500 font-serif shrink-0">HYDE</h2>
            )}
          </div>

          {/* Title — fixed pixel height, never reflows siblings */}
          <h3
            className={`font-extrabold leading-[1.1] tracking-tighter mb-5
              ${!isJekyll ? "font-serif uppercase" : ""} text-4xl`}
            style={{ height: "4.4em", overflow: "hidden" }}
          >
            {data.title}
          </h3>

          {/* Advice — full text, no clamp */}
          <p className="text-base text-white/65 font-light leading-relaxed">
            {data.advice}
          </p>

          {/* Consequences */}
          {consequencesOn && (
            <div
              className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-6"
              style={{
                opacity: isHovered ? 1 : 0,
                transition: "opacity 400ms ease",
              }}
              aria-hidden={!isHovered}
            >
              <div className="space-y-1">
                <div className={`text-[10px] font-bold uppercase tracking-widest
                  ${isJekyll ? "text-blue-300/50" : "text-red-400/50"}`}>
                  Short-term
                </div>
                <p className="text-sm text-white/75 leading-snug">{data.short_term}</p>
              </div>
              <div className="space-y-1">
                <div className={`text-[10px] font-bold uppercase tracking-widest
                  ${isJekyll ? "text-blue-300/50" : "text-red-400/50"}`}>
                  Long-term
                </div>
                <p className="text-sm text-white/75 leading-snug">{data.long_term}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom spacer */}
        <div className="flex-1 min-h-[3rem]" />
      </div>
    </div>
  );
}
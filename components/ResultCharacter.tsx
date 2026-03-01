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
    <div className={`relative h-full flex flex-col justify-end p-16 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden
      ${isJekyll ? "border-r border-white/5" : "items-end text-right"}`}>
      
      {/* Character Image: Using scale and opacity to avoid layout shift */}
      <img
        src={`/${type}.png`}
        alt={type}
        className={`pointer-events-none absolute bottom-0 h-[75%] w-auto object-contain transition-all duration-1000 z-0
          ${isJekyll ? "left-[-5%]" : "right-[-5%]"}
          ${isHovered ? "scale-105 opacity-60 " + (isJekyll ? "translate-x-10" : "-translate-x-10") : "opacity-20 grayscale"}`}
      />

      {/* Aesthetic Overlay Gradients */}
      <div className={`absolute inset-0 z-[1] ${isJekyll ? "bg-gradient-to-tr from-blue-900/20" : "bg-gradient-to-tl from-red-900/20"} via-transparent to-transparent`} />

      {/* Main Content Area: NO 'Back' button here to solve duplication */}
      <div className="relative z-10 space-y-6 max-w-lg">
        <div className={`flex items-center gap-4 ${!isJekyll && "justify-end"}`}>
          {isJekyll && <h2 className="text-xl font-black tracking-[0.4em] text-blue-400">JEKYLL</h2>}
          <button 
            onClick={onPick}
            className={`rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-transform ${isJekyll ? "bg-blue-600" : "bg-red-700"}`}
          >
            Pick {isJekyll ? "Reason" : "Impulse"}
          </button>
          {!isJekyll && <h2 className="text-xl font-black tracking-[0.4em] text-red-600 font-serif">HYDE</h2>}
        </div>

        {/* Fixed Font Size: Prevents text-reflow stuttering */}
        <h3 className={`text-5xl font-extrabold leading-[1.1] tracking-tighter ${!isJekyll && "font-serif uppercase"}`}>
          {data.title}
        </h3>
        <p className="text-lg text-white/70 font-light leading-relaxed line-clamp-3">
          {data.advice}
        </p>

        {/* Consequences Section */}
        {consequencesOn && (
          <div className={`mt-8 grid grid-cols-2 gap-8 pt-8 border-t border-white/10 ${!isJekyll && "w-full"}`}>
            <div className="space-y-1">
              <div className={`text-[10px] font-bold uppercase tracking-widest ${isJekyll ? "text-blue-300/40" : "text-red-500/40"}`}>Short-term</div>
              <p className="text-sm text-white/80">{data.short_term}</p>
            </div>
            <div className="space-y-1">
              <div className={`text-[10px] font-bold uppercase tracking-widest ${isJekyll ? "text-blue-300/40" : "text-red-500/40"}`}>Long-term</div>
              <p className="text-sm text-white/80">{data.long_term}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSlideMeta, useSlideMode } from "./slide-context";

type Tone = "light" | "paper" | "dark";

const toneClass: Record<Tone, string> = {
  light: "bg-paper text-ink",
  paper: "bg-paper-2 text-ink",
  dark: "bg-gradient-ink text-paper",
};

const toneBg: Record<Tone, string> = { light: "var(--paper)", paper: "var(--paper-2)", dark: "var(--ink)" };

// Fixed spark positions (no randomness, so server and browser render the same).
const sparks = [
  { x: 6, size: 18, dur: 9, delay: 0 }, { x: 14, size: 10, dur: 12, delay: 3 }, { x: 22, size: 14, dur: 10, delay: 6 },
  { x: 31, size: 9, dur: 13, delay: 1.5 }, { x: 39, size: 16, dur: 11, delay: 4.5 }, { x: 47, size: 10, dur: 9.5, delay: 7 },
  { x: 55, size: 12, dur: 12.5, delay: 2 }, { x: 63, size: 18, dur: 10.5, delay: 5 }, { x: 71, size: 9, dur: 14, delay: 0.8 },
  { x: 79, size: 14, dur: 9, delay: 3.8 }, { x: 87, size: 10, dur: 11.5, delay: 6.5 }, { x: 94, size: 16, dur: 13, delay: 2.6 },
];

/* Master effects on every slide: drifting sparks and a soft light sweep (hidden in static mode). */
function SlideEffects() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div className="light-sweep" />
      {sparks.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={{ left: `${s.x}%`, width: s.size, height: s.size, ["--dur" as string]: `${s.dur}s`, ["--d" as string]: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export function SlideLayout({ children, tone = "light", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  const { number, total } = useSlideMeta();
  const mode = useSlideMode();
  const dark = tone === "dark";

  return (
    <div
      className={cn("slide-content", toneClass[tone], mode === "static" && "slide-static", className)}
      style={{ ["--slide-bg" as string]: toneBg[tone], ["--sweep" as string]: dark ? "var(--paper)" : "var(--apricot)" }}
    >
      {children}
      <SlideEffects />
      <footer
        className={cn(
          "slide-footer absolute inset-x-0 bottom-0 z-30 flex h-[84px] items-center justify-between px-[120px]",
          dark ? "border-t border-paper/10 bg-ink-deep/85 text-mist" : "border-t border-line bg-paper/95 text-ink/70",
        )}
      >
        <div className="flex items-center gap-4">
          <span className="h-3 w-3 rotate-45 bg-apricot" />
          <span className="tracking-[0.04em]">Հետազոտական նախագիծ · Գործազրկություն և տնտեսություն</span>
        </div>
        <div className="flex items-center gap-6">
          <span className={cn("slide-page rounded-full px-5 py-2 font-semibold", dark ? "bg-paper/10 text-paper" : "bg-ink text-paper")}>
            {pad(number)} / {pad(total)}
          </span>
        </div>
      </footer>
    </div>
  );
}

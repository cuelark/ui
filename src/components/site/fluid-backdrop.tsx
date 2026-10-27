import * as React from "react";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** SVG film grain, inlined so it costs one tiny data URI and no request. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Each blob: where it sits, how big, its color mix, and how far it wanders. */
const BLOBS = [
  // Deep pool, bottom right: where the gradient is most saturated.
  { className: "right-[-18%] bottom-[-35%] h-[95%] w-[75%]", color: "color-mix(in oklch, var(--signal), black 22%)", drift: [-60, -40], dur: 18 },
  // Bright sky body, center right.
  { className: "top-[30%] left-[38%] h-[70%] w-[60%]", color: "color-mix(in oklch, var(--signal), white 22%)", drift: [70, -50], dur: 15 },
  // Cyan lift, lower middle: keeps the blue from going flat.
  { className: "bottom-[-20%] left-[18%] h-[60%] w-[45%]", color: "color-mix(in oklch, var(--signal), oklch(0.78 0.14 220) 55%)", drift: [80, 30], dur: 21 },
  // Indigo shadow, far left.
  { className: "bottom-[-30%] left-[-15%] h-[70%] w-[45%]", color: "color-mix(in oklch, var(--signal), oklch(0.35 0.18 270) 45%)", drift: [40, -30], dur: 24 },
];

/**
 * The hero backdrop: a fluid gradient that washes from the page color at the top into the theme's signal color
 * below, built from a few blurred blobs that drift and breathe on long GSAP loops, a light wedge sweeping across,
 * and fine film grain. Every color is mixed from tokens, so it re-tints with any theme; still under reduced motion.
 */
export function FluidBackdrop({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !motionScale(root)) return;
      const s = Math.min(motionScale(root), 1.5);
      root.querySelectorAll<HTMLElement>("[data-blob]").forEach((blob, i) => {
        const { drift, dur } = BLOBS[i]!;
        gsap.to(blob, { xPercent: (drift[0]! / 4) * s, yPercent: (drift[1]! / 4) * s, scale: 1 + 0.12 * s, rotate: (i % 2 ? -14 : 14) * s, duration: dur, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      const wedge = root.querySelector('[data-part="wedge"]');
      if (wedge) gsap.to(wedge, { rotate: "-=10", xPercent: 6 * s, yPercent: -4 * s, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{
        background:
          "linear-gradient(168deg, var(--background) 6%, color-mix(in oklch, var(--signal) 14%, var(--background)) 34%, color-mix(in oklch, var(--signal) 62%, var(--background)) 58%, var(--signal) 100%)",
      }}
    >
      {BLOBS.map((b, i) => (
        <div key={i} data-blob className={cn("absolute rounded-full blur-[70px] will-change-transform", b.className)} style={{ background: `radial-gradient(closest-side, ${b.color}, transparent)` }} />
      ))}
      {/* The light wedge: a soft band of page color cutting diagonally across the blue. */}
      <div
        data-part="wedge"
        className="absolute top-[18%] left-[-12%] h-[42%] w-[70%] rounded-full blur-[48px] will-change-transform"
        style={{ transform: "rotate(-32deg)", background: "radial-gradient(closest-side, color-mix(in oklch, var(--background) 92%, transparent), transparent)" }}
      />
      <div className="absolute inset-0 opacity-[0.22] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  );
}

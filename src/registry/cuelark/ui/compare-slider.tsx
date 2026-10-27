"use client";

import * as React from "react";
import { ChevronsLeftRightIcon } from "lucide-react";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CompareSliderProps = React.ComponentProps<"div"> & {
  /** The "before" layer (shown on the left). Any element: an <img>, a <video>, a component. */
  before: React.ReactNode;
  /** The "after" layer (shown on the right). */
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  /** Starting position, 0–100. */
  defaultPosition?: number;
  /** Follow the pointer on hover instead of requiring a drag. */
  hover?: boolean;
};

/**
 * Before/after comparison: drag the handle (or use arrow keys) to reveal one layer over the other with a
 * hardware-accelerated clip-path. On first view the handle sweeps once to show it can move.
 */
function CompareSlider({ before, after, beforeLabel = "Before", afterLabel = "After", defaultPosition = 50, hover = false, className, ...props }: CompareSliderProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState(defaultPosition);
  const dragging = React.useRef(false);

  const fromEvent = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionScale(el)) return;
      const proxy = { p: defaultPosition };
      gsap
        .timeline({ delay: 0.4, scrollTrigger: undefined })
        .to(proxy, { p: defaultPosition - 18, duration: 0.5, ease: "power2.inOut", onUpdate: () => setPos(proxy.p) })
        .to(proxy, { p: defaultPosition + 12, duration: 0.6, ease: "power2.inOut", onUpdate: () => setPos(proxy.p) })
        .to(proxy, { p: defaultPosition, duration: 0.5, ease: "cue", onUpdate: () => setPos(proxy.p) });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      data-slot="compare-slider"
      className={cn("relative isolate overflow-hidden rounded-2xl border border-border bg-muted select-none touch-pan-y", className)}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromEvent(e.clientX);
      }}
      onPointerMove={(e) => (dragging.current || hover) && fromEvent(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      {...props}
    >
      <div className="pointer-events-none [&>*]:block [&>*]:size-full [&>*]:object-cover">{after}</div>
      <div className="pointer-events-none absolute inset-0 [&>*]:block [&>*]:size-full [&>*]:object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>
      <span className="cue-label pointer-events-none absolute top-3 left-3 rounded-full bg-background/80 px-2 py-1 backdrop-blur">{beforeLabel}</span>
      <span className="cue-label pointer-events-none absolute top-3 right-3 rounded-full bg-background/80 px-2 py-1 backdrop-blur">{afterLabel}</span>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-background shadow-[0_0_0_0.5px_rgb(0_0_0/0.15)]" style={{ left: `${pos}%` }} />
      <button
        type="button"
        role="slider"
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 2;
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
        }}
        className="absolute top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-border bg-background shadow-raised outline-none transition-[scale] duration-150 ease-cue focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRightIcon className="size-4" />
      </button>
    </div>
  );
}

export { CompareSlider };
export type { CompareSliderProps };

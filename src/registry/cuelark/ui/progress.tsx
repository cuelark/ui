"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cueTo, gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ProgressProps = Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value"> & {
  /** 0–100, or `null` for an indeterminate bar. */
  value?: number | null;
  /** Splits the bar into this many cells that light up one by one. */
  segments?: number;
  size?: "sm" | "md" | "lg";
};

const heights = { sm: "h-1", md: "h-1.5", lg: "h-2.5" };

/** The fill eases to each new value with GSAP (no CSS width jumps); segmented bars light their cells in a cascade. */
function Progress({ className, value = 0, max = 100, segments, size = "md", ...props }: ProgressProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const initial = React.useRef(value);
  const pct = value === null ? null : Math.min(100, Math.max(0, (value / max) * 100));

  React.useLayoutEffect(() => {
    const root = ref.current;
    if (!root || pct === null) return;
    const scale = motionScale(root);
    if (segments) {
      const cells = Array.from(root.querySelectorAll<HTMLElement>('[data-slot="progress-cell"]'));
      const lit = Math.round((pct / 100) * segments);
      cells.forEach((cell) => {
        const on = Number(cell.dataset.index) < lit;
        if (on === (cell.dataset.on === "true")) return;
        cell.dataset.on = String(on);
        if (scale && on) gsap.fromTo(cell, { scaleY: 1 + 0.8 * scale }, { scaleY: 1, duration: 0.4, ease: "cue-snap", delay: (Number(cell.dataset.index) % 4) * 0.03 });
      });
      return;
    }
    const fill = root.querySelector<HTMLElement>('[data-slot="progress-indicator"]');
    if (fill) cueTo(fill, { width: `${pct}%`, duration: 0.6 }, scale);
  }, [pct, segments]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      value={value}
      max={max}
      className={cn("relative w-full overflow-hidden rounded-full", segments ? "flex gap-1 bg-transparent" : "bg-muted shadow-well", heights[size], className)}
      {...props}
    >
      {segments ? (
        Array.from({ length: segments }, (_, i) => {
          const on = pct !== null && i < Math.round(((initial.current ?? 0) / max) * 100 * (segments / 100));
          return (
            <span
              key={i}
              data-slot="progress-cell"
              data-index={i}
              data-on={on}
              className="h-full flex-1 rounded-full bg-muted shadow-well transition-colors duration-200 data-[on=true]:bg-primary data-[on=true]:shadow-none"
            />
          );
        })
      ) : pct === null ? (
        <span data-slot="progress-indicator" className="absolute inset-y-0 w-full origin-left animate-[cue-indeterminate_1.4s_ease-in-out_infinite] rounded-full bg-primary" />
      ) : (
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.min(100, Math.max(0, ((initial.current ?? 0) / max) * 100))}%` }}
        />
      )}
    </ProgressPrimitive.Root>
  );
}

export { Progress };
export type { ProgressProps };

"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type BranchProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Alternative versions of one message (regenerations or edits). */
  versions: React.ReactNode[];
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
};

/** Flip between regenerated versions of a reply ("2 / 3"); the new version slides in from the side you moved toward. */
function Branch({ versions, defaultIndex, onIndexChange, className, ...props }: BranchProps) {
  const [index, setIndex] = React.useState(defaultIndex ?? versions.length - 1);
  const body = React.useRef<HTMLDivElement>(null);
  const go = (d: number) => {
    const next = Math.min(versions.length - 1, Math.max(0, index + d));
    if (next === index) return;
    setIndex(next);
    onIndexChange?.(next);
    const el = body.current;
    if (el && motionScale(el)) gsap.fromTo(el, { opacity: 0, x: 10 * d }, { opacity: 1, x: 0, duration: 0.25, ease: "cue" });
  };
  const btn = "grid size-6 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-30 [&_svg]:size-3.5";
  return (
    <div data-slot="branch" className={cn("grid gap-2", className)} {...props}>
      <div ref={body} aria-live="polite">
        {versions[index]}
      </div>
      {versions.length > 1 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <button type="button" aria-label="Previous version" disabled={index === 0} onClick={() => go(-1)} className={btn}>
            <ChevronLeftIcon />
          </button>
          <span className="font-mono tabular-nums">
            {index + 1} / {versions.length}
          </span>
          <button type="button" aria-label="Next version" disabled={index === versions.length - 1} onClick={() => go(1)} className={btn}>
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export { Branch };
export type { BranchProps };

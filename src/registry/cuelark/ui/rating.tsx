"use client";

import * as React from "react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RatingProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  /** Accessible name of the group, e.g. "Rate this template". */
  label?: string;
};

const sizes = { sm: "size-4", md: "size-5", lg: "size-7" };

/**
 * Star rating as a radio group (arrow keys, Home/End). Hover previews the score; choosing one pops the
 * stars up to it in a quick cascade.
 */
function Rating({ className, value, defaultValue = 0, onValueChange, max = 5, readOnly = false, size = "md", label = "Rating", ...props }: RatingProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const [hover, setHover] = React.useState<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const shown = hover ?? current;

  const choose = (n: number) => {
    if (readOnly) return;
    setInternal(n);
    onValueChange?.(n);
    const root = rootRef.current;
    const scale = root ? motionScale(root) : 0;
    if (!root || !scale) return;
    const stars = Array.from(root.querySelectorAll("svg")).slice(0, n);
    gsap.fromTo(stars, { scale: 1 + 0.35 * scale, rotate: -12 * scale }, { scale: 1, rotate: 0, duration: 0.5, ease: "cue-snap", stagger: 0.04 });
    rootRef.current?.querySelector<HTMLButtonElement>(`[data-value="${n}"]`)?.focus();
  };

  return (
    <div
      ref={rootRef}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={readOnly ? `${label}: ${current} out of ${max}` : label}
      data-slot="rating"
      className={cn("inline-flex items-center gap-0.5", className)}
      onPointerLeave={() => setHover(null)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= shown;
        const star = (
          <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(sizes[size], "transition-colors duration-150", filled ? "fill-warning text-warning" : "fill-muted text-border")}>
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z"
            />
          </svg>
        );
        if (readOnly) return <span key={n}>{star}</span>;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === current}
            aria-label={`${n} of ${max}`}
            data-value={n}
            tabIndex={n === (current || 1) ? 0 : -1}
            onPointerEnter={() => setHover(n)}
            onClick={() => choose(n)}
            onKeyDown={(e) => {
              const next = { ArrowRight: n + 1, ArrowUp: n + 1, ArrowLeft: n - 1, ArrowDown: n - 1, Home: 1, End: max }[e.key];
              if (next === undefined) return;
              e.preventDefault();
              choose(Math.min(max, Math.max(1, next)));
            }}
            className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}

export { Rating };
export type { RatingProps };

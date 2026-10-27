"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("inline-block shrink-0 text-current", {
  variants: { size: { sm: "size-4", md: "size-6", lg: "size-10" } },
  defaultVariants: { size: "md" },
});

type SpinnerProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof spinnerVariants> & {
    /**
     * `marks`: the signature loader, four crop marks that close in, turn a quarter and open again.
     * `ring` and `dots` are quieter alternatives.
     */
    variant?: "marks" | "ring" | "dots";
    /** Accessible status text. */
    label?: string;
  };

const CORNERS = [
  { d: "M3 8V3h5", x: 2, y: 2 },
  { d: "M16 3h5v5", x: -2, y: 2 },
  { d: "M21 16v5h-5", x: -2, y: -2 },
  { d: "M8 21H3v-5", x: 2, y: -2 },
];

function Spinner({ className, size, variant = "marks", label = "Loading", ...props }: SpinnerProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || variant === "ring") return;
      const scale = motionScale(root);
      if (!scale) return;
      if (variant === "marks") {
        const svg = root.querySelector("svg")!;
        const corners = Array.from(root.querySelectorAll<SVGPathElement>("path"));
        const tl = gsap.timeline({ repeat: -1, defaults: { ease: "cue" } });
        tl.to(corners, { x: (i) => CORNERS[i]!.x, y: (i) => CORNERS[i]!.y, duration: 0.3, stagger: 0.04 })
          .to(svg, { rotate: "+=90", duration: 0.45, ease: "cue-snap" }, "<0.1")
          .to(corners, { x: 0, y: 0, duration: 0.35, stagger: 0.04 }, "<0.15");
      } else {
        gsap.to(root.querySelectorAll("circle"), { y: -3, duration: 0.32, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.12, repeat: -1, yoyo: true } });
      }
    },
    { scope: ref, dependencies: [variant] },
  );

  return (
    <span ref={ref} role="status" aria-label={label} data-slot="spinner" className={cn(spinnerVariants({ size }), className)} {...props}>
      {variant === "marks" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-full">
          {CORNERS.map((c) => (
            <path key={c.d} d={c.d} />
          ))}
        </svg>
      )}
      {variant === "ring" && (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-full animate-spin motion-reduce:animate-[spin_1.6s_linear_infinite]">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}
      {variant === "dots" && (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-full">
          <circle cx="5" cy="12" r="2.2" />
          <circle cx="12" cy="12" r="2.2" />
          <circle cx="19" cy="12" r="2.2" />
        </svg>
      )}
    </span>
  );
}

export { Spinner, spinnerVariants };
export type { SpinnerProps };

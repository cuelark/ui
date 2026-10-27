"use client";

import * as React from "react";
import { Slot } from "radix-ui";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type GradientTextProps = React.ComponentProps<"span"> & {
  asChild?: boolean;
  /**
   * `drift`: a slow, endless shimmer through the words.
   * `spotlight`: the color lives under the pointer, as if lighting the text with a torch (falls back to drift on touch).
   */
  variant?: "drift" | "spotlight";
  /** Highlight color; defaults to `--ring`: the signal at a strength that stays readable on light backgrounds. */
  color?: string;
  /** Seconds per sweep (drift). */
  duration?: number;
};

/**
 * Text with a living highlight: a shimmer that drifts through it, or a spotlight that follows the pointer
 * (GSAP). The base color is your foreground, so it always reads; the text stays real, selectable and indexed.
 */
function GradientText({
  asChild,
  variant = "drift",
  color = "var(--ring)",
  duration = 3.2,
  className,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: GradientTextProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionScale(el)) return;
      if (variant === "drift") {
        gsap.fromTo(el, { "--gx": "-30%" }, { "--gx": "130%", duration, ease: "power1.inOut", repeat: -1, repeatDelay: 0.6 });
      } else {
        gsap.set(el, { "--go": 0, "--gx": "50%" });
      }
    },
    { scope: ref, dependencies: [variant, duration] },
  );

  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp
      ref={ref}
      data-slot="gradient-text"
      data-variant={variant}
      className={cn("bg-clip-text text-transparent [-webkit-background-clip:text]", className)}
      style={{
        backgroundImage: `radial-gradient(${variant === "drift" ? "38% 180%" : "28% 200%"} at var(--gx, 50%) 50%, color-mix(in oklch, ${color} calc(var(--go, 1) * 100%), var(--foreground)) 0%, color-mix(in oklch, ${color} calc(var(--go, 1) * 100%), var(--foreground)) 30%, var(--foreground) 100%)`,
        ...style,
      }}
      onPointerMove={(e: React.PointerEvent<HTMLSpanElement>) => {
        onPointerMove?.(e);
        if (variant !== "spotlight" || !motionScale(e.currentTarget)) return;
        const r = e.currentTarget.getBoundingClientRect();
        gsap.to(e.currentTarget, { "--gx": `${((e.clientX - r.left) / r.width) * 100}%`, "--go": 1, duration: 0.35, ease: "cue", overwrite: "auto" });
      }}
      onPointerLeave={(e: React.PointerEvent<HTMLSpanElement>) => {
        onPointerLeave?.(e);
        if (variant === "spotlight") gsap.to(e.currentTarget, { "--go": 0, duration: 0.3, ease: "cue", overwrite: "auto" });
      }}
      {...props}
    />
  );
}

export { GradientText };
export type { GradientTextProps };

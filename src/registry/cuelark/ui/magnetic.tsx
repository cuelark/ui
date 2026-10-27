"use client";

import * as React from "react";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MagneticProps = React.ComponentProps<"span"> & {
  /** 0–1: how far the child follows the pointer. */
  strength?: number;
  /** Extra px around the child where the pull already starts. */
  reach?: number;
};

/** Wraps a button or icon so it leans toward the pointer and springs back when released (GSAP, with an elastic release). */
function Magnetic({ className, strength = 0.35, reach = 24, children, ...props }: MagneticProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const area = el.parentElement ?? el;
      const onMove = (e: PointerEvent) => {
        const scale = motionScale(el);
        if (!scale) return;
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const inside = Math.abs(dx) < rect.width / 2 + reach && Math.abs(dy) < rect.height / 2 + reach;
        if (inside) {
          gsap.to(el, { x: dx * strength * Math.min(scale, 1.5), y: dy * strength * Math.min(scale, 1.5), duration: 0.45, ease: "cue", overwrite: "auto" });
        } else if (gsap.getProperty(el, "x") !== 0) release();
      };
      const release = () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.35)", overwrite: true });
      area.addEventListener("pointermove", onMove);
      area.addEventListener("pointerleave", release);
      return () => {
        area.removeEventListener("pointermove", onMove);
        area.removeEventListener("pointerleave", release);
      };
    },
    { scope: ref, dependencies: [strength, reach] },
  );

  return (
    <span ref={ref} data-slot="magnetic" className={cn("inline-block will-change-transform", className)} {...props}>
      {children}
    </span>
  );
}

export { Magnetic };
export type { MagneticProps };

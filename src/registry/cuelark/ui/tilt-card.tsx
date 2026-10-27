"use client";

import * as React from "react";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TiltCardProps = React.ComponentProps<"div"> & {
  /** Maximum tilt in degrees. */
  max?: number;
  /** A light glare that follows the pointer across the surface. */
  glare?: boolean;
};

/** A surface that tilts toward the pointer in 3D with a following glare, then settles back elastically (GSAP). */
function TiltCard({ className, max = 10, glare = true, children, ...props }: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { transformPerspective: 900, "--glare-x": "50%", "--glare-y": "50%" });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      data-slot="tilt-card"
      className={cn("relative overflow-hidden rounded-2xl border border-border bg-card shadow-raised will-change-transform [transform-style:preserve-3d]", className)}
      onPointerMove={(e) => {
        const scale = motionScale(e.currentTarget);
        if (!scale) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const k = max * Math.min(scale, 1.5);
        gsap.to(e.currentTarget, { rotateY: (px - 0.5) * 2 * k, rotateX: (0.5 - py) * 2 * k, "--glare-x": `${px * 100}%`, "--glare-y": `${py * 100}%`, duration: 0.45, ease: "cue", overwrite: "auto" });
      }}
      onPointerLeave={(e) => gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" })}
      {...props}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(circle_at_var(--glare-x,50%)_var(--glare-y,50%),color-mix(in_oklch,var(--foreground),transparent_88%),transparent_55%)] group-hover/tilt:opacity-100 [[data-slot=tilt-card]:hover>&]:opacity-100"
        />
      )}
    </div>
  );
}

export { TiltCard };
export type { TiltCardProps };

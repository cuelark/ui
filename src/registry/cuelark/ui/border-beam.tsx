"use client";

import * as React from "react";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type BorderBeamProps = React.ComponentProps<"div"> & {
  /** Seconds per lap. */
  duration?: number;
  /** Beam color; defaults to the signal token. */
  color?: string;
  /** Beam length as a fraction of the border (0–1). */
  size?: number;
};

/**
 * A light that travels around the border of its parent (absolutely positioned; give the parent `relative`
 * and a radius). A conic gradient masked to a 1.5px ring, rotated by GSAP through a registered angle.
 */
function BorderBeam({ className, duration = 6, color = "var(--signal)", size = 0.18, style, ...props }: BorderBeamProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionScale(el)) return;
      gsap.fromTo(el, { "--beam-angle": "0deg" }, { "--beam-angle": "360deg", duration, ease: "none", repeat: -1 });
    },
    { scope: ref, dependencies: [duration] },
  );

  const sweep = Math.round(size * 360);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="border-beam"
      className={cn(
        "pointer-events-none absolute -inset-px rounded-[inherit] p-[1.5px]",
        className,
      )}
      style={{
        background: `conic-gradient(from var(--beam-angle, 0deg), transparent 0deg, color-mix(in oklch, ${color}, transparent 100%) ${sweep * 0.1}deg, ${color} ${sweep * 0.8}deg, transparent ${sweep}deg)`,
        // Only the 1.5px ring between border-box and content-box shows: the content box is cut out.
        mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        ...style,
      }}
      {...props}
    />
  );
}

export { BorderBeam };
export type { BorderBeamProps };

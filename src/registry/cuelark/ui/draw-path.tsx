"use client";

import * as React from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

type DrawPathProps = React.ComponentProps<"svg"> & {
  /** Draw on mount, when scrolled into view, or scrubbed to scroll position. */
  trigger?: "mount" | "inView" | "scroll";
  duration?: number;
};

/**
 * Draws the strokes of any inline SVG as if by hand (GSAP DrawSVGPlugin): signatures, underlines, diagrams,
 * icons. Put your paths inside; every stroked element draws in sequence.
 */
function DrawPath({ className, trigger = "inView", duration = 1.4, children, ...props }: DrawPathProps) {
  const ref = React.useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || !motionScale(svg)) return;
      const paths = svg.querySelectorAll("path, line, polyline, circle, rect, ellipse");
      const vars: gsap.TweenVars = { drawSVG: "0%", duration, ease: "power2.inOut", stagger: duration / Math.max(paths.length, 1) / 2 };
      if (trigger === "scroll") gsap.from(paths, { drawSVG: "0%", ease: "none", scrollTrigger: { trigger: svg, start: "top 85%", end: "bottom 40%", scrub: 0.5 } });
      else gsap.from(paths, { ...vars, scrollTrigger: trigger === "inView" ? { trigger: svg, start: "top 85%", once: true } : undefined });
    },
    { scope: ref, dependencies: [trigger, duration] },
  );

  return (
    <svg ref={ref} data-slot="draw-path" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={cn(className)} {...props}>
      {children}
    </svg>
  );
}

export { DrawPath };
export type { DrawPathProps };

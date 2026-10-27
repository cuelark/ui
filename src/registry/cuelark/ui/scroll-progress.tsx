"use client";

import * as React from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type ScrollProgressProps = React.ComponentProps<"div"> & {
  /** Track a scrolling element's progress instead of the page, e.g. an article. CSS selector or element. */
  target?: string | Element;
  /** Fixed to the top of the viewport (default) or inline where you place it. */
  position?: "fixed" | "static";
  /** The element that scrolls, when it is not the page (e.g. a scrollable panel). */
  scroller?: string | Element;
};

/** A reading-progress hairline scrubbed to scroll position (GSAP ScrollTrigger); smoothed unless motion is off. */
function ScrollProgress({ className, target, scroller, position = "fixed", ...props }: ScrollProgressProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const bar = ref.current;
      if (!bar) return;
      const smooth = motionScale(bar) ? 0.3 : true;
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: target ? { trigger: target, scroller, start: "top top", end: "bottom bottom", scrub: smooth } : { scroller, start: 0, end: "max", scrub: smooth },
        },
      );
    },
    { scope: ref, dependencies: [target, scroller] },
  );

  return (
    <div
      ref={ref}
      data-slot="scroll-progress"
      role="presentation"
      className={cn("h-0.5 w-full origin-left scale-x-0 bg-primary", position === "fixed" && "fixed inset-x-0 top-0 z-50", className)}
      {...props}
    />
  );
}

export { ScrollProgress };
export type { ScrollProgressProps };

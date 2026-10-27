"use client";

import * as React from "react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

type ScrambleTextProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** The final text (rendered as-is on the server, so it is indexed and readable without JS). */
  text: string;
  /** When to scramble: on mount, when scrolled into view, or every time it is hovered or focused. */
  trigger?: "mount" | "inView" | "hover";
  /** Characters to scramble through. */
  chars?: string;
  duration?: number;
};

/** Decodes text like a terminal resolving a signal (GSAP ScrambleTextPlugin). Mono, tabular, width-stable. */
function ScrambleText({ text, trigger = "inView", chars = "upperCase", duration = 0.9, className, onPointerEnter, onFocus, ...props }: ScrambleTextProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  const run = React.useCallback(() => {
    const el = ref.current;
    if (!el || !motionScale(el) || gsap.isTweening(el)) return;
    gsap.to(el, { duration, ease: "none", scrambleText: { text, chars, speed: 0.6, revealDelay: duration * 0.25, tweenLength: false } });
  }, [text, chars, duration]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || trigger === "hover") return;
      if (trigger === "mount") run();
      else ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: run });
    },
    { scope: ref, dependencies: [trigger, run] },
  );

  return (
    <span
      ref={ref}
      data-slot="scramble-text"
      className={cn("font-mono tabular-nums", className)}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (trigger === "hover") run();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        if (trigger === "hover") run();
      }}
      {...props}
    >
      {text}
    </span>
  );
}

export { ScrambleText };
export type { ScrambleTextProps };

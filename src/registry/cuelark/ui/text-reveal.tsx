"use client";

import * as React from "react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(SplitText, ScrollTrigger);

type TextRevealProps = React.HTMLAttributes<HTMLElement> & {
  /** The element to render. Use a real heading (`"h1"`, `"h2"`) for SEO: the full text is in the server HTML. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /** What animates as a unit. */
  split?: "chars" | "words" | "lines";
  /** `rise` slides each piece up out of a mask; `blur` focuses it in; `fade` just fades. */
  effect?: "rise" | "blur" | "fade";
  /** Animate on mount or when scrolled into view. */
  trigger?: "mount" | "inView";
  delay?: number;
  /** Seconds between pieces. */
  stagger?: number;
};

/**
 * Splits text with GSAP SplitText (re-splits on resize and font load, keeps an accessible label) and
 * reveals it piece by piece. Without JavaScript the text is simply there.
 */
function TextReveal({ as: Tag = "p", split = "words", effect = "rise", trigger = "inView", delay = 0, stagger, className, children, ...props }: TextRevealProps) {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const scale = motionScale(el);
      if (!scale) return;
      SplitText.create(el, {
        type: split === "chars" ? "words,chars" : split,
        mask: effect === "rise" ? split : undefined,
        aria: "auto",
        autoSplit: true,
        onSplit(self) {
          const targets = self[split];
          const from =
            effect === "rise"
              ? { yPercent: 110 }
              : effect === "blur"
                ? { opacity: 0, filter: `blur(${8 * scale}px)`, y: 6 * scale }
                : { opacity: 0 };
          return gsap.from(targets, {
            ...from,
            duration: effect === "rise" ? 0.7 : 0.8,
            ease: "cue",
            delay,
            stagger: stagger ?? { chars: 0.015, words: 0.04, lines: 0.1 }[split],
            scrollTrigger: trigger === "inView" ? { trigger: el, start: "top 85%", once: true } : undefined,
          });
        },
      });
    },
    { scope: ref, dependencies: [split, effect, trigger, delay, stagger] },
  );

  return React.createElement(Tag, { ref, "data-slot": "text-reveal", className: cn("[&_.line]:pb-[0.08em]", className), ...props }, children);
}

export { TextReveal };
export type { TextRevealProps };

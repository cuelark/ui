"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Effect = "rise" | "fade" | "blur" | "scale" | "wipe";

type RevealProps = React.ComponentProps<"div"> & {
  /** `wipe` uncovers content with a clip-path from the bottom edge, like a print coming out of the tray. */
  effect?: Effect;
  /** Animate each direct child in turn (grids, lists) instead of the block as one. */
  stagger?: boolean;
  /** The scrolling element when it is not the page (a panel, a modal body). */
  scroller?: Element | null;
  asChild?: boolean;
};

const FROM: Record<Effect, (s: number) => gsap.TweenVars> = {
  rise: (s) => ({ opacity: 0, y: 28 * s }),
  fade: () => ({ opacity: 0 }),
  blur: (s) => ({ opacity: 0, filter: `blur(${8 * s}px)`, y: 8 * s }),
  scale: (s) => ({ opacity: 0, scale: 1 - 0.08 * s }),
  wipe: (s) => ({ clipPath: "inset(0% 0% 100% 0%)", y: 12 * s }),
};
const TO: Record<Effect, gsap.TweenVars> = {
  rise: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  blur: { opacity: 1, filter: "blur(0px)", y: 0 },
  scale: { opacity: 1, scale: 1 },
  wipe: { clipPath: "inset(0% 0% 0% 0%)", y: 0 },
};

/**
 * Reveals content as it scrolls into view (GSAP ScrollTrigger.batch, so items entering together stagger).
 * On the page, anything already visible at load is left alone, so nothing flashes and crawlers get it all.
 */
function Reveal({ className, effect = "rise", stagger = false, scroller, asChild, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !motionScale(root)) return;
      const scale = motionScale(root);
      const all = (stagger ? Array.from(root.children) : [root]) as HTMLElement[];
      const targets = scroller ? all : all.filter((el) => !ScrollTrigger.isInViewport(el, 0.1));
      if (!targets.length) return;
      gsap.set(targets, FROM[effect](scale));
      ScrollTrigger.batch(targets, {
        scroller: scroller ?? undefined,
        start: "top 92%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { ...TO[effect], duration: 0.7, ease: "cue", stagger: 0.07, overwrite: true, clearProps: Object.keys(TO[effect]).join(",") }),
      });
    },
    { scope: ref, dependencies: [effect, stagger, scroller] },
  );

  const Comp = asChild ? Slot.Root : "div";
  return <Comp ref={ref} data-slot="reveal" className={cn(className)} {...props} />;
}

export { Reveal };
export type { RevealProps };

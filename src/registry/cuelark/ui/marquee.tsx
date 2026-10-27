"use client";

import * as React from "react";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MarqueeProps = React.ComponentProps<"div"> & {
  /** Pixels per second. */
  speed?: number;
  reverse?: boolean;
  /** On hover the loop eases to a stop (instead of freezing) and eases back up on leave. */
  pauseOnHover?: boolean;
  /** Fades both edges. */
  fade?: boolean;
  /** Gap between items, any CSS length. */
  gap?: string;
};

/**
 * A seamless infinite loop (logos, testimonials, tickers). GSAP drives one track holding two copies;
 * hover decelerates it smoothly. With motion off it becomes a normal horizontally scrollable row.
 */
function Marquee({ className, speed = 40, reverse = false, pauseOnHover = true, fade = true, gap = "2.5rem", children, ...props }: MarqueeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const tween = React.useRef<gsap.core.Tween | null>(null);
  const [still, setStill] = React.useState(false);

  useGSAP(
    () => {
      const root = ref.current;
      const track = root?.querySelector<HTMLElement>('[data-slot="marquee-track"]');
      if (!root || !track) return;
      if (!motionScale(root)) return setStill(true);
      const distance = track.scrollWidth / 2;
      tween.current = gsap.fromTo(track, { x: reverse ? -distance : 0 }, { x: reverse ? 0 : -distance, duration: distance / speed, ease: "none", repeat: -1 });
    },
    { scope: ref, dependencies: [speed, reverse] },
  );

  const ease = (to: number) => tween.current && gsap.to(tween.current, { timeScale: to, duration: 0.6, ease: "cue" });

  return (
    <div
      ref={ref}
      data-slot="marquee"
      className={cn(
        "relative flex w-full",
        still ? "overflow-x-auto" : "overflow-hidden",
        fade && "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
      onPointerEnter={() => pauseOnHover && ease(0)}
      onPointerLeave={() => pauseOnHover && ease(1)}
      {...props}
    >
      <div data-slot="marquee-track" className="flex w-max shrink-0" style={{ gap }}>
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
        {!still && (
          <div aria-hidden="true" className="flex shrink-0 items-center" style={{ gap }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export { Marquee };
export type { MarqueeProps };

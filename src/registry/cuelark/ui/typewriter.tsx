"use client";

import * as React from "react";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(TextPlugin, ScrollTrigger);

type TypewriterProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** One phrase, or several to type, hold, delete and cycle. */
  text: string | string[];
  /** Characters per second. */
  speed?: number;
  /** Seconds a phrase stays before it is deleted. */
  hold?: number;
  loop?: boolean;
  cursor?: boolean;
};

/**
 * Types text out with a blinking block caret (GSAP TextPlugin), optionally cycling through phrases.
 * The first phrase is server-rendered, so it is indexed and readable without JavaScript.
 */
function Typewriter({ text, speed = 28, hold = 1.6, loop = true, cursor = true, className, ...props }: TypewriterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const phrases = Array.isArray(text) ? text : [text];

  useGSAP(
    () => {
      const el = ref.current?.querySelector<HTMLElement>('[data-slot="typewriter-text"]');
      if (!el || !motionScale(el)) return;
      const tl = gsap.timeline({ repeat: loop && phrases.length > 1 ? -1 : 0, paused: true });
      phrases.forEach((p, i) => {
        tl.set(el, { text: "" }).to(el, { text: { value: p }, duration: p.length / speed, ease: "none" });
        if (phrases.length > 1 && (loop || i < phrases.length - 1)) tl.to(el, { text: { value: "" }, duration: p.length / (speed * 2.2), ease: "none", delay: hold });
      });
      ScrollTrigger.create({ trigger: el, start: "top 95%", once: true, onEnter: () => tl.play() });
    },
    { scope: ref, dependencies: [phrases.join("|"), speed, hold, loop] },
  );

  return (
    <span ref={ref} data-slot="typewriter" className={cn("inline-flex items-baseline", className)} {...props}>
      <span data-slot="typewriter-text" className="whitespace-pre-wrap">
        {phrases[0]}
      </span>
      {cursor && <span aria-hidden="true" className="ms-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.12em] animate-pulse bg-signal" />}
    </span>
  );
}

export { Typewriter };
export type { TypewriterProps };

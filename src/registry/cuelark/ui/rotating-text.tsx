"use client";

import * as React from "react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RotatingTextProps = Omit<React.ComponentProps<"span">, "children"> & {
  words: string[];
  /** Milliseconds each word stays. */
  interval?: number;
};

/**
 * Cycles through words in place: the old word rolls up and away letter by letter, the new one rolls in, and
 * the box eases to the new width so surrounding text never jumps. Stops on hover; static with motion off.
 */
function RotatingText({ words, interval = 2400, className, ...props }: RotatingTextProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const boxRef = React.useRef<HTMLSpanElement>(null);
  const previous = React.useRef<string | null>(null);

  React.useEffect(() => {
    const box = boxRef.current;
    if (paused || words.length < 2 || !box || !motionScale(box)) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [paused, interval, words.length]);

  React.useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const current = box.querySelector<HTMLElement>('[data-slot="rotating-word"]');
    const old = box.querySelector<HTMLElement>('[data-slot="rotating-old"]');
    if (!current || previous.current === null) {
      previous.current = words[index] ?? "";
      return;
    }
    const scale = motionScale(box);
    const fromWidth = old?.offsetWidth ?? current.offsetWidth;
    gsap.fromTo(box, { width: fromWidth }, { width: current.offsetWidth, duration: 0.5, ease: "cue", clearProps: "width" });
    gsap.fromTo(current.children, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "cue", stagger: 0.025 * scale });
    if (old) gsap.to(old.children, { yPercent: -100, opacity: 0, duration: 0.35, ease: "cue", stagger: 0.02 * scale });
    previous.current = words[index] ?? "";
  }, [index, words]);

  const letters = (word: string) => [...word].map((c, i) => <span key={i} className="inline-block whitespace-pre">{c}</span>);
  const word = words[index] ?? "";
  const old = previous.current !== null && previous.current !== word ? previous.current : null;

  return (
    <span
      ref={boxRef}
      data-slot="rotating-text"
      className={cn("relative inline-flex overflow-hidden align-bottom", className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      {...props}
    >
      {old && (
        <span key={`old-${index}`} data-slot="rotating-old" aria-hidden="true" className="absolute inset-y-0 left-0 inline-flex">
          {letters(old)}
        </span>
      )}
      <span key={index} data-slot="rotating-word" className="inline-flex" aria-label={word}>
        {letters(word)}
      </span>
    </span>
  );
}

export { RotatingText };
export type { RotatingTextProps };

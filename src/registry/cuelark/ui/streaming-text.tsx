"use client";

import * as React from "react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StreamingTextProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The text so far; append to it as tokens arrive. */
  text: string;
  streaming?: boolean;
};

/**
 * A reply arriving token by token without the jitter: each new chunk fades up out of a slight blur instead of
 * popping in, and a signal caret marks the writing edge. Everything already shown stays perfectly still.
 */
function StreamingText({ text, streaming = false, className, ...props }: StreamingTextProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [chunks, setChunks] = React.useState<string[]>(() => (text ? [text] : []));
  const seen = React.useRef(text.length);

  React.useEffect(() => {
    if (text.length < seen.current) {
      seen.current = text.length;
      setChunks(text ? [text] : []);
      return;
    }
    if (text.length === seen.current) return;
    const next = text.slice(seen.current);
    seen.current = text.length;
    setChunks((c) => [...c, next]);
  }, [text]);

  React.useLayoutEffect(() => {
    const el = ref.current;
    const last = el?.querySelector<HTMLElement>('[data-chunk]:last-of-type');
    if (!el || !last || last.dataset.shown || !motionScale(el)) return;
    last.dataset.shown = "true";
    gsap.fromTo(last, { opacity: 0, filter: "blur(3px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.35, ease: "cue", clearProps: "filter" });
  }, [chunks.length]);

  return (
    <div ref={ref} data-slot="streaming-text" className={cn("text-sm leading-relaxed whitespace-pre-wrap", className)} {...props}>
      {chunks.map((c, i) => (
        <span key={i} data-chunk>
          {c}
        </span>
      ))}
      {streaming && <span aria-hidden="true" className="ms-0.5 inline-block h-[1.05em] w-[0.45em] translate-y-[0.18em] animate-pulse rounded-[1px] bg-signal" />}
    </div>
  );
}

export { StreamingText };
export type { StreamingTextProps };

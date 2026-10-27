"use client";

import * as React from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type NumberTickerProps = Omit<React.ComponentProps<"span">, "children"> & {
  value: number;
  /** Intl formatting, e.g. `{ style: "currency", currency: "USD" }` or `{ notation: "compact" }`. */
  format?: Intl.NumberFormatOptions;
  locale?: string;
  /** Roll in on mount or when scrolled into view; later `value` changes always roll from the old value. */
  trigger?: "mount" | "inView";
  duration?: number;
};

/** Pieces of the formatted number, keyed from the right so columns persist as the value changes. */
function pieces(text: string) {
  const chars = [...text];
  return chars.map((char, i) => ({ char, key: `${chars.length - i}`, digit: /\d/.test(char) ? Number(char) : null }));
}

/**
 * An odometer: every digit is a column that rolls to its value, columns further right spin further,
 * like a mechanical counter (GSAP). Screen readers and crawlers get the plain formatted number.
 */
function NumberTicker({ value, format, locale, trigger = "inView", duration = 1.2, className, ...props }: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const formatter = React.useMemo(() => new Intl.NumberFormat(locale, format), [locale, format]);
  const text = formatter.format(value);
  const parts = pieces(text);
  const [initial] = React.useState(() => new Map(parts.map((p) => [p.key, p.digit ?? 0])));
  const started = React.useRef(false);

  const roll = React.useCallback(
    (fromZero: boolean) => {
      const root = ref.current;
      if (!root) return;
      const scale = motionScale(root);
      const columns = Array.from(root.querySelectorAll<HTMLElement>('[data-slot="ticker-column"]'));
      columns.forEach((col, i) => {
        const target = `${-Number(col.dataset.digit)}em`;
        if (!scale) return gsap.set(col, { top: target });
        if (fromZero) gsap.set(col, { top: 0 });
        const d = duration + (columns.length - i) * 0.08;
        gsap.to(col, { top: target, duration: d, ease: "power3.out", overwrite: true });
        // A touch of motion blur while the column spins, gone by the time it lands.
        gsap.fromTo(col, { filter: "blur(0px)" }, { keyframes: { filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"] }, duration: d * 0.8, ease: "none" });
      });
    },
    [duration],
  );

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      if (!started.current) {
        started.current = true;
        if (!motionScale(root)) return;
        if (trigger === "mount") roll(true);
        else {
          ref.current?.querySelectorAll('[data-slot="ticker-column"]').forEach((c) => gsap.set(c, { top: 0 }));
          ScrollTrigger.create({ trigger: root, start: "top 90%", once: true, onEnter: () => roll(false) });
        }
        return;
      }
      roll(false);
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <span ref={ref} data-slot="number-ticker" className={cn("inline-flex w-fit font-mono tabular-nums", className)} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex leading-none">
        {parts.map((p) =>
          p.digit === null ? (
            <span key={p.key}>{p.char}</span>
          ) : (
            <span key={p.key} className="relative inline-block h-[1em] w-[1ch] overflow-hidden [mask-image:linear-gradient(transparent,black_12%,black_88%,transparent)]">
              <span
                data-slot="ticker-column"
                data-digit={p.digit}
                className="cue-digits absolute inset-x-0 block leading-none"
                style={{ top: `${-(initial.get(p.key) ?? 0)}em` }}
              />
            </span>
          ),
        )}
      </span>
    </span>
  );
}

export { NumberTicker };
export type { NumberTickerProps };

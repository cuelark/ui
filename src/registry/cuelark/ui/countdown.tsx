"use client";

import * as React from "react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CountdownProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The moment to count down to. */
  to: Date | string | number;
  /** Units to show, largest first. */
  units?: ("days" | "hours" | "minutes" | "seconds")[];
  /** Called once when it reaches zero. */
  onComplete?: () => void;
  labels?: boolean;
};

const MS = { days: 86400000, hours: 3600000, minutes: 60000, seconds: 1000 };

/**
 * A countdown to a launch, sale or event. Each unit is a tile whose digits flip down when they change (GSAP);
 * the server renders the real remaining time inside a <time> element for crawlers and screen readers.
 */
function Countdown({ to, units = ["days", "hours", "minutes", "seconds"], onComplete, labels = true, className, ...props }: CountdownProps) {
  const target = React.useMemo(() => new Date(to).getTime(), [to]);
  const [now, setNow] = React.useState(() => Date.now());
  const done = React.useRef(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  let left = Math.max(0, target - now);
  const parts = units.map((u) => {
    const v = Math.floor(left / MS[u]);
    left -= v * MS[u];
    return { unit: u, value: String(v).padStart(2, "0") };
  });

  React.useEffect(() => {
    if (target - now <= 0 && !done.current) {
      done.current = true;
      onComplete?.();
    }
  }, [now, target, onComplete]);

  return (
    <div ref={ref} data-slot="countdown" role="timer" className={cn("inline-flex items-start gap-2", className)} {...props}>
      <time dateTime={new Date(target).toISOString()} className="sr-only" suppressHydrationWarning>
        {parts.map((p) => `${Number(p.value)} ${p.unit}`).join(", ")} remaining
      </time>
      {parts.map((p, i) => (
        <React.Fragment key={p.unit}>
          {i > 0 && (
            <span aria-hidden="true" className="pt-3 font-mono text-xl text-muted-foreground">
              :
            </span>
          )}
          <div aria-hidden="true" className="grid justify-items-center gap-1.5">
            <div className="flex gap-1">
              {[...p.value].map((d, j) => (
                <Digit key={j} value={d} />
              ))}
            </div>
            {labels && <span className="cue-label">{p.unit}</span>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function Digit({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const prev = React.useRef(value);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prev.current === value) return;
    prev.current = value;
    if (motionScale(el)) gsap.fromTo(el, { yPercent: -60, opacity: 0, filter: "blur(2px)" }, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.35, ease: "cue" });
  }, [value]);
  return (
    <span className="relative grid h-14 w-10 place-items-center overflow-hidden rounded-lg border border-border bg-card font-mono text-3xl font-semibold tabular-nums shadow-raised after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-border/70">
      <span ref={ref} suppressHydrationWarning>
        {value}
      </span>
    </span>
  );
}

export { Countdown };
export type { CountdownProps };

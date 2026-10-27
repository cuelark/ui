"use client";

import * as React from "react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AnimatedListProps = React.ComponentProps<"ul"> & {
  /** Milliseconds between items appearing. */
  interval?: number;
  /** Keep cycling through the items forever (a live feed). */
  loop?: boolean;
  /** Most items visible at once. */
  max?: number;
};

/**
 * A live-feed list: items arrive one by one at the top, pushing the rest down with a spring (GSAP Flip-style
 * position animation). Notifications, activity, transactions. Shows everything statically with motion off.
 */
function AnimatedList({ className, interval = 1400, loop = true, max = 5, children, ...props }: AnimatedListProps) {
  const all = React.Children.toArray(children);
  const ref = React.useRef<HTMLUListElement>(null);
  const [live, setLive] = React.useState(false);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !motionScale(el) || !all.length) return;
    setLive(true);
    setTick(0);
    const id = setInterval(() => setTick((t) => (loop || t < all.length - 1 ? t + 1 : t)), interval);
    return () => clearInterval(id);
  }, [interval, loop, all.length]);

  const newest = loop ? tick : Math.min(tick, all.length - 1);
  const shown = !live
    ? all.slice(0, max).map((node, i) => ({ key: -1 - i, node }))
    : Array.from({ length: Math.min(newest + 1, max) }, (_, i) => ({ key: newest - i, node: all[(newest - i) % all.length] }));

  const positions = React.useRef(new Map<string, number>());
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scale = motionScale(el);
    const items = Array.from(el.children) as HTMLElement[];
    items.forEach((item) => {
      const key = item.dataset.key!;
      const prev = positions.current.get(key);
      const now = item.offsetTop;
      if (!scale) return;
      if (prev === undefined) gsap.fromTo(item, { opacity: 0, scale: 0.92, y: -12 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "cue-snap" });
      else if (prev !== now) gsap.fromTo(item, { y: prev - now }, { y: 0, duration: 0.5, ease: "cue" });
    });
    positions.current = new Map(items.map((i) => [i.dataset.key!, i.offsetTop]));
  });

  return (
    <ul ref={ref} data-slot="animated-list" aria-live="polite" className={cn("grid gap-2", className)} {...props}>
      {shown.map(({ key, node }) => (
        <li key={key} data-key={key}>
          {node}
        </li>
      ))}
    </ul>
  );
}

export { AnimatedList };
export type { AnimatedListProps };

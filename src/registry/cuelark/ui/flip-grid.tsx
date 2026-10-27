"use client";

import * as React from "react";
import { Flip } from "gsap/Flip";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

type FlipGridProps = React.ComponentProps<"div"> & {
  /** Change this (the active filter, the sort order) to animate the next layout. */
  layoutKey: string | number;
};

/**
 * A grid that animates its own layout changes with GSAP Flip. Wrap items in `FlipGridItem` and toggle `hidden`
 * instead of unmounting them: items glide to new cells, leaving ones shrink out, entering ones grow in, and the
 * container eases to its new height so nothing below jumps.
 */
function FlipGrid({ className, layoutKey, children, ...props }: FlipGridProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const snapshot = React.useRef<{ state: Flip.FlipState; height: number } | null>(null);
  const lastKey = React.useRef(layoutKey);

  // Record the "before" layout during render, before React commits the change.
  if (lastKey.current !== layoutKey) {
    lastKey.current = layoutKey;
    const el = ref.current;
    if (el) snapshot.current = { state: Flip.getState(el.children, { props: "opacity" }), height: el.offsetHeight };
  }

  React.useLayoutEffect(() => {
    const el = ref.current;
    const snap = snapshot.current;
    snapshot.current = null;
    if (!el || !snap || !motionScale(el)) return;
    const height = el.offsetHeight;
    if (height !== snap.height) gsap.fromTo(el, { height: snap.height }, { height, duration: 0.5, ease: "cue", clearProps: "height" });
    Flip.from(snap.state, {
      duration: 0.5,
      ease: "cue",
      // Only leaving items are pulled out of flow; staying items animate in place, so nothing snaps at the end.
      absoluteOnLeave: true,
      stagger: 0.015,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: "cue", delay: 0.12, clearProps: "opacity,scale" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.25, ease: "cue" }),
    });
  }, [layoutKey]);

  return (
    <div ref={ref} data-slot="flip-grid" className={cn("relative grid gap-3", className)} {...props}>
      {children}
    </div>
  );
}

/** A grid item; set `hidden` to filter it out (it stays mounted so it can animate away and back). */
function FlipGridItem({ className, hidden, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="flip-grid-item" data-flip-id={props.id} hidden={hidden} className={className} style={hidden ? { display: "none" } : undefined} {...props} />;
}

export { FlipGrid, FlipGridItem };
export type { FlipGridProps };

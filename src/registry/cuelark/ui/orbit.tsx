"use client";

import * as React from "react";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type OrbitProps = React.ComponentProps<"div"> & {
  /** Orbit radius in px. */
  radius?: number;
  /** Seconds per revolution. */
  duration?: number;
  reverse?: boolean;
  /** Draw the dashed track. */
  path?: boolean;
};

/**
 * Children orbit the center at even spacing on a dashed track (integrations, avatars, logos). Items stay upright
 * while the ring turns; hover slows the whole system down. Nest several Orbits for multiple rings.
 * The radius shrinks to fit narrow containers (a size container query), so rings never spill off a phone screen.
 */
function Orbit({ className, radius = 110, duration = 24, reverse = false, path = true, children, ...props }: OrbitProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);
  const tween = React.useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const ring = el?.querySelector<HTMLElement>('[data-slot="orbit-ring"]');
      if (!el || !ring || !motionScale(el)) return;
      const dir = reverse ? -1 : 1;
      tween.current = gsap.to(ring, {
        rotate: 360 * dir,
        duration,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          const angle = Number(gsap.getProperty(ring, "rotate"));
          ring.querySelectorAll<HTMLElement>('[data-slot="orbit-item"]').forEach((i) => gsap.set(i, { rotate: -angle }));
        },
      });
    },
    { scope: ref, dependencies: [duration, reverse] },
  );

  return (
    <div
      ref={ref}
      data-slot="orbit"
      className={cn("pointer-events-none absolute inset-0 [container-type:size]", className)}
      // Requested radius, capped at half the container's short side minus room for the items.
      style={{ "--orbit-r": `min(${radius}px, 50cqmin - 1.5rem)` } as React.CSSProperties}
      onPointerEnter={() => tween.current && gsap.to(tween.current, { timeScale: 0.25, duration: 0.6 })}
      onPointerLeave={() => tween.current && gsap.to(tween.current, { timeScale: 1, duration: 0.6 })}
      {...props}
    >
      {path && <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-[calc(var(--orbit-r)*2)] -m-(--orbit-r) rounded-full border border-dashed border-border" />}
      {/* Centered with negative margins, not translate: GSAP owns this element's transform for the rotation. */}
      <div data-slot="orbit-ring" className="absolute top-1/2 left-1/2 size-[calc(var(--orbit-r)*2)] -m-(--orbit-r)">
        {items.map((child, i) => {
          const a = (i / items.length) * Math.PI * 2;
          return (
            <div key={i} className="pointer-events-auto absolute" style={{ left: `calc(var(--orbit-r) * ${1 + Math.cos(a)})`, top: `calc(var(--orbit-r) * ${1 + Math.sin(a)})`, transform: "translate(-50%, -50%)" }}>
              <div data-slot="orbit-item">{child}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Orbit };
export type { OrbitProps };

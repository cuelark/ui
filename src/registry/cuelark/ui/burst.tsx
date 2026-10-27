"use client";

import * as React from "react";
import { Slot } from "radix-ui";

import { gsap, motionScale } from "@/lib/motion";

type BurstProps = {
  children: React.ReactElement;
  /** Number of particles. */
  count?: number;
  /** Particle colors; defaults to signal and ink. */
  colors?: string[];
  /** Fire on every click (default) or only when `fire` is called through `ref`-less usage. */
  disabled?: boolean;
};

/**
 * Wrap any button: each click throws a small spray of confetti from the click point that arcs, spins and falls
 * (GSAP physics-style timeline). For moments worth celebrating: completed onboarding, a first deploy, a like.
 */
function Burst({ children, count = 18, colors = ["var(--signal)", "var(--foreground)", "var(--muted-foreground)"], disabled }: BurstProps) {
  const fire = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const scale = motionScale(e.currentTarget);
    if (!scale) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2;
    const y = e.clientY || r.top + r.height / 2;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const size = 4 + Math.random() * 5;
      Object.assign(p.style, {
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size * (Math.random() > 0.5 ? 1 : 0.45)}px`,
        background: colors[i % colors.length]!,
        borderRadius: Math.random() > 0.6 ? "999px" : "1px",
        pointerEvents: "none",
        zIndex: "100",
      });
      document.body.appendChild(p);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
      const v = (70 + Math.random() * 110) * Math.min(scale, 1.5);
      gsap
        .timeline({ onComplete: () => p.remove() })
        .to(p, { x: Math.cos(angle) * v, y: Math.sin(angle) * v, rotate: (Math.random() - 0.5) * 540, duration: 0.5, ease: "power3.out" })
        .to(p, { y: `+=${120 + Math.random() * 80}`, x: `+=${(Math.random() - 0.5) * 60}`, opacity: 0, rotate: "+=180", duration: 0.9, ease: "power1.in" });
    }
  };

  return (
    <Slot.Root
      data-slot="burst"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        (children.props as { onClick?: (e: React.MouseEvent<HTMLElement>) => void }).onClick?.(e);
        fire(e);
      }}
    >
      {children}
    </Slot.Root>
  );
}

export { Burst };
export type { BurstProps };

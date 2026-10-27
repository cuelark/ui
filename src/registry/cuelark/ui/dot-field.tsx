"use client";

import * as React from "react";

import { motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type DotFieldProps = React.ComponentProps<"div"> & {
  /** Distance between dots in px. */
  gap?: number;
  /** Radius (px) around the pointer where dots react. */
  radius?: number;
  /** Clicking sends a ripple across the field. */
  ripple?: boolean;
};

/**
 * An interactive dot grid background on canvas: dots near the pointer swell and take the signal color, and a click
 * sends a ripple across the field. Theme-aware (reads tokens), DPR-sharp, paused when off screen; static with motion off.
 */
function DotField({ className, gap = 22, radius = 120, ripple = true, children, ...props }: DotFieldProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const host = ref.current;
    const canvas = host?.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas || !ctx) return;
    let w = 0;
    let h = 0;
    let frame = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };
    const waves: { x: number; y: number; t: number }[] = [];
    const animated = motionScale(host) > 0;
    const color = (name: string) => getComputedStyle(host).getPropertyValue(name).trim() || "#888";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const base = color("--cl-mark");
      const signal = color("--signal");
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          let k = 0;
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          if (d < radius) k = 1 - d / radius;
          for (const wv of waves) {
            const r = (time - wv.t) * 0.45;
            const dd = Math.abs(Math.hypot(x - wv.x, y - wv.y) - r);
            if (dd < 30) k = Math.max(k, (1 - dd / 30) * Math.max(0, 1 - r / Math.max(w, h)));
          }
          ctx.globalAlpha = 0.35 + k * 0.65;
          ctx.fillStyle = k > 0.15 ? signal : base;
          ctx.beginPath();
          ctx.arc(x, y, 1 + k * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      while (waves.length && time - waves[0]!.t > 4000) waves.shift();
      if (animated && visible) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    const onDown = (e: PointerEvent) => {
      if (!ripple) return;
      const r = host.getBoundingClientRect();
      waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (!animated) draw(0);
    });
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible && animated) frame = requestAnimationFrame(draw);
    });
    io.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    draw(performance.now());
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [gap, radius, ripple]);

  return (
    <div ref={ref} data-slot="dot-field" className={cn("relative overflow-hidden", className)} {...props}>
      <canvas aria-hidden="true" className="absolute inset-0" />
      <div className="relative">{children}</div>
    </div>
  );
}

export { DotField };
export type { DotFieldProps };

"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** A value tag above each thumb while dragging, hovering or focused. It swings with drag speed. */
  showValue?: boolean;
  /** Formats the tag and tick labels, e.g. `(v) => \`${v}%\``. */
  format?: (value: number) => string;
  /** Values to label under the track; they bump like detents as the thumb passes them. */
  ticks?: number[];
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * A range slider with physical feedback (GSAP): the thumb swells on grab, the value tag springs in and swings
 * with the speed of the drag like a hanging label, ticks bump as you pass them, and the thumb squashes at the ends.
 */
function Slider({ className, defaultValue, value, min = 0, max = 100, onValueChange, showValue = false, format = String, ticks, orientation, ...props }: SliderProps) {
  const [internal, setInternal] = React.useState<number[]>(() => value ?? defaultValue ?? [min]);
  const values = value ?? internal;
  const [active, setActive] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  const last = React.useRef({ values, t: 0 });
  const settle = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const range = max - min || 1;
  const vertical = orientation === "vertical";

  const all = (slot: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`) ?? []);

  React.useEffect(() => {
    if (!active) return;
    const up = () => setActive(false);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [active]);

  React.useEffect(() => {
    const scale = root.current ? motionScale(root.current) : 0;
    gsap.to(all("slider-thumb"), { scale: active ? 1 + 0.2 * Math.min(scale, 1.5) : 1, duration: scale ? 0.2 : 0, ease: "cue" });
  }, [active]);

  // The tag is for precise adjustment: it appears while dragging or using the keyboard, not on casual hover.
  const show = showValue && (active || focus);
  React.useEffect(() => {
    const tags = all("slider-tag");
    if (!tags.length) return;
    const scale = root.current ? motionScale(root.current) : 0;
    gsap.to(tags, show ? { opacity: 1, scale: 1, y: 0, duration: scale ? 0.32 : 0, ease: "back.out(2.2)", overwrite: "auto" } : { opacity: 0, scale: 0.85, y: 6, duration: scale ? 0.15 : 0, ease: "cue", overwrite: "auto" });
  }, [show]);

  const react = (next: number[]) => {
    const el = root.current;
    const scale = el ? motionScale(el) : 0;
    const now = performance.now();
    const prev = last.current;
    last.current = { values: next, t: now };
    if (!el || !scale) return;
    const dt = Math.max(16, now - prev.t);
    next.forEach((v, i) => {
      const p = prev.values[i] ?? v;
      // Swing the tag against the direction of travel, proportional to speed.
      const tag = el.querySelector<HTMLElement>(`[data-slot="slider-tag"][data-index="${i}"]`);
      if (tag && !vertical) gsap.to(tag, { rotation: clamp((-(v - p) / range) * (1000 / dt) * 22 * scale, -18, 18), duration: 0.12, ease: "cue", overwrite: "auto" });
      // Detents: bump each tick the thumb crossed.
      ticks?.forEach((t) => {
        if ((p < t && v >= t) || (p > t && v <= t)) {
          const tick = el.querySelector<HTMLElement>(`[data-slot="slider-tick"][data-value="${t}"]`);
          if (tick) gsap.fromTo(tick, { y: -3 * scale, scale: 1.15 }, { y: 0, scale: 1, duration: 0.35, ease: "cue-snap" });
        }
      });
      // Ends: a small squash when the thumb hits min or max.
      if ((v === min || v === max) && p !== v) {
        const thumb = el.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]')[i];
        if (thumb) gsap.fromTo(thumb, { scaleX: vertical ? 1.15 : 0.8, scaleY: vertical ? 0.8 : 1.15 }, { scaleX: 1, scaleY: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
      }
    });
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => gsap.to(all("slider-tag"), { rotation: 0, duration: 0.7, ease: "elastic.out(1, 0.35)" }), 80);
  };

  const nearestTick = ticks?.reduce((a, b) => (Math.abs(b - (values[0] ?? 0)) < Math.abs(a - (values[0] ?? 0)) ? b : a), ticks[0]!);

  return (
    <div data-slot="slider-wrapper" className={cn("grid w-full gap-2 data-[orientation=vertical]:h-full", className)} data-orientation={orientation}>
      <SliderPrimitive.Root
        ref={root}
        data-slot="slider"
        data-active={active || undefined}
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        orientation={orientation}
        onValueChange={(v) => {
          setInternal(v);
          react(v);
          onValueChange?.(v);
        }}
        onPointerDown={() => setActive(true)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="group/slider relative flex w-full touch-none items-center py-1.5 select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-1.5 data-[orientation=vertical]:py-0"
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted shadow-well transition-[height,width] duration-200 ease-cue data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full group-data-[active]/slider:data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 group-data-[active]/slider:data-[orientation=vertical]:w-2.5"
        >
          <SliderPrimitive.Range data-slot="slider-range" className="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
        </SliderPrimitive.Track>
        {values.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            data-slot="slider-thumb"
            className="relative block size-4.5 shrink-0 cursor-grab rounded-full border border-primary/80 bg-background shadow-control outline-none transition-[box-shadow] duration-150 ease-cue hover:ring-4 hover:ring-ring/20 focus-visible:ring-4 focus-visible:ring-ring/40 active:cursor-grabbing disabled:pointer-events-none"
          >
            {showValue && (
              <span aria-hidden="true" className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2">
                <span
                  data-slot="slider-tag"
                  data-index={i}
                  className="relative block origin-bottom rounded-full bg-foreground px-2.5 py-1.5 font-mono text-xs leading-none font-medium whitespace-nowrap text-background tabular-nums opacity-0 shadow-overlay after:absolute after:top-[calc(100%-3px)] after:left-1/2 after:size-2 after:-translate-x-1/2 after:rotate-45 after:rounded-[2px] after:bg-foreground"
                >
                  {format(v)}
                </span>
              </span>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
      {ticks && !vertical && (
        <div data-slot="slider-ticks" aria-hidden="true" className="relative h-4 font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
          {ticks.map((t) => {
            const pct = (t - min) / range;
            return (
              <span key={t} className="absolute -translate-x-1/2" style={{ left: `calc(${pct * 100}% + ${9 - pct * 18}px)` }}>
                <span
                  data-slot="slider-tick"
                  data-value={t}
                  className={cn("block transition-colors duration-150", t === nearestTick && values.length === 1 && "font-medium text-foreground")}
                >
                  {format(t)}
                </span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { Slider };
export type { SliderProps };

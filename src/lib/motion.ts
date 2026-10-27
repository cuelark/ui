"use client";

/**
 * Cuelark motion: the GSAP layer every animated component shares.
 *
 *   --cl-motion   0 = off · 1 = default · 1.5 = expressive. Read from the nearest element, so a subtree
 *                 can calm down or liven up. `prefers-reduced-motion: reduce` always wins (scale 0).
 *
 * The scale multiplies amplitude (distance, overshoot, rotation), not duration, so expressive motion
 * still feels quick, and every tween collapses to an instant `set` when motion is off.
 */
import * as React from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

// Register in the browser only: GSAP starts its ticker on registration, and server runtimes such as
// Cloudflare Workers forbid timers at module scope. Nothing animates during SSR anyway.
const browser = typeof window !== "undefined";
if (browser) gsap.registerPlugin(useGSAP, CustomEase);

/** A strong ease-out: instant response, long settle (same curve as the `ease-cue` CSS token). */
if (browser) CustomEase.create("cue", "M0,0 C0.23,1 0.32,1 1,1");
/** Lands slightly past the target and settles back: for things that snap into place. */
if (browser) CustomEase.create("cue-snap", "M0,0 C0.25,1.4 0.4,1 1,1");

export function motionScale(el?: Element | null): number {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  const raw = getComputedStyle(el ?? document.documentElement).getPropertyValue("--cl-motion");
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? Math.max(0, value) : 1;
}

/** `gsap.to` that becomes `gsap.set` when motion is off for the target. */
export function cueTo(target: Element, vars: gsap.TweenVars, scale = motionScale(target)) {
  return scale === 0 ? gsap.set(target, { ...vars, duration: 0, delay: 0 }) : gsap.to(target, { ease: "cue", duration: 0.35, ...vars });
}

/**
 * The signature press feedback: a thin ring that ripples out from the pointer and fades.
 * The host needs `position: relative` and `overflow: hidden`.
 */
export function cuePing(host: HTMLElement, event: { clientX: number; clientY: number }) {
  const scale = motionScale(host);
  if (scale === 0) return;
  const rect = host.getBoundingClientRect();
  const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
  const y = event.clientY ? event.clientY - rect.top : rect.height / 2;
  const size = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 2;
  const ring = document.createElement("span");
  ring.setAttribute("aria-hidden", "true");
  ring.dataset.slot = "ping";
  Object.assign(ring.style, {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    marginLeft: `${-size / 2}px`,
    marginTop: `${-size / 2}px`,
    borderRadius: "9999px",
    border: "1.5px solid var(--signal, currentColor)",
    pointerEvents: "none",
  });
  host.appendChild(ring);
  gsap.fromTo(ring, { scale: 0.1, opacity: 0.5 }, { scale: 1, opacity: 0, duration: 0.55 + 0.1 * scale, ease: "cue", onComplete: () => ring.remove() });
}

const SIDE_OFFSET: Record<string, [number, number]> = { top: [0, 5], bottom: [0, -5], left: [5, 0], right: [-5, 0] };

/**
 * Overlay entrance (tooltips, popovers, menus, selects): springs out of the side it is anchored to,
 * reading Radix's `data-side`. Pass it as a ref callback; exits stay on CSS so Radix can await them.
 */
export function popIn(node: HTMLElement | null) {
  // Radix marks tooltips opened during the skip-delay window: those appear instantly, which makes a toolbar feel fast.
  if (node?.dataset.state === "instant-open") return;
  const [x, y] = SIDE_OFFSET[node?.dataset.side ?? "bottom"] ?? [0, 0];
  enterOnce(node, (s) => ({ opacity: 0, scale: 1 - 0.04 * s, x: x * s, y: y * s }), { duration: 0.18 });
}

const entered = new WeakSet<Element>();
const REST = { opacity: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, rotate: 0, filter: "none" };

/**
 * Entrance that runs exactly once per element and always lands on explicit resting values, then hands the
 * styles back to CSS (clearProps). Safe as a ref callback even if React attaches the ref more than once:
 * a second `gsap.from` would otherwise capture the half-faded state as its end value.
 */
export function enterOnce(node: Element | null, from: (scale: number) => gsap.TweenVars, vars: gsap.TweenVars = {}) {
  if (!node || entered.has(node)) return;
  entered.add(node);
  const scale = motionScale(node);
  if (!scale) return;
  const start = from(scale);
  const rest = Object.fromEntries(Object.keys(start).map((k) => [k, REST[k as keyof typeof REST] ?? 0]));
  gsap.fromTo(node, start, { ...rest, duration: 0.4, ease: "cue", ...vars, clearProps: Object.keys(start).join(",") });
}

/** Staggered entrance for a set of children, with the same explicit resting values. */
export function enterChildren(targets: ArrayLike<Element>, from: gsap.TweenVars, vars: gsap.TweenVars = {}) {
  if (!targets.length) return;
  const rest = Object.fromEntries(Object.keys(from).map((k) => [k, REST[k as keyof typeof REST] ?? 0]));
  gsap.fromTo(targets, from, { ...rest, duration: 0.4, ease: "cue", stagger: 0.04, ...vars, clearProps: Object.keys(from).join(",") });
}

/** Crop marks close in on an element (it needs the `cue-marks` utility): a registration "lock". */
export function marksIn(node: HTMLElement, delay = 0) {
  const scale = motionScale(node);
  if (!scale) return;
  gsap.fromTo(node, { "--cl-mark-gap": `${4 + 14 * scale}px` }, { "--cl-mark-gap": "4px", duration: 0.6, ease: "cue", delay });
}

/**
 * Runs `onChange` whenever an attribute on the element changes (e.g. Radix's `data-state`), so motion
 * follows state no matter whether it changed from a click, the keyboard or a controlled prop.
 */
export function useAttributeCue<T extends HTMLElement>(ref: React.RefObject<T | null>, attribute: string, onChange: (value: string | null, el: T) => void) {
  const callback = React.useRef(onChange);
  callback.current = onChange;
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = el.getAttribute(attribute);
    const observer = new MutationObserver(() => {
      const value = el.getAttribute(attribute);
      if (value === last) return;
      last = value;
      callback.current(value, el);
    });
    observer.observe(el, { attributes: true, attributeFilter: [attribute] });
    return () => observer.disconnect();
  }, [ref, attribute]);
}

/** Combines a local ref with the one passed in props (React 19 passes `ref` as a regular prop). */
export function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return React.useCallback((node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.RefObject<T | null>).current = node;
    }
  }, refs);
}

export { gsap, useGSAP };

/** A brief signal-colored halo around an element: "this just changed" (a tool finished, a task completed). */
export function flash(node: Element | null) {
  if (!node || !motionScale(node)) return;
  gsap.fromTo(
    node,
    { boxShadow: "0 0 0 0px color-mix(in oklch, var(--signal) 55%, transparent)" },
    { boxShadow: "0 0 0 6px color-mix(in oklch, var(--signal) 0%, transparent)", duration: 0.7, ease: "cue", clearProps: "boxShadow" },
  );
}

/** An elastic pop for status marks (checks, badges) as they appear. */
export function pop(node: Element | null, from = 0.5) {
  if (!node || !motionScale(node)) return;
  gsap.fromTo(node, { scale: from, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1.1, 0.5)", clearProps: "transform,opacity" });
}

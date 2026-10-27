"use client";

import * as React from "react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Animation =
  | "auto"
  | "pop"
  | "wiggle"
  | "spin"
  | "bounce"
  | "pulse"
  | "shake"
  | "float"
  | "flip"
  | "tada"
  | "ring"
  | "beat"
  | "nudge-right"
  | "nudge-left"
  | "nudge-up"
  | "nudge-down"
  | "fly"
  | "turn"
  | "spin-back"
  | "twinkle"
  | "zoom"
  | "blink"
  | "wave"
  | "flicker"
  | "grow"
  | "drive"
  | "drop"
  | "nod"
  | "write"
  | "rock"
  | "launch";
type Trigger = "hover" | "click" | "mount" | "inView" | "loop";

type AnimatedIconProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Any icon element: react-icons, lucide-react, an installed Cuelark icon or a raw <svg>. */
  children: React.ReactNode;
  /** "auto" (default) picks a motion that fits the icon from its name: bells ring, arrows nudge, gears turn… */
  animation?: Animation;
  /** The icon's name, e.g. "LuBell" or "arrow right", used by "auto". Read from the child component when omitted. */
  name?: string;
  trigger?: Trigger;
  /** Seconds; each animation has a tuned default. */
  duration?: number;
};

const ANIMATIONS = ["auto", "pop", "wiggle", "spin", "bounce", "shake", "float", "flip", "tada", "ring", "twinkle", "fly", "blink", "wave"] as const;

/** Name → motion. Ordered: the first rule that matches wins. */
const RULES: [RegExp, Animation][] = [
  [/bell|notification|alarm|phone|call|ring/, "ring"],
  [/heart|like|love|favorite/, "beat"],
  [/send|paper ?plane|plane|flight/, "fly"],
  [/rocket|launch/, "launch"],
  [/undo|rotate ?ccw|counter/, "spin-back"],
  [/refresh|sync|reload|rotate|loader|spinner|loading|repeat|redo|replay|update|cycle/, "spin"],
  [/setting|gear|cog|tune|cogs/, "turn"],
  [/wrench|tool|hammer|screwdriver|build|construct/, "wiggle"],
  [/\b(plus|add|close|x|times|cross|xmark)\b/, "turn"],
  [/trash|delete|bin|remove|erase/, "shake"],
  [/lock|key|shield|secure|ban|block|warning|alert|error/, "shake"],
  [/check|tick|done|success|verified|approve/, "pop"],
  [/star|sparkle|magic|wand|shine|glitter|award|trophy|medal|crown/, "twinkle"],
  [/search|magnif|zoom|find|scan/, "zoom"],
  [/download|inbox|import|save|arrow ?down|chevron ?down|caret ?down|angle ?down|sort ?down|south/, "nudge-down"],
  [/upload|export|share|arrow ?up|chevron ?up|caret ?up|angle ?up|north|trending ?up/, "nudge-up"],
  [/arrow ?left|chevron ?left|caret ?left|angle ?left|back|previous|prev|west|rewind/, "nudge-left"],
  [/arrow|chevron|caret|angle|next|forward|right|east|login|logout|exit|external|redirect|enter/, "nudge-right"],
  [/eye|view|visib|watch|look/, "blink"],
  [/flag|banner|wave/, "wave"],
  [/fire|flame|zap|bolt|lightning|flash|spark|battery|power|plug|energy/, "flicker"],
  [/chart|graph|bar|analytic|stat|trending|growth|pie|poll/, "grow"],
  [/cart|truck|car|bike|bus|shipping|delivery|train|taxi|vehicle/, "drive"],
  [/pin|map|location|marker|place|navigation|compass/, "drop"],
  [/user|person|profile|account|people|group|team|contact|avatar|smile|face|emoji|mood/, "nod"],
  [/edit|pen|pencil|write|brush|paint|draw|sign|signature|highlight/, "write"],
  [/globe|world|earth|planet|language|translate|internet|coin|dollar|money|currency/, "flip"],
  [/moon|night|dark/, "rock"],
  [/sun|light|bright|day/, "spin"],
  [/cloud|wind|weather|rain|snow|feather|balloon|bubble/, "float"],
  [/music|headphone|volume|speaker|audio|sound|mic|podcast|radio/, "bounce"],
  [/mail|envelope|message|chat|comment|inbox|sms|reply/, "tada"],
  [/gift|present|bug|party|confetti|celebrat/, "wiggle"],
  [/play|video|film|movie|youtube/, "pop"],
  [/clock|time|timer|watch|hourglass|history|calendar|schedule|stopwatch/, "spin"],
];

/** Picks the animation that best fits an icon name (react-icons names like "LuArrowUpRight" or plain words). */
export function animationFor(name: string | undefined): Exclude<Animation, "auto"> {
  if (!name) return "pop";
  const words = name
    .replace(/^(Ai|Bi|Bs|Cg|Ci|Di|Fa6?|Fc|Fi|Gi|Go|Gr|Hi2?|Im|Io5?|Lia|Lu|Md|Pi|Ri|Rx|Si|Sl|Tb|Tfi|Ti|Vsc|Wi)(?=[A-Z0-9])/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase();
  for (const [re, a] of RULES) if (re.test(words)) return a as Exclude<Animation, "auto">;
  return "pop";
}

/** Builds the timeline for one play of an animation (scaled by --cl-motion). */
function play(el: HTMLElement, animation: Exclude<Animation, "auto">, s: number, duration?: number) {
  const tl = gsap.timeline();
  const d = (v: number) => (duration ?? v) / Math.max(0.5, Math.min(s, 1.5));
  switch (animation) {
    case "pop":
      tl.to(el, { scale: 1 + 0.16 * s, duration: d(0.14), ease: "power2.out" }).to(el, { scale: 1, duration: d(0.55), ease: "elastic.out(1, 0.5)" });
      break;
    case "wiggle":
      tl.to(el, { keyframes: { rotate: [0, -14 * s, 12 * s, -8 * s, 5 * s, 0] }, duration: d(0.6), ease: "power1.inOut" });
      break;
    case "spin":
      tl.to(el, { rotate: "+=360", duration: d(0.75), ease: "power2.inOut" });
      break;
    case "bounce":
      tl.to(el, { y: -6 * s, duration: d(0.18), ease: "power2.out" }).to(el, { y: 0, duration: d(0.6), ease: "bounce.out" });
      break;
    case "pulse":
      tl.to(el, { scale: 1 + 0.15 * s, opacity: 0.7, duration: d(0.2), ease: "power1.out" }).to(el, { scale: 1, opacity: 1, duration: d(0.35), ease: "power1.in" });
      break;
    case "shake":
      tl.to(el, { keyframes: { x: [0, -3 * s, 3 * s, -2 * s, 2 * s, 0] }, duration: d(0.4), ease: "none" });
      break;
    case "float":
      tl.to(el, { y: -4 * s, duration: d(0.9), ease: "sine.inOut", yoyo: true, repeat: 1 });
      break;
    case "flip":
      tl.fromTo(el, { rotateY: 0 }, { rotateY: 360, duration: d(0.7), ease: "cue", transformPerspective: 200 });
      break;
    case "tada":
      tl.to(el, { keyframes: { scale: [1, 0.9, 1.15, 1.15, 1.15, 1], rotate: [0, -6, 6, -6, 6, 0] }, duration: d(0.8), ease: "power1.inOut" });
      break;
    case "ring":
      tl.set(el, { transformOrigin: "50% 8%" }).to(el, { keyframes: { rotate: [0, 18 * s, -16 * s, 12 * s, -8 * s, 4 * s, 0] }, duration: d(0.8), ease: "power1.out" });
      break;
    case "beat":
      tl.to(el, { keyframes: { scale: [1, 1 + 0.22 * s, 1, 1 + 0.12 * s, 1] }, duration: d(0.7), ease: "power1.inOut" });
      break;
    case "nudge-right":
    case "nudge-left":
    case "nudge-up":
    case "nudge-down": {
      const axis = animation === "nudge-right" || animation === "nudge-left" ? "x" : "y";
      const sign = animation === "nudge-right" || animation === "nudge-down" ? 1 : -1;
      tl.to(el, { [axis]: 4 * s * sign, duration: d(0.16), ease: "power2.out" })
        .to(el, { [axis]: 0, duration: d(0.16), ease: "power2.in" })
        .to(el, { [axis]: 2.5 * s * sign, duration: d(0.14), ease: "power2.out" })
        .to(el, { [axis]: 0, duration: d(0.3), ease: "elastic.out(1, 0.5)" });
      break;
    }
    case "fly":
      tl.to(el, { x: 14 * s, y: -14 * s, opacity: 0, rotate: -8, duration: d(0.28), ease: "power2.in" })
        .set(el, { x: -14 * s, y: 14 * s })
        .to(el, { x: 0, y: 0, opacity: 1, rotate: 0, duration: d(0.4), ease: "cue" });
      break;
    case "launch":
      tl.to(el, { y: 3 * s, duration: d(0.12), ease: "power1.out" })
        .to(el, { y: -16 * s, opacity: 0, duration: d(0.3), ease: "power3.in" })
        .set(el, { y: 12 * s })
        .to(el, { y: 0, opacity: 1, duration: d(0.4), ease: "cue" });
      break;
    case "turn":
      // Accumulates (90°, 180°…) so a turned gear or plus never snaps back.
      tl.to(el, { rotate: "+=90", duration: d(0.55), ease: "back.out(1.7)" });
      break;
    case "spin-back":
      tl.to(el, { rotate: "-=360", duration: d(0.75), ease: "power2.inOut" });
      break;
    case "twinkle":
      tl.to(el, { scale: 1 + 0.18 * s, rotate: 16 * s, duration: d(0.22), ease: "power2.out" }).to(el, { scale: 1, rotate: 0, duration: d(0.7), ease: "elastic.out(1, 0.45)" });
      break;
    case "zoom":
      tl.to(el, { scale: 1 + 0.18 * s, rotate: -12 * s, duration: d(0.22), ease: "power2.out" }).to(el, { scale: 1, rotate: 0, duration: d(0.45), ease: "back.out(2)" });
      break;
    case "blink":
      tl.to(el, { scaleY: 0.1, duration: d(0.09), ease: "power2.in" }).to(el, { scaleY: 1, duration: d(0.16), ease: "power2.out" });
      break;
    case "wave":
      tl.set(el, { transformOrigin: "0% 100%" }).to(el, { keyframes: { skewX: [0, -12 * s, 10 * s, -6 * s, 0], rotate: [0, -4 * s, 3 * s, 0, 0] }, duration: d(0.8), ease: "sine.inOut" });
      break;
    case "flicker":
      tl.to(el, { keyframes: { opacity: [1, 0.35, 1, 0.6, 1], scale: [1, 1.08, 0.96, 1.05, 1] }, duration: d(0.5), ease: "none" });
      break;
    case "grow":
      tl.set(el, { transformOrigin: "50% 100%" }).fromTo(el, { scaleY: 0.4 }, { scaleY: 1, duration: d(0.55), ease: "elastic.out(1, 0.5)" });
      break;
    case "drive":
      tl.to(el, { x: 18 * s, opacity: 0, duration: d(0.3), ease: "power2.in" })
        .set(el, { x: -18 * s })
        .to(el, { x: 0, opacity: 1, duration: d(0.45), ease: "cue" });
      break;
    case "drop":
      tl.fromTo(el, { y: -10 * s }, { y: 0, duration: d(0.6), ease: "bounce.out" });
      break;
    case "nod":
      tl.to(el, { keyframes: { y: [0, -2.5 * s, 0, -1.5 * s, 0], rotate: [0, -5 * s, 0, 3 * s, 0] }, duration: d(0.6), ease: "power1.inOut" });
      break;
    case "write":
      tl.set(el, { transformOrigin: "10% 90%" }).to(el, { keyframes: { rotate: [0, -14 * s, -6 * s, -14 * s, 0], x: [0, 2, 4, 6, 0] }, duration: d(0.7), ease: "power1.inOut" });
      break;
    case "rock":
      tl.to(el, { keyframes: { rotate: [0, -18 * s, 12 * s, -6 * s, 0] }, duration: d(0.8), ease: "sine.inOut" });
      break;
  }
  return tl;
}

/**
 * Brings any icon to life with GSAP: pop, wiggle, spin, bounce, pulse, shake, float, flip, tada, ring and more. Plays on hover, click, mount, when scrolled into view, or on a loop; follows
 * --cl-motion and stays still for reduced motion.
 */
function AnimatedIcon({ children, animation: requested = "auto", name, trigger = "hover", duration, className, onPointerEnter, onClick, ...props }: AnimatedIconProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const childName = React.isValidElement(children) ? ((children.type as { displayName?: string; name?: string }).displayName ?? (children.type as { name?: string }).name) : undefined;
  const animation = requested === "auto" ? animationFor(name ?? childName) : requested;
  const tl = React.useRef<gsap.core.Timeline | null>(null);

  const resolved = animation;

  const run = React.useCallback(() => {
    const el = ref.current;
    const s = el ? motionScale(el) : 0;
    if (!el || !s || tl.current?.isActive()) return;
    tl.current = play(el, resolved, s, duration);
  }, [resolved, duration]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !motionScale(el)) return;
    if (trigger === "mount") run();
    if (trigger === "loop") {
      const loop = () => {
        tl.current = play(el, resolved, motionScale(el), duration);
        tl.current.eventCallback("onComplete", () => void gsap.delayedCall(0.6, loop));
      };
      loop();
      return () => {
        tl.current?.kill();
        gsap.killTweensOf(loop);
      };
    }
    if (trigger === "inView") {
      const io = new IntersectionObserver(([e]) => e?.isIntersecting && (run(), io.disconnect()), { threshold: 0.6 });
      io.observe(el);
      return () => io.disconnect();
    }
  }, [trigger, resolved, duration, run]);

  return (
    <span
      ref={ref}
      data-slot="animated-icon"
      data-animation={animation}
      data-resolved={resolved}
      className={cn("inline-flex shrink-0 items-center justify-center will-change-transform [&>svg]:size-[1em]", className)}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (trigger === "hover") run();
      }}
      onClick={(e) => {
        onClick?.(e);
        if (trigger === "click") run();
      }}
      {...props}
    >
      {children}
    </span>
  );
}

export { AnimatedIcon, ANIMATIONS };
export type { AnimatedIconProps, Animation as IconAnimation, Trigger as IconTrigger };

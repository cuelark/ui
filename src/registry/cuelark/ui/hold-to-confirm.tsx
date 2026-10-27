"use client";

import * as React from "react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type HoldToConfirmProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  /** Called once the hold completes. */
  onConfirm: () => void;
  /** How long to hold, in ms. */
  duration?: number;
  /** Label shown while holding. */
  holdingLabel?: React.ReactNode;
  variant?: "destructive" | "primary";
};

/**
 * A button you press and hold to confirm a destructive action, so a stray click never deletes anything.
 * A fill sweeps across while held (linear: it is a timer), snaps back if released early, and the button
 * shakes off a confirmation pulse when done. Keyboard: hold Space or Enter.
 */
function HoldToConfirm({ onConfirm, duration = 1400, holdingLabel = "Keep holding…", variant = "destructive", className, children, disabled, ...props }: HoldToConfirmProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const fill = React.useRef<HTMLSpanElement>(null);
  const tween = React.useRef<gsap.core.Tween | null>(null);
  const [holding, setHolding] = React.useState(false);

  const start = () => {
    if (disabled || !fill.current) return;
    setHolding(true);
    tween.current?.kill();
    tween.current = gsap.to(fill.current, {
      clipPath: "inset(0 0% 0 0)",
      duration: duration / 1000,
      ease: "none",
      onComplete: () => {
        setHolding(false);
        onConfirm();
        const el = ref.current;
        if (el && motionScale(el)) gsap.fromTo(el, { scale: 0.96 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
        gsap.to(fill.current, { clipPath: "inset(0 100% 0 0)", duration: 0.35, ease: "cue", delay: 0.4 });
      },
    });
  };
  const cancel = () => {
    if (!tween.current?.isActive()) return;
    tween.current.kill();
    setHolding(false);
    gsap.to(fill.current, { clipPath: "inset(0 100% 0 0)", duration: 0.2, ease: "cue" });
  };

  const tone = variant === "destructive" ? "bg-destructive text-white" : "bg-primary text-primary-foreground";

  return (
    <button
      ref={ref}
      type="button"
      data-slot="hold-to-confirm"
      data-holding={holding || undefined}
      disabled={disabled}
      aria-label={typeof children === "string" ? `${children} (press and hold)` : undefined}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={(e) => (e.key === " " || e.key === "Enter") && cancel()}
      className={cn(
        "relative isolate inline-flex h-ctl-md items-center justify-center overflow-hidden rounded-lg border border-border bg-background px-4 text-sm font-medium select-none outline-none transition-[scale] duration-150 ease-cue focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        variant === "destructive" ? "text-destructive" : "text-foreground",
        className,
      )}
      {...props}
    >
      <span className="relative inline-flex items-center gap-1.5 whitespace-nowrap [&_svg]:size-4 [&_svg]:shrink-0">{holding ? holdingLabel : children}</span>
      <span ref={fill} aria-hidden="true" className={cn("absolute inset-0 flex items-center justify-center gap-1.5 whitespace-nowrap [clip-path:inset(0_100%_0_0)] [&_svg]:size-4 [&_svg]:shrink-0", tone)}>
        {holding ? holdingLabel : children}
      </span>
    </button>
  );
}

export { HoldToConfirm };
export type { HoldToConfirmProps };

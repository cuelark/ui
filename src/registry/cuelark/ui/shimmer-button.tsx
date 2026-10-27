"use client";

import * as React from "react";
import { Slot } from "radix-ui";

import { cuePing, gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ShimmerButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  /** Seconds between sweeps. */
  interval?: number;
};

/**
 * A call-to-action whose surface catches the light: a soft band sweeps across it on a loop (GSAP timeline),
 * pausing while hovered so the button feels alive but never restless. Ink on paper, signal on press.
 */
function ShimmerButton({ className, asChild, interval = 2.6, children, onPointerDown, ...props }: ShimmerButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const tl = React.useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const band = el?.querySelector('[data-slot="shimmer-band"]');
      if (!el || !band || !motionScale(el)) return;
      tl.current = gsap
        .timeline({ repeat: -1, repeatDelay: interval })
        .fromTo(band, { xPercent: -120 }, { xPercent: 220, duration: 1.1, ease: "power2.inOut" });
    },
    { scope: ref, dependencies: [interval] },
  );

  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      ref={ref}
      data-slot="shimmer-button"
      className={cn(
        "group/shimmer relative isolate inline-flex h-ctl-lg items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[inset_0_1px_0_var(--cl-highlight),0_0_0_1px_color-mix(in_oklch,var(--primary),var(--foreground)_15%),0_8px_24px_-8px_color-mix(in_oklch,var(--primary),transparent_40%)] outline-none transition-[scale,box-shadow] duration-200 ease-cue focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
        className,
      )}
      onPointerEnter={() => tl.current?.pause()}
      onPointerLeave={() => tl.current?.resume()}
      onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        cuePing(e.currentTarget, e);
      }}
      {...props}
    >
      <span
        data-slot="shimmer-band"
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/2 -translate-x-full skew-x-[-20deg] bg-linear-to-r from-transparent via-primary-foreground/25 to-transparent"
      />
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
    </Comp>
  );
}

export { ShimmerButton };
export type { ShimmerButtonProps };

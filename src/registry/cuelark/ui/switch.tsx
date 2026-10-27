"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { gsap, motionScale, useAttributeCue, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "group/switch peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input p-0.5 shadow-well outline-none transition-colors duration-200 ease-cue focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive data-[state=checked]:bg-signal",
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        md: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** CSS moves the thumb (its `translate`); GSAP squashes an inner face, so the two animations never touch the same element. */
const thumbVariants = cva(
  "group/thumb pointer-events-none relative block h-full transition-[translate,width] duration-200 ease-cue motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "w-3 group-active/switch:w-3.5 data-[state=checked]:translate-x-3 data-[state=checked]:group-active/switch:translate-x-2.5",
        md: "w-4 group-active/switch:w-5 data-[state=checked]:translate-x-4 data-[state=checked]:group-active/switch:translate-x-3",
        lg: "w-5 group-active/switch:w-6 data-[state=checked]:translate-x-5 data-[state=checked]:group-active/switch:translate-x-4",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & VariantProps<typeof switchVariants>;

function Switch({ className, size = "md", ref, ...props }: SwitchProps) {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const thumbRef = React.useRef<HTMLSpanElement>(null);
  const mergedRef = useMergedRef(rootRef, ref);

  useAttributeCue(rootRef, "data-state", (_state, root) => {
    const scale = motionScale(root);
    if (!scale || !thumbRef.current) return;
    gsap.fromTo(thumbRef.current.firstElementChild, { scaleX: 1 + 0.28 * scale, scaleY: 1 - 0.14 * scale }, { scaleX: 1, scaleY: 1, duration: 0.55, ease: "elastic.out(1, 0.45)" });
  });

  return (
    <SwitchPrimitive.Root ref={mergedRef} data-slot="switch" className={cn(switchVariants({ size }), className)} {...props}>
      <SwitchPrimitive.Thumb ref={thumbRef} data-slot="switch-thumb" className={thumbVariants({ size })}>
        <span className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.18),0_0_0_0.5px_rgb(0_0_0/0.06)]" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
export type { SwitchProps };

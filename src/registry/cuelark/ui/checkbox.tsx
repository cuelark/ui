"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { gsap, motionScale, useAttributeCue, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

const checkboxVariants = cva(
  "group/checkbox peer inline-grid shrink-0 place-items-center border border-input bg-card text-primary-foreground shadow-well outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-cue focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:shadow-control data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:shadow-control",
  {
    variants: {
      size: {
        sm: "size-3.5 rounded-[calc(var(--radius)*0.4)]",
        md: "size-4 rounded-[calc(var(--radius)*0.5)]",
        lg: "size-5 rounded-[calc(var(--radius)*0.6)]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>;

/** Supports `checked="indeterminate"`; the check mark draws itself in and the box pops (GSAP) when ticked. */
function Checkbox({ className, size = "md", ref, ...props }: CheckboxProps) {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(rootRef, ref);

  useAttributeCue(rootRef, "data-state", (state, root) => {
    const scale = motionScale(root);
    if (!scale || state === "unchecked") return;
    gsap.fromTo(root, { scale: 1 - 0.18 * scale }, { scale: 1, duration: 0.45, ease: "cue-snap" });
  });

  return (
    <CheckboxPrimitive.Root ref={mergedRef} data-slot="checkbox" className={cn(checkboxVariants({ size }), className)} {...props}>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="col-start-1 row-start-1 size-[85%]">
        <path
          d="M3.5 8.5l3 3 6-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[stroke-dasharray:15] [stroke-dashoffset:15] transition-[stroke-dashoffset] duration-200 ease-cue group-data-[state=checked]/checkbox:[stroke-dashoffset:0] motion-reduce:transition-none"
        />
      </svg>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="col-start-1 row-start-1 size-[85%]">
        <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-0 group-data-[state=indeterminate]/checkbox:opacity-100" />
      </svg>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };
export type { CheckboxProps };

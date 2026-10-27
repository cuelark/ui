"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { gsap, marksIn, motionScale, useAttributeCue, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

/** The dot springs in (GSAP elastic) whenever the item becomes checked. */
function RadioGroupItem({ className, ref, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const itemRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(itemRef, ref);
  useAttributeCue(itemRef, "data-state", (state, item) => {
    const scale = motionScale(item);
    const dot = item.querySelector('[data-slot="radio-group-dot"]');
    if (!scale || state !== "checked" || !dot) return;
    gsap.fromTo(dot, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "elastic.out(1.1, 0.55)", clearProps: "scale,opacity" });
  });

  return (
    <RadioGroupPrimitive.Item
      ref={mergedRef}
      data-slot="radio-group-item"
      className={cn(
        "group/radio peer inline-grid aspect-square size-4 shrink-0 place-items-center rounded-full border border-input bg-card shadow-well outline-none transition-[border-color,box-shadow] duration-150 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive data-[state=checked]:border-primary",
        className,
      )}
      {...props}
    >
      <span data-slot="radio-group-dot" className="size-2 rounded-full bg-primary opacity-0 group-data-[state=checked]/radio:opacity-100" />
    </RadioGroupPrimitive.Item>
  );
}

/** A whole card is the radio; the checked card is framed by crop marks that close in on it. */
function RadioGroupCard({ className, children, ref, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const cardRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(cardRef, ref);
  useAttributeCue(cardRef, "data-state", (state, card) => state === "checked" && marksIn(card));

  return (
    <RadioGroupPrimitive.Item
      ref={mergedRef}
      data-slot="radio-group-card"
      className={cn(
        "group/radio-card relative grid gap-1 rounded-lg border border-border bg-card p-4 text-left text-sm shadow-control outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-cue hover:border-ring/40 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:cue-marks data-[state=checked]:border-primary data-[state=checked]:bg-accent/40 data-[state=checked]:shadow-raised",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute top-3 end-3 inline-grid size-4 place-items-center rounded-full border border-input bg-card shadow-well group-data-[state=checked]/radio-card:border-primary"
      >
        <span className="size-2 scale-0 rounded-full bg-primary transition-transform duration-300 ease-cue group-data-[state=checked]/radio-card:scale-100" />
      </span>
      {children}
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupCard };

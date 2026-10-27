"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { gsap, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

const cardVariants = cva("relative flex flex-col gap-card rounded-xl border py-card text-card-foreground", {
  variants: {
    variant: {
      outline: "border-border bg-card",
      raised: "border-border bg-card shadow-raised",
      inset: "border-dashed border-border bg-muted/40",
      ghost: "border-transparent bg-transparent",
    },
    marks: {
      true: "cue-marks",
    },
    interactive: {
      true: "transition-[border-color,box-shadow,translate] duration-200 ease-cue hover:-translate-y-0.5 hover:border-ring/40 hover:shadow-raised has-[a:focus-visible,button:focus-visible]:outline-2 has-[a:focus-visible,button:focus-visible]:outline-offset-2 has-[a:focus-visible,button:focus-visible]:outline-ring motion-reduce:hover:translate-y-0",
    },
    spotlight: {
      true: "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(260px_circle_at_var(--spot-x,50%)_var(--spot-y,0%),color-mix(in_oklch,var(--signal)_12%,transparent),transparent_70%)] after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100",
    },
  },
  defaultVariants: { variant: "outline" },
});

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>;

/** `spotlight` adds a soft accent glow that trails the pointer (GSAP, eased with the house curve). */
function Card({ className, variant = "outline", marks, interactive, spotlight, ref, onPointerMove, ...props }: CardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(cardRef, ref);
  return (
    <div
      ref={mergedRef}
      data-slot="card"
      data-variant={variant}
      className={cn(cardVariants({ variant, marks, interactive, spotlight }), className)}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (!spotlight) return;
        const rect = e.currentTarget.getBoundingClientRect();
        gsap.to(e.currentTarget, { "--spot-x": `${e.clientX - rect.left}px`, "--spot-y": `${e.clientY - rect.top}px`, duration: 0.4, ease: "cue", overwrite: "auto" });
      }}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-card has-data-[slot=card-action]:grid-cols-[1fr_auto]", className)}
      {...props}
    />
  );
}

/** A mono micro-label above the title, e.g. a section number or category. */
function CardLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-label" className={cn("cue-label", className)} {...props} />;
}

/** Use `asChild` to render a real heading (`<h2>`, `<h3>`) for document outline and SEO. */
function CardTitle({ className, asChild = false, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return <Comp data-slot="card-title" className={cn("text-base leading-snug font-semibold tracking-tight", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-card", className)} {...props} />;
}

/** `divided` adds a dashed rule and a muted tray behind the footer. */
function CardFooter({ className, divided = false, ...props }: React.ComponentProps<"div"> & { divided?: boolean }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 px-card", divided && "cue-dash-t -mb-card rounded-b-[inherit] bg-muted/40 py-3", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardLabel, CardTitle, CardDescription, CardAction, CardContent, CardFooter, cardVariants };
export type { CardProps };

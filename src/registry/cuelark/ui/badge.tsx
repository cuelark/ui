import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        neutral: "border-border bg-secondary text-secondary-foreground [a&]:hover:bg-accent",
        primary: "border-primary/20 bg-primary/10 text-primary [a&]:hover:bg-primary/15",
        success: "border-success/25 bg-success/10 text-success [a&]:hover:bg-success/15",
        warning: "border-warning/30 bg-warning/12 text-warning [a&]:hover:bg-warning/20",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive [a&]:hover:bg-destructive/15",
        outline: "border-input bg-transparent text-foreground [a&]:hover:bg-accent",
        solid: "border-transparent bg-foreground text-background [a&]:hover:bg-foreground/90",
        signal: "border-transparent bg-signal text-signal-foreground [a&]:hover:bg-signal/85",
      },
      size: {
        sm: "h-5 px-2 text-[0.6875rem]",
        md: "h-6 px-2.5 text-xs",
      },
      mono: {
        true: "font-mono tracking-[0.06em] uppercase",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    /** A leading status dot in the badge color; `"pulse"` adds a live-signal ping. */
    dot?: boolean | "pulse";
  };

function Badge({ className, variant = "neutral", size = "md", mono, asChild = false, dot = false, children, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant, size, mono }), className)} {...props}>
      {dot && (
        <span data-slot="badge-dot" aria-hidden="true" className="relative inline-flex size-1.5 shrink-0">
          {dot === "pulse" && <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />}
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
      )}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
    </Comp>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };

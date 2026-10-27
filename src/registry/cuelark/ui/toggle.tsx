"use client";

import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cuePing } from "@/lib/motion";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-md text-sm font-medium whitespace-nowrap outline-none transition-[background-color,color,box-shadow] duration-150 ease-cue hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-pressed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        ghost: "bg-transparent text-muted-foreground",
        outline: "border border-input bg-transparent text-muted-foreground shadow-control data-[state=on]:border-primary/30",
      },
      size: {
        sm: "h-ctl-sm min-w-ctl-sm px-2",
        md: "h-ctl-md min-w-ctl-md px-2.5",
        lg: "h-ctl-lg min-w-ctl-lg px-3",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

/** A two-state button; it sinks into the surface when on and pings on press. */
function Toggle({ className, variant = "ghost", size = "md", onPointerDown, ...props }: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (!e.defaultPrevented) cuePing(e.currentTarget, e);
      }}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };

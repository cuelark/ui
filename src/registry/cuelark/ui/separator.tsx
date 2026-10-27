"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  variant?: "solid" | "dashed";
  /** Text in the middle of a horizontal rule, e.g. "or" between sign-in options. */
  label?: React.ReactNode;
};

function Separator({ className, orientation = "horizontal", decorative = true, variant = "solid", label, ...props }: SeparatorProps) {
  const line = cn(
    "shrink-0",
    orientation === "horizontal" ? "h-px w-full" : "h-full w-px self-stretch",
    variant === "solid" ? "bg-border" : orientation === "horizontal" ? "cue-dash-b" : "bg-[linear-gradient(to_bottom,var(--border)_55%,transparent_0)] bg-[length:1px_7px] bg-repeat-y",
  );

  if (label != null && orientation === "horizontal") {
    return (
      <div data-slot="separator-labeled" className={cn("flex w-full items-center gap-3", className)}>
        <SeparatorPrimitive.Root decorative={decorative} className={cn(line, "flex-1 w-auto")} {...props} />
        <span className="cue-label shrink-0">{label}</span>
        <SeparatorPrimitive.Root decorative className={cn(line, "flex-1 w-auto")} />
      </div>
    );
  }

  return <SeparatorPrimitive.Root data-slot="separator" decorative={decorative} orientation={orientation} className={cn(line, className)} {...props} />;
}

export { Separator };
export type { SeparatorProps };

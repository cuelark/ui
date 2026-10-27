import * as React from "react";

import { cn } from "@/lib/utils";

/** A soft highlight sweeping through text: the "working on it" status for agents. Reads normally at rest; CSS only, still for reduced motion. */
function TextShimmer({ className, duration = 1.6, style, ...props }: React.ComponentProps<"span"> & { duration?: number }) {
  return (
    <span
      data-slot="text-shimmer"
      className={cn(
        "inline bg-[linear-gradient(90deg,color-mix(in_oklch,var(--foreground)_62%,transparent)_40%,var(--foreground)_50%,color-mix(in_oklch,var(--foreground)_62%,transparent)_60%)] bg-[length:250%_100%] bg-clip-text text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone] motion-safe:animate-[cue-text-shimmer_var(--shimmer-duration)_linear_infinite] motion-reduce:bg-none motion-reduce:text-foreground/70",
        className,
      )}
      style={{ "--shimmer-duration": `${duration}s`, ...style } as React.CSSProperties}
      {...props}
    />
  );
}

export { TextShimmer };

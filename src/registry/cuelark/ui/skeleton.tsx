import * as React from "react";

import { cn } from "@/lib/utils";

/** A placeholder block with a slow light sweep (CSS only, so it runs before hydration). Hidden from assistive tech. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted before:absolute before:inset-0 before:animate-[cue-shimmer_1.8s_ease-in-out_infinite] before:bg-linear-to-r before:from-transparent before:via-foreground/[0.06] before:to-transparent motion-reduce:before:hidden",
        className,
      )}
      {...props}
    />
  );
}

/** Lines of text; the last line is shorter, like a real paragraph. */
function SkeletonText({ lines = 3, className, ...props }: React.ComponentProps<"div"> & { lines?: number }) {
  return (
    <div data-slot="skeleton-text" aria-hidden="true" className={cn("grid gap-2", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")} />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText };

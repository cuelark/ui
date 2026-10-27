import * as React from "react";

import { cn } from "@/lib/utils";

/** An empty state: a framed icon, a title, a sentence of guidance and the next action. */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn("flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-8 text-center text-balance", className)}
      {...props}
    />
  );
}

/** The icon sits in a small raised tile framed by crop marks. */
function EmptyIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-icon"
      className={cn(
        "cue-marks relative mb-1 flex size-12 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-raised [--cl-mark-gap:3px] [--cl-mark-len:5px] [&_svg]:size-5",
        className,
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="empty-title" className={cn("text-base font-semibold tracking-tight", className)} {...props} />;
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="empty-description" className={cn("max-w-sm text-sm text-muted-foreground", className)} {...props} />;
}

function EmptyActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-actions" className={cn("mt-2 flex flex-wrap items-center justify-center gap-2", className)} {...props} />;
}

export { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions };

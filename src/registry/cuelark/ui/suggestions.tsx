"use client";

import * as React from "react";

import { enterChildren, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** A row of follow-up prompts that scrolls sideways on small screens, fading at the edges; chips arrive in a stagger. */
function Suggestions({ className, children, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (el && motionScale(el)) enterChildren(el.children, { opacity: 0, y: 6 }, { stagger: 0.05, duration: 0.3 });
  }, []);
  return (
    <div
      ref={ref}
      data-slot="suggestions"
      className={cn("flex gap-2 overflow-x-auto pb-1 [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)] [scrollbar-width:none]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function Suggestion({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="suggestion"
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm whitespace-nowrap shadow-control outline-none transition-[background-color,border-color,scale] duration-150 hover:border-foreground/20 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] [&_svg]:size-3.5 [&_svg]:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Suggestions, Suggestion };

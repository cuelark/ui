"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  /** Fades content at the scrollable edges so it is obvious there is more. */
  fade?: boolean;
  orientation?: "vertical" | "horizontal" | "both";
};

/** Custom thin scrollbars that grow when hovered, over native scrolling (keyboard and touch keep working). */
function ScrollArea({ className, children, fade = false, orientation = "vertical", ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          fade && orientation !== "horizontal" && "[mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-24px),transparent)]",
          fade && orientation === "horizontal" && "[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]",
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== "horizontal" && <ScrollBar orientation="vertical" />}
      {orientation !== "vertical" && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({ className, orientation = "vertical", ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "group/bar flex touch-none p-px transition-[width,height] duration-150 ease-cue select-none",
        orientation === "vertical" && "h-full w-2 border-s border-s-transparent hover:w-2.5",
        orientation === "horizontal" && "h-2 flex-col border-t border-t-transparent hover:h-2.5",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb data-slot="scroll-area-thumb" className="relative flex-1 rounded-full bg-foreground/20 transition-colors group-hover/bar:bg-foreground/35" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
export type { ScrollAreaProps };

"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { marksIn, popIn, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

function enterWithMarks(node: HTMLElement | null) {
  popIn(node);
  if (node) marksIn(node, 0.05);
}

/** `marks` frames the panel in crop marks that close in as it opens. */
function PopoverContent({ className, align = "center", sideOffset = 6, marks = false, ref, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content> & { marks?: boolean }) {
  const mergedRef = useMergedRef(marks ? enterWithMarks : popIn, ref);
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={mergedRef}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-xl bg-popover ring-1 ring-foreground/10 p-4 text-popover-foreground shadow-overlay outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          marks && "cue-marks",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };

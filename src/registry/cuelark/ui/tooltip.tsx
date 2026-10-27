"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { popIn, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

function TooltipProvider({ delayDuration = 150, skipDelayDuration = 300, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props} />;
}

/** Works standalone (it brings its own provider); wrap a toolbar in one `TooltipProvider` to share skip-delay between tips. */
function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content> & {
  /** A keyboard shortcut shown after the label, e.g. `"⌘B"`. */
  kbd?: React.ReactNode;
};

function TooltipContent({ className, sideOffset = 6, kbd, children, ref, ...props }: TooltipContentProps) {
  const mergedRef = useMergedRef(popIn, ref);
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={mergedRef}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-2 rounded-md bg-foreground px-2.5 py-1.5 text-xs text-balance text-background shadow-overlay",
          "duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        {kbd != null && (
          <kbd data-slot="kbd" className="cue-kbd -me-1 border-background/20 bg-background/10 text-background/75 shadow-none">
            {kbd}
          </kbd>
        )}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
export type { TooltipContentProps };

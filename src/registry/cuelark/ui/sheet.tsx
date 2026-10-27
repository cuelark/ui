"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";

import { enterChildren, enterOnce, motionScale, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-popover text-popover-foreground shadow-overlay outline-none data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=closed]:ease-in",
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-full w-3/4 border-s border-border sm:max-w-sm data-[state=closed]:slide-out-to-right",
        left: "inset-y-0 left-0 h-full w-3/4 border-e border-border sm:max-w-sm data-[state=closed]:slide-out-to-left",
        top: "inset-x-0 top-0 h-auto border-b border-border data-[state=closed]:slide-out-to-top",
        bottom: "inset-x-0 bottom-0 h-auto rounded-t-xl border-t border-border data-[state=closed]:slide-out-to-bottom",
      },
    },
    defaultVariants: { side: "right" },
  },
);

const FROM: Record<string, { xPercent?: number; yPercent?: number }> = { right: { xPercent: 100 }, left: { xPercent: -100 }, top: { yPercent: -100 }, bottom: { yPercent: 100 } };

/** Slides in on the house ease; its sections then settle in one after another. */
function enter(node: HTMLElement | null) {
  if (!node || node.dataset.entered !== undefined) return;
  const scale = motionScale(node);
  enterOnce(node, () => ({ ...FROM[node.dataset.side ?? "right"] }), { duration: 0.5 });
  node.dataset.entered = "";
  if (scale) enterChildren(node.children, { opacity: 0, y: 10 * scale }, { stagger: 0.05, delay: 0.12 });
}

function SheetContent({ className, children, side = "right", ref, ...props }: React.ComponentProps<typeof SheetPrimitive.Content> & VariantProps<typeof sheetVariants>) {
  const mergedRef = useMergedRef(enter, ref);
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay
        data-slot="sheet-overlay"
        className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] dark:bg-black/55 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      />
      <SheetPrimitive.Content ref={mergedRef} data-slot="sheet-content" data-side={side} className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 inline-flex h-7 items-center gap-1.5 rounded-full bg-foreground/5 px-2 text-muted-foreground outline-none transition-[background-color,color,scale] duration-150 hover:bg-foreground/10 hover:text-foreground active:scale-95 [&_kbd]:h-4 [&_kbd]:border-0 [&_kbd]:bg-transparent [&_kbd]:px-0 [&_kbd]:shadow-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <kbd aria-hidden="true" className="cue-kbd hidden sm:inline-flex">
            esc
          </kbd>
          <XIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("cue-dash-b flex flex-col gap-1.5 p-5 pe-20", className)} {...props} />;
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-body" className={cn("flex-1 overflow-y-auto px-5", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("cue-dash-t mt-auto flex flex-col-reverse gap-2 bg-muted/40 p-5 sm:flex-row sm:justify-end", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("text-base font-semibold tracking-tight", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription };

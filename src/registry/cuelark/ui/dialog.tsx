"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";

import { enterOnce, marksIn, motionScale, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Rise into place, then the crop marks close in on the panel like a registration lock. */
function enter(node: HTMLElement | null) {
  if (!node) return;
  if (node.dataset.entered !== undefined) return;
  node.dataset.entered = "";
  enterOnce(node, (s) => ({ opacity: 0, y: 10 * s, scale: 1 - 0.03 * s }), { duration: 0.28 });
  if (motionScale(node)) marksIn(node, 0.06);
}

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] dark:bg-black/55 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

const contentVariants = cva(
  "fixed inset-0 z-50 m-auto grid h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] origin-center gap-4 rounded-2xl bg-popover ring-1 ring-foreground/10 p-6 text-popover-foreground shadow-overlay outline-none duration-150 ease-cue data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98]",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
      },
      marks: {
        true: "cue-marks",
      },
    },
    defaultVariants: { size: "md", marks: true },
  },
);

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof contentVariants> & {
    /** Renders the close button with its `Esc` hint. */
    showClose?: boolean;
    /** No entrance animation: for surfaces opened from the keyboard many times a day (command palettes). */
    instant?: boolean;
  };

function DialogContent({ className, size, marks, showClose = true, instant = false, children, ref, ...props }: DialogContentProps) {
  const mergedRef = useMergedRef(instant ? undefined : enter, ref);
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={mergedRef} data-slot="dialog-content" className={cn(contentVariants({ size, marks }), className)} {...props}>
        {children}
        {showClose && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-4 right-4 inline-flex h-7 items-center gap-1.5 rounded-full bg-foreground/5 px-2 text-muted-foreground outline-none transition-[background-color,color,scale] duration-150 hover:bg-foreground/10 hover:text-foreground active:scale-95 [&_kbd]:h-4 [&_kbd]:border-0 [&_kbd]:bg-transparent [&_kbd]:px-0 [&_kbd]:shadow-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <kbd data-slot="kbd" aria-hidden="true" className="cue-kbd hidden sm:inline-flex">
              esc
            </kbd>
            <XIcon className="size-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1.5 pe-16 text-left", className)} {...props} />;
}

/** `divided` turns the footer into a muted tray under a dashed rule. */
function DialogFooter({ className, divided = false, ...props }: React.ComponentProps<"div"> & { divided?: boolean }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", divided && "cue-dash-t -mx-6 -mb-6 mt-2 rounded-b-2xl bg-muted/50 px-6 py-4", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-lg leading-snug font-semibold tracking-tight", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export { Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
export type { DialogContentProps };

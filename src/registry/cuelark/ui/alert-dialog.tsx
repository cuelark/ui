"use client";

import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

import { enterOnce, useMergedRef } from "@/lib/motion";
import { buttonVariants } from "@/registry/cuelark/ui/button";
import { cn } from "@/lib/utils";

function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

/** Drops in a touch heavier than a dialog, with one firm settle: it is asking you to stop and decide. */
function enter(node: HTMLElement | null) {
  enterOnce(node, (s) => ({ opacity: 0, y: -10 * s, scale: 1 + 0.03 * s }), { duration: 0.45, ease: "cue-snap" });
}

function AlertDialogContent({ className, tone = "default", ref, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content> & { tone?: "default" | "destructive" }) {
  const mergedRef = useMergedRef(enter, ref);
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] dark:bg-black/55 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      />
      <AlertDialogPrimitive.Content
        ref={mergedRef}
        data-slot="alert-dialog-content"
        data-tone={tone}
        className={cn(
          "fixed inset-0 z-50 m-auto grid h-fit w-[calc(100%-2rem)] max-w-md gap-4 overflow-hidden rounded-2xl bg-popover ring-1 ring-foreground/10 p-6 text-popover-foreground shadow-overlay outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98]",
          "data-[tone=destructive]:before:absolute data-[tone=destructive]:before:inset-x-0 data-[tone=destructive]:before:top-0 data-[tone=destructive]:before:h-0.5 data-[tone=destructive]:before:bg-destructive",
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn("text-lg font-semibold tracking-tight", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description data-slot="alert-dialog-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function AlertDialogAction({ className, variant = "primary", ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action> & { variant?: "primary" | "destructive" }) {
  return <AlertDialogPrimitive.Action data-slot="alert-dialog-action" className={cn(buttonVariants({ variant }), className)} {...props} />;
}

function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" className={cn(buttonVariants({ variant: "secondary" }), className)} {...props} />;
}

export { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel };

"use client";

import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { popIn, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

const surface =
  "z-50 min-w-[10rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground shadow-overlay ring-1 ring-foreground/10 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95";
const item =
  "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground";

function ContextMenu(props: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger(props: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
}

/** Opens at the pointer and springs out from that point (popIn reads Radix's side and origin). */
function ContextMenuContent({ className, ref, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  const mergedRef = useMergedRef(popIn, ref);
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content ref={mergedRef} data-slot="context-menu-content" className={cn(surface, className)} {...props} />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({ className, variant = "default", ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return <ContextMenuPrimitive.Item data-slot="context-menu-item" data-variant={variant} className={cn(item, "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10", className)} {...props} />;
}

function ContextMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem data-slot="context-menu-checkbox-item" className={cn(item, "ps-8", className)} {...props}>
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="!text-foreground" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuLabel({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Label>) {
  return <ContextMenuPrimitive.Label data-slot="context-menu-label" className={cn("cue-label px-2 pt-2 pb-1", className)} {...props} />;
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return <ContextMenuPrimitive.Separator data-slot="context-menu-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"kbd">) {
  return <kbd data-slot="context-menu-shortcut" className={cn("cue-kbd ms-auto", className)} {...props} />;
}

function ContextMenuSub(props: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuSubTrigger({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger>) {
  return (
    <ContextMenuPrimitive.SubTrigger data-slot="context-menu-sub-trigger" className={cn(item, "data-[state=open]:bg-accent", className)} {...props}>
      {children}
      <ChevronRightIcon className="ms-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({ className, ref, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  const mergedRef = useMergedRef(popIn, ref);
  return <ContextMenuPrimitive.SubContent ref={mergedRef} data-slot="context-menu-sub-content" className={cn(surface, className)} {...props} />;
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
};

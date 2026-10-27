import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const itemVariants = cva("group/item flex items-center gap-3 rounded-xl text-sm outline-none transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-ring/50", {
  variants: {
    variant: {
      default: "bg-transparent",
      outline: "border border-border",
      muted: "bg-muted/50",
    },
    size: { sm: "p-2.5", md: "p-3.5" },
  },
  defaultVariants: { variant: "default", size: "md" },
});

/** A flexible row for settings, lists and search results: media, title, description and actions. */
function Item({ className, variant, size, asChild, ...props }: React.ComponentProps<"div"> & VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return <Comp data-slot="item" className={cn(itemVariants({ variant, size }), "[a&]:hover:bg-accent", className)} {...props} />;
}

function ItemMedia({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-media" className={cn("grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted [&_svg]:size-4", className)} {...props} />;
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-content" className={cn("grid min-w-0 flex-1 gap-0.5", className)} {...props} />;
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-title" className={cn("truncate font-medium", className)} {...props} />;
}

function ItemDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-description" className={cn("line-clamp-2 text-muted-foreground", className)} {...props} />;
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-actions" className={cn("flex shrink-0 items-center gap-2", className)} {...props} />;
}

export { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, itemVariants };

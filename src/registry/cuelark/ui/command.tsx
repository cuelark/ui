"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { gsap, motionScale, useMergedRef } from "@/lib/motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/registry/cuelark/ui/dialog";
import { cn } from "@/lib/utils";

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive data-slot="command" className={cn("flex h-full w-full flex-col overflow-hidden rounded-[inherit] bg-popover text-popover-foreground", className)} {...props} />;
}

/** A command palette in a dialog; open it from a ⌘K handler. */
function CommandDialog({
  title = "Command palette",
  description = "Search for a command to run.",
  children,
  className,
  ...props
}: React.ComponentProps<typeof Dialog> & { title?: string; description?: string; className?: string }) {
  return (
    <Dialog {...props}>
      <DialogContent className={cn("top-[12vh] mt-0 gap-0 p-0 data-[state=closed]:animate-none", className)} showClose={false} marks={false} instant>
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="cue-dash-b flex h-ctl-lg items-center gap-2 px-3">
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn("flex h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)}
        {...props}
      />
    </div>
  );
}

/** One highlight glides to the selected item as you arrow through results (GSAP). */
function CommandList({ className, children, ref, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const highlightRef = React.useRef<HTMLSpanElement>(null);
  const mergedRef = useMergedRef(listRef, ref);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    const highlight = highlightRef.current;
    if (!list || !highlight) return;
    let shown = false;
    const place = () => {
      const selected = list.querySelector<HTMLElement>('[cmdk-item][data-selected="true"]');
      if (!selected) {
        shown = false;
        return gsap.set(highlight, { opacity: 0 });
      }
      const listBox = list.getBoundingClientRect();
      const box = selected.getBoundingClientRect();
      const target = { y: box.top - listBox.top + list.scrollTop, height: box.height, left: box.left - listBox.left, width: box.width, opacity: 1 };
      if (!shown || !motionScale(list)) gsap.set(highlight, target);
      else gsap.to(highlight, { ...target, duration: 0.22, ease: "cue", overwrite: true });
      shown = true;
    };
    place();
    const observer = new MutationObserver(place);
    observer.observe(list, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-selected"] });
    return () => observer.disconnect();
  }, []);

  return (
    <CommandPrimitive.List ref={mergedRef} data-slot="command-list" className={cn("relative max-h-80 scroll-py-1 overflow-x-hidden overflow-y-auto p-1", className)} {...props}>
      <span ref={highlightRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 rounded-md bg-accent opacity-0" />
      {children}
    </CommandPrimitive.List>
  );
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty data-slot="command-empty" className={cn("py-8 text-center text-sm text-muted-foreground", className)} {...props} />;
}

/**
 * cmdk keeps the selected item visible with element.scrollIntoView(), which also scrolls the whole page when the
 * palette is embedded in content (it selects the first item on mount). Keep that scrolling inside the list.
 */
function scrollWithinList(node: HTMLElement | null) {
  if (!node) return;
  node.scrollIntoView = () => {
    const list = node.closest<HTMLElement>("[cmdk-list]");
    if (!list) return;
    const l = list.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    if (r.top < l.top) list.scrollTop -= l.top - r.top;
    else if (r.bottom > l.bottom) list.scrollTop += r.bottom - l.bottom;
  };
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      ref={(node) => scrollWithinList(node?.querySelector<HTMLElement>("[cmdk-group-heading]") ?? null)}
      data-slot="command-group"
      className={cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:cue-label [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5", className)}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator data-slot="command-separator" className={cn("cue-dash-b -mx-1 h-px", className)} {...props} />;
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      ref={scrollWithinList}
      data-slot="command-item"
      className={cn(
        "relative z-10 flex cursor-default items-center gap-2 rounded-md px-2 py-2 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"kbd">) {
  return <kbd data-slot="command-shortcut" className={cn("cue-kbd ms-auto", className)} {...props} />;
}

export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator };

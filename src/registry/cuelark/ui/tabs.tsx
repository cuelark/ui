"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";

import { gsap, motionScale, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TabsVariant = "segmented" | "underline";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-3 data-[orientation=vertical]:flex-row", className)} {...props} />;
}

const listVariants = cva("relative inline-flex w-fit max-w-full items-center text-muted-foreground", {
  variants: {
    variant: {
      segmented: "h-ctl-md overflow-x-auto rounded-lg bg-muted p-[3px] shadow-well [scrollbar-width:none] data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
      underline:
        "h-ctl-md gap-5 border-b border-border data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:gap-1 data-[orientation=vertical]:border-s data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:ps-3",
    },
  },
  defaultVariants: { variant: "segmented" },
});

const indicatorVariants = cva("pointer-events-none absolute opacity-0 [[data-ready]>&]:opacity-100", {
  variants: {
    variant: {
      segmented: "rounded-md border border-border/60 bg-card shadow-control",
      underline: "rounded-full bg-signal [[data-orientation=horizontal]>&]:-bottom-px [[data-orientation=horizontal]>&]:h-0.5 [[data-orientation=vertical]>&]:-start-px [[data-orientation=vertical]>&]:w-0.5",
    },
  },
  defaultVariants: { variant: "segmented" },
});

/**
 * One indicator travels between triggers with GSAP: it stretches to cover the old and new tab, then
 * its trailing edge catches up (a short "caterpillar" move). Before hydration the active trigger styles itself.
 */
function TabsList({ className, variant = "segmented", children, ref, ...props }: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: TabsVariant }) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const mergedRef = useMergedRef(listRef, ref);
  useIndicator(listRef, indicatorRef, variant);

  return (
    <TabsPrimitive.List ref={mergedRef} data-slot="tabs-list" data-variant={variant} className={cn(listVariants({ variant }), className)} {...props}>
      <span ref={indicatorRef} aria-hidden="true" data-slot="tabs-indicator" className={indicatorVariants({ variant })} />
      {children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex h-full items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[[data-variant=segmented]_&]:flex-1 [[data-variant=segmented][data-orientation=vertical]_&]:h-ctl-sm [[data-variant=segmented][data-orientation=vertical]_&]:justify-start",
        "[[data-variant=underline]_&]:px-0.5 [[data-variant=underline][data-orientation=vertical]_&]:h-ctl-sm",
        "[[data-slot=tabs-list][data-variant=segmented]:not([data-ready])_&]:data-[state=active]:bg-card [[data-slot=tabs-list][data-variant=segmented]:not([data-ready])_&]:data-[state=active]:shadow-control",
        "[[data-slot=tabs-list][data-variant=underline]:not([data-ready])_&]:data-[state=active]:shadow-[inset_0_-2px_0_var(--primary)]",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-200", className)}
      {...props}
    />
  );
}

type Box = { left: number; top: number; width: number; height: number };

function useIndicator(listRef: React.RefObject<HTMLDivElement | null>, indicatorRef: React.RefObject<HTMLSpanElement | null>, variant: TabsVariant) {
  React.useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    let previous: Box | null = null;
    let timeline: gsap.core.Timeline | null = null;

    const place = (animate: boolean) => {
      const active = list.querySelector<HTMLElement>(':scope > [data-slot="tabs-trigger"][data-state="active"]');
      if (!active) return;
      const box: Box = { left: active.offsetLeft, top: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight };
      const vertical = list.getAttribute("aria-orientation") === "vertical";
      const [pos, size] = vertical ? (["top", "height"] as const) : (["left", "width"] as const);
      const cross = variant === "segmented" ? (vertical ? { left: box.left, width: box.width } : { top: box.top, height: box.height }) : {};
      const scale = motionScale(list);
      timeline?.kill();

      if (!animate || !previous || scale === 0) {
        gsap.set(indicator, { [pos]: box[pos], [size]: box[size], ...cross });
      } else {
        const from = previous;
        const forward = box[pos] > from[pos];
        timeline = gsap.timeline({ defaults: { ease: "cue" } });
        gsap.set(indicator, cross);
        if (forward) {
          timeline.to(indicator, { [size]: box[pos] + box[size] - from[pos], duration: 0.16 }).to(indicator, { [pos]: box[pos], [size]: box[size], duration: 0.28 });
        } else {
          timeline.to(indicator, { [pos]: box[pos], [size]: from[pos] + from[size] - box[pos], duration: 0.16 }).to(indicator, { [size]: box[size], duration: 0.28 });
        }
      }
      previous = box;
      list.dataset.ready = "";
    };

    place(false);
    const mutations = new MutationObserver(() => place(true));
    mutations.observe(list, { subtree: true, attributes: true, attributeFilter: ["data-state"] });
    const resize = new ResizeObserver(() => place(false));
    resize.observe(list);
    return () => {
      timeline?.kill();
      mutations.disconnect();
      resize.disconnect();
    };
  }, [listRef, indicatorRef, variant]);
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsVariant };

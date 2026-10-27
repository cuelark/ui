"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { PlusIcon } from "lucide-react";

import { enterChildren, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Lets content skip its reveal for items that are already open on first render. */
const HydratedContext = React.createContext<React.RefObject<boolean> | null>(null);

type AccordionVariant = "lined" | "dashed" | "separated";

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> & {
  variant?: AccordionVariant;
  /** Prefixes each trigger with a mono index (01, 02, …) using CSS counters, so it stays correct with any item order. */
  numbered?: boolean;
};

function Accordion({ className, variant = "lined", numbered = false, ...props }: AccordionProps) {
  const hydrated = React.useRef(false);
  React.useEffect(() => {
    hydrated.current = true;
  }, []);
  return (
    <HydratedContext.Provider value={hydrated}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-variant={variant}
        data-numbered={numbered ? "" : undefined}
        className={cn("w-full [counter-reset:cue-accordion]", variant === "separated" && "flex flex-col gap-2", className)}
        {...props}
      />
    </HydratedContext.Provider>
  );
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "[counter-increment:cue-accordion]",
        "[[data-variant=lined]>&]:border-b [[data-variant=lined]>&]:border-border [[data-variant=lined]>&]:last:border-b-0",
        "[[data-variant=dashed]>&]:cue-dash-b [[data-variant=dashed]>&]:last:bg-none",
        "[[data-variant=separated]>&]:rounded-lg [[data-variant=separated]>&]:border [[data-variant=separated]>&]:border-border [[data-variant=separated]>&]:bg-card [[data-variant=separated]>&]:px-4 [[data-variant=separated]>&]:shadow-control [[data-variant=separated]>&]:transition-shadow [[data-variant=separated]>&]:data-[state=open]:shadow-raised",
        className,
      )}
      {...props}
    />
  );
}

/** Renders inside a real heading (`<h3>`) so FAQ content keeps its document outline. */
function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex flex-1 items-start gap-3 rounded-md py-4 text-left text-[0.9375rem] font-medium outline-none transition-colors hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          "[[data-numbered]_&]:before:w-6 [[data-numbered]_&]:before:shrink-0 [[data-numbered]_&]:before:pt-0.5 [[data-numbered]_&]:before:font-mono [[data-numbered]_&]:before:text-xs [[data-numbered]_&]:before:text-muted-foreground [[data-numbered]_&]:before:tabular-nums [[data-numbered]_&]:before:content-[counter(cue-accordion,decimal-leading-zero)]",
          className,
        )}
        {...props}
      >
        <span className="flex-1">{children}</span>
        <PlusIcon
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-cue group-hover/trigger:text-foreground group-data-[state=open]/trigger:rotate-45 motion-reduce:transition-none"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/** While the panel opens, its children rise in one after another (GSAP stagger). */
function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const hydrated = React.useContext(HydratedContext);
  const reveal = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !hydrated?.current || node.dataset.entered !== undefined) return;
      node.dataset.entered = "";
      const scale = motionScale(node);
      if (!scale) return;
      const targets = node.children.length ? node.children : node;
      enterChildren(targets instanceof Element ? [targets] : targets, { opacity: 0, y: 8 * scale }, { stagger: 0.05, delay: 0.05 });
    },
    [hydrated],
  );
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div ref={reveal} className={cn("pe-7 pb-4 [[data-numbered]_&]:ps-9", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export type { AccordionProps, AccordionVariant };

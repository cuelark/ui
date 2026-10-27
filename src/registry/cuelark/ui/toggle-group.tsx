"use client";

import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { gsap, motionScale, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

const groupVariants = cva("relative inline-flex w-fit items-center", {
  variants: {
    variant: {
      /** One raised chip glides to the pressed item (single selection). */
      segmented: "gap-0 rounded-lg bg-muted p-[3px] shadow-well",
      outline: "gap-0 rounded-md border border-input shadow-control",
      ghost: "gap-1",
    },
    size: { sm: "h-ctl-sm", md: "h-ctl-md", lg: "h-ctl-lg" },
  },
  defaultVariants: { variant: "segmented", size: "md" },
});

const itemVariants = cva(
  "relative z-10 inline-flex h-full items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:z-20 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        segmented: "rounded-md [[data-slot=toggle-group]:not([data-ready])_&]:data-[state=on]:bg-card [[data-slot=toggle-group]:not([data-ready])_&]:data-[state=on]:shadow-control",
        outline: "border-s border-input first:border-s-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground first:rounded-s-[calc(var(--radius)-3px)] last:rounded-e-[calc(var(--radius)-3px)]",
        ghost: "rounded-md hover:bg-muted data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      },
      size: {
        sm: "px-2.5 text-[0.8125rem]",
        md: "px-3",
        lg: "px-3.5",
      },
    },
    defaultVariants: { variant: "segmented", size: "md" },
  },
);

type GroupContext = VariantProps<typeof itemVariants>;
const ToggleGroupContext = React.createContext<GroupContext>({ variant: "segmented", size: "md" });

function ToggleGroup({
  className,
  variant = "segmented",
  size = "md",
  children,
  ref,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof groupVariants>) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const chipRef = React.useRef<HTMLSpanElement>(null);
  const mergedRef = useMergedRef(rootRef, ref);

  // A segmented control always has a selection: pressing the active item again keeps it selected.
  const single = props.type === "single" ? (props as Extract<typeof props, { type: "single" }>) : null;
  const [kept, setKept] = React.useState(single?.defaultValue ?? "");
  if (single && variant === "segmented") {
    const { onValueChange, value } = single;
    Object.assign(props, {
      value: value ?? kept,
      defaultValue: undefined,
      onValueChange: (next: string) => {
        if (!next) return;
        setKept(next);
        onValueChange?.(next);
      },
    });
  }

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const chip = chipRef.current;
    if (variant !== "segmented" || !root || !chip) return;
    let placed = false;
    const place = (animate: boolean) => {
      const on = root.querySelector<HTMLElement>(':scope > [data-slot="toggle-group-item"][data-state="on"]');
      if (!on) return gsap.to(chip, { opacity: 0, duration: 0.15 });
      const box = { left: on.offsetLeft, top: on.offsetTop, width: on.offsetWidth, height: on.offsetHeight, opacity: 1 };
      if (!animate || !placed || !motionScale(root)) gsap.set(chip, box);
      else gsap.to(chip, { ...box, duration: 0.4, ease: "cue-snap", overwrite: true });
      placed = true;
      root.dataset.ready = "";
    };
    place(false);
    const mutations = new MutationObserver(() => place(true));
    mutations.observe(root, { subtree: true, attributes: true, attributeFilter: ["data-state"] });
    const resize = new ResizeObserver(() => place(false));
    resize.observe(root);
    return () => {
      mutations.disconnect();
      resize.disconnect();
    };
  }, [variant]);

  return (
    <ToggleGroupPrimitive.Root ref={mergedRef} data-slot="toggle-group" data-variant={variant} className={cn(groupVariants({ variant, size }), className)} {...props}>
      {variant === "segmented" && (
        <span ref={chipRef} aria-hidden="true" className="pointer-events-none absolute rounded-md border border-border/60 bg-card opacity-0 shadow-control" />
      )}
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const { variant, size } = React.useContext(ToggleGroupContext);
  return <ToggleGroupPrimitive.Item data-slot="toggle-group-item" className={cn(itemVariants({ variant, size }), className)} {...props} />;
}

export { ToggleGroup, ToggleGroupItem };

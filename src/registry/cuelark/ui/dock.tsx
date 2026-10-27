"use client";

import * as React from "react";
import { Slot } from "radix-ui";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type DockContext = { size: number; magnification: number; distance: number };
const DockContext = React.createContext<DockContext>({ size: 40, magnification: 1.6, distance: 120 });

type DockProps = React.ComponentProps<"nav"> & {
  /** Resting item size in px. */
  size?: number;
  /** Size multiplier for the item right under the pointer. */
  magnification?: number;
  /** How far (px) from the pointer items start to grow. */
  distance?: number;
};

/**
 * A macOS-style dock: items swell as the pointer nears them and neighbours make room, eased with GSAP
 * GSAP. Keyboard focus lifts an item the same way; with motion off it is a plain toolbar.
 */
function Dock({ className, size = 40, magnification = 1.6, distance = 120, children, ...props }: DockProps) {
  const ref = React.useRef<HTMLElement>(null);

  const update = (clientX: number | null) => {
    const dock = ref.current;
    if (!dock) return;
    const scale = motionScale(dock);
    dock.querySelectorAll<HTMLElement>('[data-slot="dock-item"]').forEach((item) => {
      let target = size;
      if (clientX !== null && scale) {
        const rect = item.getBoundingClientRect();
        const d = Math.abs(clientX - (rect.left + rect.width / 2));
        const t = Math.max(0, 1 - d / distance);
        target = size + size * (magnification - 1) * Math.cos(((1 - t) * Math.PI) / 2) ** 2 * Math.min(scale, 1.5);
      }
      gsap.to(item, { width: target, height: target, duration: 0.3, ease: "cue", overwrite: "auto" });
    });
  };

  return (
    <DockContext.Provider value={{ size, magnification, distance }}>
      <nav
        ref={ref}
        data-slot="dock"
        className={cn("mx-auto flex w-fit items-end gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-raised backdrop-blur-md", className)}
        style={{ height: size + 16 }}
        onPointerMove={(e) => update(e.clientX)}
        onPointerLeave={() => update(null)}
        {...props}
      >
        {children}
      </nav>
    </DockContext.Provider>
  );
}

type DockItemProps = React.ComponentProps<"button"> & {
  /** Shown above the item on hover and focus, and used as its accessible name. */
  label: string;
  /** Marks the item as active (an indicator dot appears under it). */
  active?: boolean;
  asChild?: boolean;
};

function DockItem({ className, label, active, asChild, children, onFocus, onBlur, ...props }: DockItemProps) {
  const { size, magnification } = React.useContext(DockContext);
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="dock-item"
      data-active={active || undefined}
      aria-label={label}
      className={cn(
        "group/dock relative flex shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-control outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:size-[45%]",
        className,
      )}
      style={{ width: size, height: size }}
      onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
        onFocus?.(e);
        if (motionScale(e.currentTarget)) gsap.to(e.currentTarget, { width: size * Math.min(magnification, 1.3), height: size * Math.min(magnification, 1.3), duration: 0.3, ease: "cue" });
      }}
      onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
        onBlur?.(e);
        gsap.to(e.currentTarget, { width: size, height: size, duration: 0.3, ease: "cue" });
      }}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 translate-y-1 rounded-md bg-foreground px-2 py-0.5 text-xs whitespace-nowrap text-background opacity-0 shadow-overlay transition-[opacity,translate] duration-150 ease-cue group-hover/dock:translate-y-0 group-hover/dock:opacity-100 group-focus-visible/dock:translate-y-0 group-focus-visible/dock:opacity-100"
      >
        {label}
      </span>
      {active && <span aria-hidden="true" className="absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground/70" />}
    </Comp>
  );
}

function DockSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dock-separator" role="separator" aria-orientation="vertical" className={cn("mx-1 h-[70%] w-px self-center bg-border", className)} {...props} />;
}

export { Dock, DockItem, DockSeparator };
export type { DockProps, DockItemProps };

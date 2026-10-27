"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cuePing } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The fill lives on a `::before` surface layer: it compresses slightly on press while the label stays put and
 * sharp, so the press reads as physical without the text wobbling. Every color comes from theme tokens.
 */
const buttonVariants = cva(
  [
    "group/button relative isolate inline-flex shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-lg text-sm font-medium whitespace-nowrap select-none outline-none",
    "transition-[color,box-shadow] duration-150 ease-cue focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress aria-invalid:ring-3 aria-invalid:ring-destructive/25",
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:transition-[scale,background-color,box-shadow] before:duration-200 before:ease-cue",
    "active:not-aria-[haspopup]:before:scale-[0.97] motion-reduce:before:transition-none motion-reduce:active:before:scale-100",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "[&_[data-slot=kbd]]:border-current/15 [&_[data-slot=kbd]]:bg-current/8 [&_[data-slot=kbd]]:text-current/70 [&_[data-slot=kbd]]:shadow-none",
  ],
  {
    variants: {
      variant: {
        primary:
          "text-primary-foreground before:bg-primary before:shadow-[inset_0_1px_0_var(--cl-highlight),0_0_0_1px_color-mix(in_oklch,var(--primary),var(--foreground)_12%),0_1px_2px_var(--cl-shade)] hover:before:bg-[color-mix(in_oklch,var(--primary),var(--background)_12%)]",
        secondary:
          "text-secondary-foreground before:bg-secondary hover:before:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)] aria-expanded:before:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)]",
        outline:
          "text-foreground before:bg-background before:shadow-[0_0_0_1px_var(--input),0_1px_2px_var(--cl-shade)] hover:before:bg-muted aria-expanded:before:bg-muted dark:before:bg-input/30 dark:hover:before:bg-input/50",
        ghost: "text-foreground hover:before:bg-foreground/6 aria-expanded:before:bg-foreground/6 active:before:bg-foreground/10",
        destructive:
          "text-white before:bg-destructive before:shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_1px_2px_var(--cl-shade)] hover:before:bg-[color-mix(in_oklch,var(--destructive),black_8%)] focus-visible:ring-destructive/40 dark:before:bg-destructive/80",
        link: "text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground",
      },
      size: {
        xs: "h-ctl-xs gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-ctl-sm gap-1 rounded-md px-2.5 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-ctl-md px-3",
        lg: "h-ctl-lg gap-2 px-4",
        icon: "size-ctl-md",
        "icon-sm": "size-ctl-sm rounded-md",
        "icon-lg": "size-ctl-lg",
      },
      pill: {
        true: "rounded-full",
      },
    },
    compoundVariants: [
      { variant: "link", className: "h-auto px-0" },
      { pill: true, size: "md", className: "px-4" },
      { pill: true, size: "lg", className: "px-5" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (e.g. a link) with button styles instead of a `<button>`. */
    asChild?: boolean;
    /** Shows a spinner, keeps the button's width, sets `aria-busy` and blocks clicks. */
    loading?: boolean;
    /** A keyboard shortcut hint rendered inside the button, e.g. `"⌘K"`. */
    kbd?: React.ReactNode;
    /** The ring that ripples out from the press point (GSAP, follows `--cl-motion`). */
    ping?: boolean;
  };

function Button({ className, variant = "primary", size = "md", pill, asChild = false, loading = false, kbd, ping = variant !== "link", disabled, children, onPointerDown, onClick, ...props }: ButtonProps) {
  const shared = {
    "data-slot": "button",
    "data-variant": variant,
    "data-size": size,
    className: cn(buttonVariants({ variant, size, pill }), className),
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (ping && !e.defaultPrevented) cuePing(e.currentTarget, e);
    },
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      // Keyboard activation (Enter/Space) reports detail 0: ping from the center.
      if (ping && e.detail === 0 && !e.defaultPrevented) cuePing(e.currentTarget, { clientX: 0, clientY: 0 });
    },
  };

  if (asChild) {
    return (
      <Slot.Root {...shared} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button {...shared} aria-busy={loading || undefined} disabled={disabled || loading} {...props}>
      {loading && <Spinner className="absolute inset-0 m-auto" />}
      <span data-slot="button-content" className={cn("inline-flex items-center gap-[inherit]", loading && "invisible")}>
        {children}
        {kbd != null && (
          <kbd data-slot="kbd" className="cue-kbd -me-1.5">
            {kbd}
          </kbd>
        )}
      </span>
    </button>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg data-slot="spinner" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn("size-4 animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]", className)}>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M14.25 8A6.25 6.25 0 0 0 8 1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };

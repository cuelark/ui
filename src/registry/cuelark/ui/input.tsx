"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

import { gsap, motionScale, useAttributeCue, useMergedRef } from "@/lib/motion";
import { cn } from "@/lib/utils";

const fieldVariants = cva(
  "w-full min-w-0 rounded-md border border-input bg-card text-sm text-foreground shadow-well transition-[border-color,box-shadow] duration-150 ease-cue",
  {
    variants: {
      size: {
        sm: "h-ctl-sm px-2.5 text-[0.8125rem]",
        md: "h-ctl-md px-3",
        lg: "h-ctl-lg px-3.5 text-[0.9375rem]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const focus = "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20";
const invalid = "aria-invalid:border-destructive aria-invalid:ring-destructive/20";

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  size?: "sm" | "md" | "lg";
  /** Content before the text, e.g. an icon or a `https://` prefix. Wraps the input in a field group. */
  leading?: React.ReactNode;
  /** Content after the text, e.g. a unit, a `<kbd>` hint or an icon button. */
  trailing?: React.ReactNode;
};

/**
 * A text input. With `leading` or `trailing`, `className` styles the surrounding field group
 * and the `<input>` itself stays borderless inside it. When `aria-invalid` turns on, the field gives a short shake.
 */
function Input({ className, type = "text", size = "md", leading, trailing, ref, ...props }: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(inputRef, ref);

  useAttributeCue(inputRef, "aria-invalid", (value, input) => {
    const scale = motionScale(input);
    if (!scale || value !== "true") return;
    const field = input.closest<HTMLElement>('[data-slot="input-group"]') ?? input;
    gsap.fromTo(field, { x: 0 }, { keyframes: { x: [0, -5 * scale, 4 * scale, -2 * scale, 1 * scale, 0] }, duration: 0.42, ease: "none" });
  });

  const field = cn(
    "placeholder:text-muted-foreground/80 disabled:cursor-not-allowed disabled:opacity-50",
    "file:me-3 file:h-full file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
  );

  if (leading == null && trailing == null) {
    return <input ref={mergedRef} data-slot="input" type={type} className={cn(fieldVariants({ size }), field, focus, invalid, className)} {...props} />;
  }

  return (
    <div
      data-slot="input-group"
      className={cn(
        fieldVariants({ size }),
        "flex cursor-text items-center gap-2",
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/20",
        "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20",
        "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
        className,
      )}
    >
      {leading != null && <InputAddon>{leading}</InputAddon>}
      <input ref={mergedRef} data-slot="input" type={type} className={cn("h-full w-full min-w-0 flex-1 bg-transparent outline-none", field, "disabled:opacity-100")} {...props} />
      {trailing != null && <InputAddon>{trailing}</InputAddon>}
    </div>
  );
}

function InputAddon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-addon"
      className={cn("flex shrink-0 items-center gap-1 text-muted-foreground select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    />
  );
}

export { Input, InputAddon, fieldVariants };
export type { InputProps };

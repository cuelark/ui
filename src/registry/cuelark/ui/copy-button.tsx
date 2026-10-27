"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { gsap, motionScale } from "@/lib/motion";
import { buttonVariants } from "@/registry/cuelark/ui/button";
import { cn } from "@/lib/utils";

type CopyButtonProps = Omit<React.ComponentProps<"button">, "value"> &
  VariantProps<typeof buttonVariants> & {
    /** The text to copy. */
    value: string;
    /** A visible label next to the icon; it reads "Copied" for a moment after copying. */
    label?: string;
    /** How long the confirmation stays, in ms. */
    timeout?: number;
    onCopied?: (value: string) => void;
  };

/** Copies to the clipboard; the copy icon twists into a check (GSAP) and the result is announced politely. */
function CopyButton({ value, label, timeout = 1600, onCopied, variant = "ghost", size, className, onClick, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const iconRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const icon = iconRef.current;
    if (!icon || !motionScale(icon)) return;
    gsap.fromTo(icon, { rotate: copied ? -90 : 90, scale: 0.4, opacity: 0 }, { rotate: 0, scale: 1, opacity: 1, duration: 0.45, ease: "cue-snap" });
  }, [copied]);

  React.useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), timeout);
    return () => clearTimeout(id);
  }, [copied, timeout]);

  return (
    <button
      type="button"
      data-slot="copy-button"
      data-copied={copied || undefined}
      aria-label={label ? undefined : copied ? "Copied" : "Copy to clipboard"}
      className={cn(buttonVariants({ variant, size: size ?? (label ? "sm" : "icon-sm") }), className)}
      onClick={async (e) => {
        onClick?.(e);
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopied?.(value);
      }}
      {...props}
    >
      <span ref={iconRef} className="inline-flex">
        {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
      </span>
      {label && <span>{copied ? "Copied" : label}</span>}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}

export { CopyButton };
export type { CopyButtonProps };

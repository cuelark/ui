"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  /** Grows with its content (CSS `field-sizing: content`), between `min-h` and `max-h` you set. */
  autoGrow?: boolean;
  /** Shows a live character count; with `maxLength` it reads `12 / 280` and warns near the limit. */
  showCount?: boolean;
};

function Textarea({ className, autoGrow = false, showCount = false, maxLength, onChange, value, defaultValue, ...props }: TextareaProps) {
  const [length, setLength] = React.useState(() => String(value ?? defaultValue ?? "").length);
  const current = value !== undefined ? String(value).length : length;
  const near = maxLength ? current / maxLength >= 0.9 : false;

  const textarea = (
    <textarea
      data-slot="textarea"
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => {
        setLength(e.target.value.length);
        onChange?.(e);
      }}
      className={cn(
        "flex min-h-20 w-full min-w-0 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-well transition-[border-color,box-shadow] duration-150 ease-cue outline-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        autoGrow && "[field-sizing:content] resize-none",
        showCount && "pb-7",
        !showCount && className,
      )}
      {...props}
    />
  );

  if (!showCount) return textarea;

  return (
    <div data-slot="textarea-group" className={cn("relative w-full", className)}>
      {textarea}
      <span
        data-slot="textarea-count"
        aria-live="polite"
        className={cn("pointer-events-none absolute end-2.5 bottom-2 font-mono text-[0.6875rem] text-muted-foreground tabular-nums", near && "text-warning")}
      >
        {current}
        {maxLength ? ` / ${maxLength}` : ""}
      </span>
    </div>
  );
}

export { Textarea };
export type { TextareaProps };

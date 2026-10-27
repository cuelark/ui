"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  /** Appends a required mark (announced as "required"). */
  required?: boolean;
  /** Appends a quiet mono "optional" tag, for forms where most fields are required. */
  optional?: boolean;
};

function Label({ className, required, optional, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "inline-flex items-center gap-1.5 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-destructive">
          <span aria-hidden="true">*</span>
          <span className="sr-only">required</span>
        </span>
      )}
      {optional && <span className="cue-label normal-case tracking-normal">optional</span>}
    </LabelPrimitive.Root>
  );
}

export { Label };
export type { LabelProps };

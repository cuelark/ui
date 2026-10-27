"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FieldContext = { id: string; descriptionId: string; errorId: string; invalid: boolean };
const FieldCtx = React.createContext<FieldContext | null>(null);

/**
 * Wires a label, control, description and error together with the right ids and aria attributes, so every form
 * field is accessible without hand-written aria-describedby. Put any control inside FieldControl.
 */
function Field({ className, invalid = false, orientation = "vertical", ...props }: React.ComponentProps<"div"> & { invalid?: boolean; orientation?: "vertical" | "horizontal" }) {
  const id = React.useId();
  return (
    <FieldCtx.Provider value={{ id: `${id}-control`, descriptionId: `${id}-description`, errorId: `${id}-error`, invalid }}>
      <div
        data-slot="field"
        data-invalid={invalid || undefined}
        className={cn("grid gap-2", orientation === "horizontal" && "grid-cols-[1fr_auto] items-center gap-x-4", className)}
        {...props}
      />
    </FieldCtx.Provider>
  );
}

function useField() {
  const ctx = React.useContext(FieldCtx);
  if (!ctx) throw new Error("Field parts must be used inside <Field>");
  return ctx;
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  const { id } = useField();
  return <label data-slot="field-label" htmlFor={id} className={cn("text-sm leading-none font-medium", className)} {...props} />;
}

/** Clones its single child with id, aria-describedby and aria-invalid. */
function FieldControl({ children }: { children: React.ReactElement<Record<string, unknown>> }) {
  const { id, descriptionId, errorId, invalid } = useField();
  return React.cloneElement(children, { id, "aria-describedby": invalid ? `${descriptionId} ${errorId}` : descriptionId, "aria-invalid": invalid || undefined });
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId } = useField();
  return <p data-slot="field-description" id={descriptionId} className={cn("text-xs text-muted-foreground", className)} {...props} />;
}

function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  const { errorId, invalid } = useField();
  if (!invalid || !children) return null;
  return (
    <p data-slot="field-error" id={errorId} role="alert" className={cn("text-xs font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  );
}

export { Field, FieldLabel, FieldControl, FieldDescription, FieldError };

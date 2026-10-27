"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";

import { cueTo, gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Step = { title: React.ReactNode; description?: React.ReactNode };

type StepperProps = Omit<React.ComponentProps<"ol">, "children"> & {
  steps: Step[];
  /** Zero-based index of the current step; earlier steps show as complete. */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Makes completed steps clickable. */
  onStepClick?: (index: number) => void;
};

/**
 * Progress through a multi-step flow. The connector fills like ink toward the current step, and the
 * newly reached marker pops (GSAP).
 */
function Stepper({ className, steps, current, orientation = "horizontal", onStepClick, ...props }: StepperProps) {
  const rootRef = React.useRef<HTMLOListElement>(null);
  const first = React.useRef(true);
  // Server-rendered fill state; afterwards GSAP owns the transform so React never resets a running tween.
  const initial = React.useRef(current);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scale = first.current ? 0 : motionScale(root);
    first.current = false;
    root.querySelectorAll<HTMLElement>('[data-slot="stepper-fill"]').forEach((fill, i) => {
      cueTo(fill, { [orientation === "vertical" ? "scaleY" : "scaleX"]: i < current ? 1 : 0, duration: 0.5 }, scale);
    });
    const marker = root.querySelector<HTMLElement>(`[data-step="${current}"] [data-slot="stepper-marker"]`);
    if (marker && scale) gsap.fromTo(marker, { scale: 1 - 0.3 * scale }, { scale: 1, duration: 0.5, ease: "cue-snap", delay: 0.3 });
  }, [current, orientation]);

  const vertical = orientation === "vertical";

  return (
    <ol ref={rootRef} data-slot="stepper" data-orientation={orientation} className={cn("flex", vertical ? "flex-col" : "w-full items-start", className)} {...props}>
      {steps.map((step, i) => {
        const state = i < current ? "complete" : i === current ? "current" : "upcoming";
        const clickable = !!onStepClick && state === "complete";
        const Marker = clickable ? "button" : "span";
        return (
          <li
            key={i}
            data-step={i}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            className={cn("group/step relative flex", vertical ? "gap-3 pb-6 last:pb-0" : "flex-1 flex-col gap-2 last:flex-none")}
          >
            <div className={cn("flex items-center", vertical ? "flex-col self-stretch" : "w-full")}>
              <Marker
                {...(clickable ? { type: "button" as const, onClick: () => onStepClick?.(i), "aria-label": `Go back to step ${i + 1}` } : {})}
                data-slot="stepper-marker"
                className={cn(
                  "relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-medium tabular-nums outline-none transition-colors duration-300",
                  "focus-visible:ring-3 focus-visible:ring-ring/50",
                  state === "complete" && "border-primary bg-primary text-primary-foreground shadow-control",
                  state === "current" && "border-primary bg-card text-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--signal)_55%,transparent)]",
                  state === "upcoming" && "border-dashed border-input bg-card text-muted-foreground",
                )}
              >
                {state === "complete" ? <CheckIcon className="size-3.5" strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
              </Marker>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className={cn("relative overflow-hidden rounded-full bg-border", vertical ? "my-1 w-px flex-1" : "mx-2 h-px flex-1")}>
                  <span
                    data-slot="stepper-fill"
                    className={cn("absolute inset-0 bg-primary", vertical ? "origin-top" : "origin-left")}
                    style={{ transform: `${vertical ? "scaleY" : "scaleX"}(${i < initial.current ? 1 : 0})` }}
                  />
                </span>
              )}
            </div>
            <div className={cn("grid gap-0.5", vertical ? "pt-1" : "pe-4")}>
              <span className={cn("text-sm font-medium", state === "upcoming" && "text-muted-foreground")}>{step.title}</span>
              {step.description && <span className="text-xs text-muted-foreground">{step.description}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { Stepper };
export type { StepperProps, Step };

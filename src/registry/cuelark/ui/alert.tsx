"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon } from "lucide-react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 overflow-hidden rounded-lg border bg-card p-4 ps-5 text-sm shadow-control before:absolute before:inset-y-0 before:start-0 before:w-[3px] before:bg-current [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:text-current",
  {
    variants: {
      tone: {
        info: "border-primary/25 text-primary",
        success: "border-success/25 text-success",
        warning: "border-warning/30 text-warning",
        destructive: "border-destructive/25 text-destructive",
        neutral: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

const defaultIcons = { info: InfoIcon, success: CheckCircle2Icon, warning: AlertTriangleIcon, destructive: XCircleIcon, neutral: InfoIcon };

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    /** Replace the tone icon, or pass `null` to hide it. */
    icon?: React.ReactNode;
    /** Shows a close button; the alert folds away (GSAP) and then calls `onDismiss`. */
    onDismiss?: () => void;
  };

/** A callout with a colored rail. Title and description stay in foreground colors for readability. */
function Alert({ className, tone = "info", icon, onDismiss, children, ...props }: AlertProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [gone, setGone] = React.useState(false);
  const Icon = defaultIcons[tone ?? "info"];

  const dismiss = () => {
    const el = ref.current;
    const done = () => {
      setGone(true);
      onDismiss?.();
    };
    if (!el || !motionScale(el)) return done();
    gsap.to(el, { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, borderWidth: 0, duration: 0.35, ease: "cue", onComplete: done });
  };

  if (gone) return null;

  return (
    <div ref={ref} role={tone === "destructive" || tone === "warning" ? "alert" : "status"} data-slot="alert" data-tone={tone} className={cn(alertVariants({ tone }), onDismiss && "pe-10", className)} {...props}>
      {icon === undefined ? <Icon /> : icon}
      <div className={cn("grid gap-1", icon === null && "col-span-2")}>{children}</div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismiss}
          className="absolute top-3.5 right-3 rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("font-medium text-foreground", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("text-muted-foreground [&_p]:leading-relaxed", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
export type { AlertProps };

"use client";

import * as React from "react";
import { CheckIcon, ShieldAlertIcon, ShieldQuestionIcon, XIcon } from "lucide-react";

import { enterOnce, pop } from "@/lib/motion";
import { Button } from "@/registry/cuelark/ui/button";
import { HoldToConfirm } from "@/registry/cuelark/ui/hold-to-confirm";
import { cn } from "@/lib/utils";

type ConfirmationProps = Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The exact command or action, shown verbatim. */
  command?: string;
  /** High-risk actions must be held to approve, so they cannot be clicked through by reflex. */
  risk?: "low" | "high";
  onApprove?: () => void;
  onDeny?: () => void;
  /** Start as a receipt, e.g. when rendering a past turn from history. */
  defaultDecision?: "approved" | "denied";
};

/**
 * An agent asking permission before it acts (running a command, sending an email, spending money). The exact
 * action is shown verbatim; risky ones require press-and-hold; the decision then collapses to a one-line receipt.
 */
function Confirmation({ title, description, command, risk = "low", onApprove, onDeny, defaultDecision, className, ...props }: ConfirmationProps) {
  const [decision, setDecision] = React.useState<"approved" | "denied" | null>(defaultDecision ?? null);
  const enter = React.useCallback((node: HTMLDivElement | null) => enterOnce(node, (s) => ({ opacity: 0, y: 8 * s, scale: 0.98 }), { duration: 0.35 }), []);

  if (decision) {
    return (
      <div ref={(n) => pop(n?.firstElementChild ?? null)} data-slot="confirmation" data-decision={decision} className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <span className={cn("grid size-4 place-items-center rounded-full", decision === "approved" ? "bg-signal text-signal-foreground" : "bg-muted")}>
          {decision === "approved" ? <CheckIcon className="size-2.5" strokeWidth={3.5} /> : <XIcon className="size-2.5" strokeWidth={3} />}
        </span>
        <span className="text-foreground">{decision === "approved" ? "Approved" : "Denied"}</span>
        {command && <code className="truncate font-mono text-xs">{command}</code>}
      </div>
    );
  }

  const Icon = risk === "high" ? ShieldAlertIcon : ShieldQuestionIcon;
  return (
    <div
      ref={enter}
      role="group"
      aria-label="Permission request"
      data-slot="confirmation"
      data-risk={risk}
      className={cn("grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-raised data-[risk=high]:border-destructive/30", className)}
      {...props}
    >
      <div className="flex gap-3">
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", risk === "high" ? "bg-destructive/10 text-destructive" : "bg-muted")}>
          <Icon className="size-4" />
        </span>
        <div className="grid gap-0.5">
          <p className="text-sm font-medium">{title}</p>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {command && <pre className="overflow-x-auto rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs ring-1 ring-border">{command}</pre>}
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setDecision("denied");
            onDeny?.();
          }}
        >
          Deny
        </Button>
        {risk === "high" ? (
          <HoldToConfirm
            className="h-ctl-sm"
            duration={1000}
            onConfirm={() => {
              setDecision("approved");
              onApprove?.();
            }}
          >
            Hold to allow
          </HoldToConfirm>
        ) : (
          <Button
            size="sm"
            onClick={() => {
              setDecision("approved");
              onApprove?.();
            }}
          >
            Allow
          </Button>
        )}
      </div>
    </div>
  );
}

export { Confirmation };
export type { ConfirmationProps };

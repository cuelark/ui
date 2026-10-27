"use client";

import * as React from "react";
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon, CircleDashedIcon, WrenchIcon } from "lucide-react";

import { flash, pop } from "@/lib/motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/cuelark/ui/collapsible";
import { Spinner } from "@/registry/cuelark/ui/spinner";
import { TextShimmer } from "@/registry/cuelark/ui/text-shimmer";
import { cn } from "@/lib/utils";

type ToolStatus = "pending" | "running" | "success" | "error";

type ToolProps = Omit<React.ComponentProps<typeof Collapsible>, "children"> & {
  name: string;
  status?: ToolStatus;
  /** Arguments the agent called the tool with. Objects are pretty-printed. */
  input?: unknown;
  /** What the tool returned (or the error). */
  output?: unknown;
  /** Seconds the call took. */
  duration?: number;
  icon?: React.ReactNode;
};

const print = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v, null, 2));

/**
 * One tool call, compact by default: the mono tool name, a live status (shimmer while running), and timing. Expand
 * for the exact parameters and result. Errors open themselves, so failures are never hidden.
 */
function Tool({ name, status = "success", input, output, duration, icon, className, defaultOpen, ...props }: ToolProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prev = React.useRef(status);
  React.useLayoutEffect(() => {
    if (prev.current === status) return;
    const was = prev.current;
    prev.current = status;
    if (was === "running" || was === "pending") {
      flash(ref.current);
      pop(ref.current?.querySelector('[data-part="status"]') ?? null);
    }
  }, [status]);
  return (
    <Collapsible
      ref={ref}
      data-slot="tool"
      data-status={status}
      defaultOpen={defaultOpen ?? status === "error"}
      className={cn("group/tool overflow-hidden rounded-xl border border-border bg-card text-sm data-[status=error]:border-destructive/40", className)}
      {...props}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset">
        <span className="grid size-6 place-items-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">{icon ?? <WrenchIcon />}</span>
        <span className="truncate font-mono text-[0.8125rem]">{status === "running" ? <TextShimmer>{name}</TextShimmer> : name}</span>
        <span className="ms-auto flex items-center gap-2 text-xs text-muted-foreground">
          {duration != null && status !== "running" && <span className="font-mono tabular-nums">{duration.toFixed(1)}s</span>}
          <span data-part="status" className="grid">
            <StatusMark status={status} />
          </span>
          <ChevronDownIcon className="size-4 transition-transform duration-200 ease-cue group-data-[state=open]/tool:rotate-180" />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid gap-3 border-t border-border bg-muted/30 p-3">
          {input !== undefined && (
            <section className="grid gap-1.5">
              <h4 className="cue-label">Parameters</h4>
              <pre className="max-h-48 overflow-auto rounded-lg bg-background p-3 font-mono text-xs leading-relaxed ring-1 ring-border">{print(input)}</pre>
            </section>
          )}
          {output !== undefined && (
            <section className="grid gap-1.5">
              <h4 className={cn("cue-label", status === "error" && "text-destructive")}>{status === "error" ? "Error" : "Result"}</h4>
              <pre className={cn("max-h-48 overflow-auto rounded-lg bg-background p-3 font-mono text-xs leading-relaxed ring-1 ring-border", status === "error" && "text-destructive ring-destructive/30")}>{print(output)}</pre>
            </section>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function StatusMark({ status }: { status: ToolStatus }) {
  if (status === "running") return <Spinner size="sm" className="text-foreground" label="Running" />;
  if (status === "pending") return <CircleDashedIcon className="size-4" aria-label="Pending" />;
  if (status === "error") return <AlertTriangleIcon className="size-4 text-destructive" aria-label="Failed" />;
  return (
    <span className="grid size-4 place-items-center rounded-full bg-signal text-signal-foreground" aria-label="Done">
      <CheckIcon className="size-2.5" strokeWidth={3.5} />
    </span>
  );
}

export { Tool };
export type { ToolProps, ToolStatus };

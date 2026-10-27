"use client";

import * as React from "react";
import { BotIcon, CheckIcon, ChevronDownIcon } from "lucide-react";

import { flash, pop } from "@/lib/motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/cuelark/ui/collapsible";
import { Spinner } from "@/registry/cuelark/ui/spinner";
import { TextShimmer } from "@/registry/cuelark/ui/text-shimmer";
import { cn } from "@/lib/utils";

type SubagentProps = Omit<React.ComponentProps<typeof Collapsible>, "title"> & {
  name: string;
  /** What it was asked to do. */
  task: React.ReactNode;
  status?: "running" | "done" | "error";
  /** Latest activity line while running. */
  activity?: string;
  duration?: number;
};

/**
 * Work delegated to a sub-agent, nested inside the parent's turn: its name and task, a live activity line while it
 * runs, and its full transcript tucked inside, indented on a rail so ownership is always clear.
 */
function Subagent({ name, task, status = "running", activity, duration, className, children, ...props }: SubagentProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prev = React.useRef(status);
  React.useLayoutEffect(() => {
    if (prev.current === status) return;
    prev.current = status;
    if (status === "done") {
      flash(ref.current);
      pop(ref.current?.querySelector('[data-part="done"]') ?? null);
    }
  }, [status]);
  return (
    <Collapsible
      ref={ref} data-slot="subagent" data-status={status} className={cn("group/sub rounded-xl border border-border bg-card", className)} {...props}>
      <CollapsibleTrigger className="flex w-full items-start gap-2.5 p-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted">
          <BotIcon className="size-3.5" />
        </span>
        <span className="grid min-w-0 flex-1 gap-0.5">
          <span className="flex items-center gap-2 text-sm">
            <span className="font-mono text-[0.8125rem] font-medium">{name}</span>
            {status === "running" && <Spinner size="sm" label="Running" className="text-foreground" />}
            {status === "done" && (
              <span data-part="done" className="grid size-4 place-items-center rounded-full bg-signal text-signal-foreground">
                <CheckIcon className="size-2.5" strokeWidth={3.5} />
              </span>
            )}
            {duration != null && status !== "running" && <span className="font-mono text-xs text-muted-foreground">{duration.toFixed(1)}s</span>}
          </span>
          <span className="truncate text-sm text-muted-foreground">{task}</span>
          {status === "running" && activity && <TextShimmer className="truncate text-xs">{activity}</TextShimmer>}
        </span>
        <ChevronDownIcon className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-cue group-data-[state=open]/sub:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ms-6 grid gap-3 border-s-2 border-dashed border-border py-1 ps-4 pe-3 pb-3 text-sm">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { Subagent };
export type { SubagentProps };

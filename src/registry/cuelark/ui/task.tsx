"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, CircleDashedIcon } from "lucide-react";

import { pop } from "@/lib/motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/cuelark/ui/collapsible";
import { Progress } from "@/registry/cuelark/ui/progress";
import { TextShimmer } from "@/registry/cuelark/ui/text-shimmer";
import { cn } from "@/lib/utils";

type TaskItem = { label: string; status: "done" | "active" | "todo" };

/** A to-do list the agent works through: a progress bar, the active item shimmering, finished ones checked off. */
function Task({ title, items, className, defaultOpen = true, ...props }: Omit<React.ComponentProps<typeof Collapsible>, "title"> & { title: React.ReactNode; items: TaskItem[] }) {
  const done = items.filter((i) => i.status === "done").length;
  const list = React.useRef<HTMLUListElement>(null);
  const prev = React.useRef(items.map((i) => i.status));
  React.useLayoutEffect(() => {
    items.forEach((it, i) => {
      if (it.status === "done" && prev.current[i] !== "done") pop(list.current?.children[i]?.firstElementChild ?? null);
    });
    prev.current = items.map((i) => i.status);
  }, [items]);
  return (
    <Collapsible data-slot="task" defaultOpen={defaultOpen} className={cn("group/task grid gap-2 rounded-xl border border-border bg-card p-3", className)} {...props}>
      <CollapsibleTrigger className="flex items-center gap-2.5 rounded-md text-left text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="flex-1 font-medium">{title}</span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {done}/{items.length}
        </span>
        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200 ease-cue group-data-[state=open]/task:rotate-180" />
      </CollapsibleTrigger>
      <Progress value={(done / Math.max(1, items.length)) * 100} size="sm" aria-label="Task progress" />
      <CollapsibleContent>
        <ul ref={list} className="grid gap-1.5 pt-1">
          {items.map((it) => (
            <li key={it.label} className="flex items-center gap-2.5 text-sm">
              {it.status === "done" ? (
                <span className="grid size-4 place-items-center rounded-full bg-foreground text-background">
                  <CheckIcon className="size-2.5" strokeWidth={3.5} />
                </span>
              ) : it.status === "active" ? (
                <span className="size-4 rounded-full border-2 border-signal bg-signal/20" />
              ) : (
                <CircleDashedIcon className="size-4 text-muted-foreground/60" />
              )}
              <span className={cn(it.status === "done" && "text-muted-foreground line-through decoration-border", it.status === "todo" && "text-muted-foreground")}>
                {it.status === "active" ? <TextShimmer>{it.label}</TextShimmer> : it.label}
              </span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { Task };
export type { TaskItem };

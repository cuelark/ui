"use client";

import * as React from "react";
import { ChevronDownIcon, CopyIcon, XCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StackTraceProps = React.ComponentProps<"div"> & {
  /** The raw error text: first line is the message, following "at …" lines are frames. */
  trace: string;
  /** Collapse frames from node_modules and node: internals. */
  hideInternal?: boolean;
};

/**
 * An error and its stack, readable: the message up top in red, your frames highlighted with file and line, library
 * and runtime frames folded away, and the raw text one click from your clipboard.
 */
function StackTrace({ trace, hideInternal = true, className, ...props }: StackTraceProps) {
  const [message, ...rest] = trace.trim().split("\n");
  const frames = rest.map((l) => l.trim()).filter(Boolean).map((l) => {
    const m = /at (?:(.+?) \()?(.+?):(\d+):(\d+)\)?$/.exec(l);
    return { raw: l, fn: m?.[1] ?? "(anonymous)", file: m?.[2] ?? l, line: m?.[3], internal: /node_modules|node:|internal\//.test(l) };
  });
  const [showAll, setShowAll] = React.useState(!hideInternal);
  const shown = showAll ? frames : frames.filter((f) => !f.internal);
  const hidden = frames.length - shown.length;

  return (
    <div data-slot="stack-trace" className={cn("overflow-hidden rounded-xl border border-destructive/30 bg-card text-sm", className)} {...props}>
      <div className="flex items-start gap-2.5 border-b border-destructive/20 bg-destructive/5 px-3 py-2.5">
        <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
        <p className="flex-1 font-mono text-xs leading-relaxed font-medium text-destructive">{message}</p>
        <button type="button" aria-label="Copy stack trace" onClick={() => navigator.clipboard.writeText(trace)} className="-m-1 grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
          <CopyIcon className="size-3.5" />
        </button>
      </div>
      <ol className="grid font-mono text-xs">
        {shown.map((f, i) => (
          <li key={i} className={cn("flex items-baseline gap-3 border-b border-border/60 px-3 py-1.5 last:border-b-0", f.internal ? "text-muted-foreground/70" : "text-foreground")}>
            <span className="w-20 shrink-0 truncate sm:w-28">{f.fn}</span>
            {/* The path truncates from its start; the line number never does. */}
            <span className="flex min-w-0 text-muted-foreground">
              <span className="truncate [direction:rtl]">
                <bdi>{f.file}</bdi>
              </span>
              {f.line && <span className={cn("shrink-0", !f.internal && "text-foreground")}>:{f.line}</span>}
            </span>
          </li>
        ))}
      </ol>
      {hidden > 0 || showAll ? (
        <button type="button" onClick={() => setShowAll((s) => !s)} className="flex w-full items-center justify-center gap-1 border-t border-border py-1.5 text-[0.6875rem] text-muted-foreground hover:bg-muted hover:text-foreground">
          <ChevronDownIcon className={cn("size-3.5 transition-transform", showAll && "rotate-180")} />
          {showAll ? "Hide library frames" : `${hidden} library frames`}
        </button>
      ) : null}
    </div>
  );
}

export { StackTrace };
export type { StackTraceProps };

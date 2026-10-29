"use client";

import * as React from "react";
import { BotIcon, ChevronRightIcon, SparklesIcon, WrenchIcon } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/cuelark/ui/tooltip";
import { cn } from "@/lib/utils";

type SpanKind = "agent" | "llm" | "tool";
type TraceSpan = {
  id: string;
  name: string;
  kind: SpanKind;
  /** Seconds from the start of the run. */
  start: number;
  /** Omit while the span is still running. */
  end?: number;
  tokens?: number;
  cost?: number;
  error?: boolean;
  children?: TraceSpan[];
};

type TraceWaterfallProps = React.ComponentProps<"div"> & {
  spans: TraceSpan[];
  /** Current time in seconds for running spans; ticks on its own when omitted and something is running. */
  now?: number;
};

const ICON: Record<SpanKind, React.ComponentType<{ className?: string }>> = { agent: BotIcon, llm: SparklesIcon, tool: WrenchIcon };
const BAR: Record<SpanKind, string> = {
  agent: "bg-foreground/15 ring-1 ring-foreground/25 ring-inset",
  llm: "bg-signal",
  tool: "bg-foreground/70",
};

function flatten(spans: TraceSpan[], open: Set<string>, depth = 0): { span: TraceSpan; depth: number }[] {
  return spans.flatMap((s) => [{ span: s, depth }, ...(s.children && open.has(s.id) ? flatten(s.children, open, depth + 1) : [])]);
}

/**
 * An agent run on one timeline: nested agents, model calls and tools as bars, running spans growing live with a
 * shimmer at their edge. Hover a bar for duration, tokens and cost; collapse branches to focus.
 */
function TraceWaterfall({ spans, now: nowProp, className, ...props }: TraceWaterfallProps) {
  const [open, setOpen] = React.useState(() => new Set(spans.flatMap(function ids(s: TraceSpan): string[] { return [s.id, ...(s.children ?? []).flatMap(ids)]; })));
  const all = flatten(spans, new Set([...open, ...spans.map((s) => s.id)])).map((r) => r.span);
  const running = all.some((s) => s.end === undefined);
  const [tick, setTick] = React.useState(() => Math.max(...all.map((s) => s.end ?? s.start)));
  React.useEffect(() => {
    if (nowProp !== undefined || !running) return;
    const t0 = performance.now() - tick * 1000;
    let raf = 0;
    const loop = () => {
      setTick((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, nowProp]);
  const now = nowProp ?? tick;
  const domain = Math.max(1, ...all.map((s) => s.end ?? now)) * 1.08;
  const step = [0.5, 1, 2, 5, 10, 15, 30, 60].find((s) => domain / s <= 6) ?? 60;
  const ticks = Array.from({ length: Math.floor(domain / step) + 1 }, (_, i) => i * step);
  const rows = flatten(spans, open);
  const toggle = (id: string) => setOpen((o) => (o.has(id) ? (o.delete(id), new Set(o)) : new Set(o).add(id)));

  return (
    <div data-slot="trace-waterfall" className={cn("overflow-hidden rounded-xl border border-border bg-card text-sm", className)} {...props}>
      <div className="grid grid-cols-[minmax(9rem,14rem)_1fr] border-b border-border bg-muted/40 text-[0.6875rem] text-muted-foreground">
        <div className="cue-label px-3 py-2">Span</div>
        <div className="relative">
          {ticks.map((t) => (
            <span key={t} className="absolute top-2 font-mono" style={{ left: `calc(${(t / domain) * 100}% + 4px)` }}>
              {t}s
            </span>
          ))}
        </div>
      </div>
      <div role="tree" aria-label="Trace" className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 left-[min(14rem,40%)]">
          {ticks.map((t) => (
            <span key={t} className="absolute inset-y-0 w-px bg-border/60" style={{ left: `${(t / domain) * 100}%` }} />
          ))}
        </div>
        {rows.map(({ span, depth }) => {
          const Icon = ICON[span.kind];
          const end = span.end ?? now;
          const live = span.end === undefined;
          const hasKids = !!span.children?.length;
          return (
            <div key={span.id} role="treeitem" aria-expanded={hasKids ? open.has(span.id) : undefined} className="grid grid-cols-[minmax(9rem,14rem)_1fr] items-center border-b border-border/60 last:border-b-0 hover:bg-muted/40">
              <div className="flex min-w-0 items-center gap-1.5 py-1.5 pe-2" style={{ paddingInlineStart: 8 + depth * 16 }}>
                {hasKids ? (
                  <button type="button" onClick={() => toggle(span.id)} aria-label={open.has(span.id) ? "Collapse" : "Expand"} className="relative after:absolute after:-inset-2 grid size-4 place-items-center rounded text-muted-foreground hover:text-foreground">
                    <ChevronRightIcon className={cn("size-3.5 transition-transform duration-200 ease-cue", open.has(span.id) && "rotate-90")} />
                  </button>
                ) : (
                  <span className="size-4" />
                )}
                <Icon className={cn("size-3.5 shrink-0 text-muted-foreground", span.error && "text-destructive")} />
                <span className={cn("truncate font-mono text-xs", span.error && "text-destructive")}>{span.name}</span>
              </div>
              <div className="relative h-7">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={0}
                      className={cn("absolute top-1.5 h-4 min-w-1 rounded-[4px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50", span.error ? "bg-destructive" : BAR[span.kind], live && "overflow-hidden")}
                      style={{ left: `${(span.start / domain) * 100}%`, width: `${((end - span.start) / domain) * 100}%` }}
                    >
                      {live && <span className="absolute inset-y-0 right-0 w-6 animate-pulse bg-gradient-to-r from-transparent to-white/60" />}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="font-mono">
                      {span.name} · {(end - span.start).toFixed(2)}s{span.tokens ? ` · ${span.tokens.toLocaleString()} tok` : ""}
                      {span.cost ? ` · $${span.cost.toFixed(3)}` : ""}
                      {live ? " · running" : ""}
                    </span>
                  </TooltipContent>
                </Tooltip>
                <span className="pointer-events-none absolute top-1.5 font-mono text-[0.625rem] leading-4 text-muted-foreground" style={{ left: `calc(${(end / domain) * 100}% + 6px)` }}>
                  {(end - span.start).toFixed(1)}s
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 border-t border-border bg-muted/30 px-3 py-2 text-[0.6875rem] text-muted-foreground">
        {(["agent", "llm", "tool"] as const).map((k) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-3 rounded-[2px]", BAR[k])} />
            {k === "llm" ? "model" : k}
          </span>
        ))}
        <span className="ms-auto font-mono">
          {all.reduce((a, s) => a + (s.tokens ?? 0), 0).toLocaleString()} tok · ${all.reduce((a, s) => a + (s.cost ?? 0), 0).toFixed(3)}
        </span>
      </div>
    </div>
  );
}

export { TraceWaterfall };
export type { TraceSpan, TraceWaterfallProps, SpanKind };

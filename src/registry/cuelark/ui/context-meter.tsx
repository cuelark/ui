"use client";

import * as React from "react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/cuelark/ui/hover-card";
import { cn } from "@/lib/utils";

type ContextMeterProps = {
  /** Tokens used so far. */
  used: number;
  /** The model's context window. */
  max: number;
  /** Optional breakdown shown on hover. */
  breakdown?: { input?: number; output?: number; cached?: number; reasoning?: number };
  /** Spend so far, in dollars. */
  cost?: number;
  className?: string;
};

const fmt = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n));

/**
 * How full the model's context window is, as a small ring that warms from ink to amber to red as it fills.
 * Hover for the token breakdown and cost, the things you check before a long conversation degrades.
 */
function ContextMeter({ used, max, breakdown, cost, className }: ContextMeterProps) {
  const pct = Math.min(1, used / max);
  const r = 7;
  const c = 2 * Math.PI * r;
  const color = pct > 0.9 ? "var(--destructive)" : pct > 0.7 ? "var(--warning)" : "var(--foreground)";
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          data-slot="context-meter"
          aria-label={`Context ${Math.round(pct * 100)}% used`}
          className={cn("flex h-8 items-center gap-1.5 rounded-lg px-2 font-mono text-xs text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50", className)}
        >
          <svg viewBox="0 0 18 18" className="size-4 -rotate-90" aria-hidden="true">
            <circle cx="9" cy="9" r={r} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
            <circle cx="9" cy="9" r={r} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} className="transition-[stroke-dashoffset,stroke] duration-500 ease-cue" />
          </svg>
          {Math.round(pct * 100)}%
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="grid w-64 gap-3 p-4">
        <div className="flex items-baseline justify-between">
          <span className="cue-label">Context window</span>
          <span className="font-mono text-xs">
            {fmt(used)} / {fmt(max)}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full transition-[width] duration-500 ease-cue" style={{ width: `${pct * 100}%`, background: color }} />
        </div>
        {breakdown && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {Object.entries(breakdown).map(([k, v]) =>
              v == null ? null : (
                <React.Fragment key={k}>
                  <dt className="text-muted-foreground capitalize">{k}</dt>
                  <dd className="text-right font-mono">{fmt(v)}</dd>
                </React.Fragment>
              ),
            )}
          </dl>
        )}
        {cost != null && (
          <div className="flex justify-between border-t border-border pt-2 text-xs">
            <span className="text-muted-foreground">Cost</span>
            <span className="font-mono">${cost.toFixed(cost < 0.01 ? 4 : 2)}</span>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

export { ContextMeter };
export type { ContextMeterProps };

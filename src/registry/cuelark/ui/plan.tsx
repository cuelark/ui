"use client";

import * as React from "react";
import { CircleDashedIcon, CheckIcon, MinusIcon, MoreHorizontalIcon } from "lucide-react";

import { enterChildren, enterOnce, marksIn, motionScale } from "@/lib/motion";
import { Button } from "@/registry/cuelark/ui/button";
import { cn } from "@/lib/utils";

type PlanStep = { label: string; done?: boolean };

type PlanProps = Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode;
  steps: PlanStep[];
  onApprove?: () => void;
  onReject?: () => void;
  /** Run automatically after this many seconds unless cancelled (a ring counts down on the Run button). */
  autoRun?: number;
  /** Steps shown before "N more". */
  visible?: number;
  /** Bind ⌘/Ctrl+Enter to run and Esc to reject while the plan is pending. */
  shortcuts?: boolean;
};

/**
 * A plan an agent wants to execute, held for your go-ahead. Crop marks lock onto it as it arrives; long plans fold
 * after a few steps; Run can count down to auto-approve (cancel by pressing it's ring). Resolved plans settle quietly.
 */
function Plan({ title = "Plan", steps, onApprove, onReject, autoRun, visible = 4, shortcuts = true, className, ...props }: PlanProps) {
  const [state, setState] = React.useState<"pending" | "approved" | "rejected">("pending");
  const [expanded, setExpanded] = React.useState(false);
  const [left, setLeft] = React.useState(autoRun ?? 0);
  const [counting, setCounting] = React.useState(!!autoRun);
  const ref = React.useRef<HTMLDivElement>(null);

  const approve = React.useCallback(() => {
    setState("approved");
    setCounting(false);
    onApprove?.();
  }, [onApprove]);
  const reject = React.useCallback(() => {
    setState("rejected");
    setCounting(false);
    onReject?.();
  }, [onReject]);

  React.useLayoutEffect(() => {
    const el = ref.current;
    enterOnce(el, (s) => ({ opacity: 0, y: 10 * s }), { duration: 0.4 });
    if (el && motionScale(el)) {
      marksIn(el, 0.1);
      const steps = el.querySelector("ol");
      if (steps) enterChildren(steps.children, { opacity: 0, x: -6 }, { stagger: 0.06, delay: 0.15, duration: 0.3 });
    }
  }, []);

  React.useEffect(() => {
    if (!counting || state !== "pending") return;
    if (left <= 0) return approve();
    const id = setTimeout(() => setLeft((l) => Math.max(0, l - 0.1)), 100);
    return () => clearTimeout(id);
  }, [counting, left, state, approve]);

  React.useEffect(() => {
    if (!shortcuts || state !== "pending") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) approve();
      if (e.key === "Escape") reject();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts, state, approve, reject]);

  const hidden = Math.max(0, steps.length - visible);
  const shown = expanded ? steps : steps.slice(0, visible);
  const pending = state === "pending";

  return (
    <div
      ref={ref}
      data-slot="plan"
      data-state={state}
      className={cn("relative grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-raised", pending && "cue-marks", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="cue-label">{title}</span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {steps.filter((s) => s.done).length}/{steps.length}
        </span>
      </div>
      <ol className="grid gap-2">
        {shown.map((s, i) => (
          <li key={`${s.label}-${i}`} className="flex items-center gap-2.5 text-sm">
            {s.done ? (
              <span className="grid size-4 place-items-center rounded-full bg-foreground text-background">
                <CheckIcon className="size-2.5" strokeWidth={3.5} />
              </span>
            ) : (
              <CircleDashedIcon className="size-4 shrink-0 text-muted-foreground/60" />
            )}
            <span className={cn("truncate", !s.done && "text-muted-foreground")}>{s.label}</span>
          </li>
        ))}
        {hidden > 0 && (
          <li>
            <button type="button" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded} className="flex items-center gap-2.5 rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
              {expanded ? <MinusIcon className="size-4" /> : <MoreHorizontalIcon className="size-4" />}
              {expanded ? "Show less" : `${hidden} more`}
            </button>
          </li>
        )}
      </ol>
      {pending ? (
        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button variant="ghost" size="sm" onClick={reject} kbd={shortcuts ? "esc" : undefined}>
            Reject
          </Button>
          <Button size="sm" onClick={approve} kbd={shortcuts ? "⌘⏎" : undefined}>
            {counting && autoRun ? <CountdownRing left={left} total={autoRun} onCancel={() => setCounting(false)} /> : null}
            Run plan
          </Button>
        </div>
      ) : (
        <p className={cn("flex items-center gap-2 border-t border-border pt-3 text-sm", state === "approved" ? "text-foreground" : "text-muted-foreground")}>
          <span className={cn("size-1.5 rounded-full", state === "approved" ? "bg-signal" : "bg-muted-foreground")} />
          {state === "approved" ? "Approved, running" : "Rejected"}
        </p>
      )}
    </div>
  );
}

function CountdownRing({ left, total, onCancel }: { left: number; total: number; onCancel: () => void }) {
  const r = 6;
  const c = 2 * Math.PI * r;
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`Auto-run in ${Math.ceil(left)} seconds; cancel`}
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.stopPropagation(), e.preventDefault(), onCancel())}
      className="-ms-1 grid size-4 place-items-center rounded-full"
    >
      <svg viewBox="0 0 16 16" className="size-4 -rotate-90" aria-hidden="true">
        <circle cx="8" cy="8" r={r} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <circle cx="8" cy="8" r={r} fill="none" stroke="var(--signal)" strokeWidth="2" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - left / total)} className="transition-[stroke-dashoffset] duration-100 ease-linear" />
      </svg>
    </span>
  );
}

export { Plan };
export type { PlanProps, PlanStep };

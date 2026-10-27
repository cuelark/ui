"use client";

import * as React from "react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TerminalProps = React.ComponentProps<"div"> & {
  lines: string[];
  title?: string;
  /** Shows a live caret and keeps the view pinned to the newest line. */
  streaming?: boolean;
};

const tone = (line: string) =>
  line.startsWith("$ ") ? "text-[oklch(0.9_0.18_127)]" : /^(✓|✔|done|ok\b)/i.test(line) ? "text-[oklch(0.78_0.15_150)]" : /^(✗|✘|error|fail)/i.test(line) ? "text-[oklch(0.72_0.18_25)]" : /^(warn|!)/i.test(line) ? "text-[oklch(0.82_0.14_80)]" : "text-[oklch(0.85_0_0)]";

/**
 * Command output from an agent: always a dark console (readable in both themes), prompts in signal, success and
 * failure lines colored, new lines sliding in while it streams, auto-following the bottom.
 */
function Terminal({ lines, title = "Terminal", streaming = false, className, ...props }: TerminalProps) {
  const body = React.useRef<HTMLDivElement>(null);
  const count = React.useRef(lines.length);

  React.useLayoutEffect(() => {
    const el = body.current;
    if (!el) return;
    const added = Array.from(el.querySelectorAll("[data-line]")).slice(count.current);
    count.current = lines.length;
    if (added.length && motionScale(el)) gsap.fromTo(added, { opacity: 0, x: -4 }, { opacity: 1, x: 0, duration: 0.2, ease: "cue", stagger: 0.03 });
    el.scrollTop = el.scrollHeight;
  }, [lines.length]);

  return (
    <div data-slot="terminal" className={cn("overflow-hidden rounded-xl bg-[oklch(0.16_0.005_80)] text-[oklch(0.85_0_0)] shadow-raised ring-1 ring-black/20", className)} {...props}>
      <div className="flex items-center gap-1.5 border-b border-white/8 px-3 py-2">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ms-2 font-mono text-[0.6875rem] text-white/50">{title}</span>
        {streaming && <span className="ms-auto size-1.5 animate-pulse rounded-full bg-[oklch(0.9_0.18_127)]" aria-label="Running" />}
      </div>
      <div ref={body} role="log" aria-live="polite" className="max-h-64 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} data-line className={cn("whitespace-pre-wrap", tone(l))}>
            {l || " "}
          </div>
        ))}
        {streaming && <span aria-hidden="true" className="inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-[oklch(0.9_0.18_127)]" />}
      </div>
    </div>
  );
}

export { Terminal };
export type { TerminalProps };

"use client";

import * as React from "react";
import { CheckIcon, ChevronRightIcon, MinusIcon, XIcon } from "lucide-react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TestCase = { name: string; status: "pass" | "fail" | "skip"; duration?: number; error?: string };
type TestSuite = { name: string; tests: TestCase[] };

/**
 * Test results an agent ran: a pass/fail/skip summary bar, suites that open on failures, and the failing assertion
 * shown right under its test.
 */
function TestResults({ suites, className, ...props }: React.ComponentProps<"div"> & { suites: TestSuite[] }) {
  const all = suites.flatMap((s) => s.tests);
  const count = (st: TestCase["status"]) => all.filter((t) => t.status === st).length;
  const [open, setOpen] = React.useState(() => new Set(suites.filter((s) => s.tests.some((t) => t.status === "fail")).map((s) => s.name)));
  const bar = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (bar.current && motionScale(bar.current)) gsap.fromTo(bar.current.children, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, stagger: 0.12, duration: 0.6, ease: "cue", clearProps: "transform" });
  }, []);
  const pass = count("pass");
  const fail = count("fail");
  const skip = count("skip");

  return (
    <div data-slot="test-results" className={cn("overflow-hidden rounded-xl border border-border bg-card text-sm", className)} {...props}>
      <div className="grid gap-2 border-b border-border p-3">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium">{fail ? `${fail} failing` : "All passing"}</span>
          <span className="flex items-center gap-1 text-success">
            <CheckIcon className="size-3" /> {pass}
          </span>
          {fail > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <XIcon className="size-3" /> {fail}
            </span>
          )}
          {skip > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <MinusIcon className="size-3" /> {skip}
            </span>
          )}
          <span className="ms-auto font-mono text-muted-foreground">{all.reduce((a, t) => a + (t.duration ?? 0), 0)}ms</span>
        </div>
        <div ref={bar} className="flex h-1.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
          <span className="bg-success" style={{ flex: pass }} />
          <span className="bg-destructive" style={{ flex: fail }} />
          <span className="bg-muted" style={{ flex: skip }} />
        </div>
      </div>
      <ul>
        {suites.map((s) => {
          const isOpen = open.has(s.name);
          const failed = s.tests.some((t) => t.status === "fail");
          return (
            <li key={s.name} className="border-b border-border last:border-b-0">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen((o) => (o.has(s.name) ? (o.delete(s.name), new Set(o)) : new Set(o).add(s.name)))}
                className="flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
              >
                <ChevronRightIcon className={cn("size-3.5 text-muted-foreground transition-transform duration-200 ease-cue", isOpen && "rotate-90")} />
                <span className={cn("size-1.5 rounded-full", failed ? "bg-destructive" : "bg-success")} />
                {s.name}
                <span className="ms-auto text-muted-foreground">{s.tests.length}</span>
              </button>
              {isOpen && (
                <ul className="pb-1.5">
                  {s.tests.map((t) => (
                    <li key={t.name} className="grid gap-1 py-1 ps-9 pe-3 text-xs">
                      <span className="flex items-center gap-2">
                        {t.status === "pass" ? <CheckIcon className="size-3 text-success" /> : t.status === "fail" ? <XIcon className="size-3 text-destructive" /> : <MinusIcon className="size-3 text-muted-foreground" />}
                        <span className={cn(t.status === "skip" && "text-muted-foreground")}>{t.name}</span>
                        {t.duration != null && <span className="ms-auto font-mono text-muted-foreground">{t.duration}ms</span>}
                      </span>
                      {t.error && <pre className="ms-5 overflow-x-auto rounded-md bg-destructive/5 px-2 py-1.5 font-mono text-[0.6875rem] whitespace-pre-wrap text-destructive ring-1 ring-destructive/20">{t.error}</pre>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { TestResults };
export type { TestCase, TestSuite };

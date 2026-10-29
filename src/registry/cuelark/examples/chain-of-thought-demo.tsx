import * as React from "react";
import { FlaskConicalIcon, SearchIcon } from "lucide-react";

import { ChainOfThought, ChainOfThoughtStep } from "@/registry/cuelark/ui/chain-of-thought";

const STEPS = [
  ["Read the failing test output", "Reading the failing test output"],
  ["Searched the codebase for “prorate”", "Searching the codebase for “prorate”"],
  ["Wrote the fix in billing/prorate.ts", "Writing the fix in billing/prorate.ts"],
  ["Ran the test suite", "Running the test suite"],
];
const FILES = ["billing/prorate.ts", "billing/invoice.ts", "api/renew.ts"];

export default function ChainOfThoughtDemo() {
  const [at, setAt] = React.useState(0);
  React.useEffect(() => {
    if (at >= STEPS.length) return;
    const id = setTimeout(() => setAt((n) => n + 1), 1300);
    return () => clearTimeout(id);
  }, [at]);
  const status = (i: number) => (i < at ? "complete" : i === at ? "active" : "pending");
  const label = (i: number) => STEPS[i]![i < at ? 0 : 1];
  return (
    <div className="grid min-h-[16rem] w-full max-w-lg content-start">
      <ChainOfThought title={at >= STEPS.length ? "Fixed the proration bug" : "Working on it"}>
        <ChainOfThoughtStep status={status(0)} label={label(0)} />
        <ChainOfThoughtStep status={status(1)} label={label(1)} icon={<SearchIcon />}>
          {at > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {FILES.map((f) => (
                <span key={f} className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-xs">
                  {f}
                </span>
              ))}
            </div>
          )}
        </ChainOfThoughtStep>
        <ChainOfThoughtStep status={status(2)} label={label(2)} />
        <ChainOfThoughtStep status={status(3)} label={label(3)} icon={<FlaskConicalIcon />} />
      </ChainOfThought>
    </div>
  );
}

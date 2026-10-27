import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { CopyButton } from "@/registry/cuelark/ui/copy-button";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  /** Server-highlighted Shiki HTML. Falls back to plain text when absent. */
  html?: string;
  code: string;
  title?: string;
  /** Collapse long code behind an "Expand" button. */
  collapsible?: boolean;
  className?: string;
};

export function CodeBlock({ html, code, title, collapsible = false, className }: CodeBlockProps) {
  const lines = code.split("\n").length;
  const [expanded, setExpanded] = React.useState(!collapsible || lines <= 18);

  return (
    <figure className={cn("group/code relative overflow-hidden rounded-lg border border-border bg-muted/40", className)}>
      {title && (
        <figcaption className="cue-dash-b flex h-10 items-center justify-between px-4">
          <span className="font-mono text-xs text-muted-foreground">{title}</span>
        </figcaption>
      )}
      <div className={cn("absolute end-2 z-10", title ? "top-1.5" : "top-2")}>
        <CopyButton value={code} className="bg-background/70 backdrop-blur" />
      </div>
      <div className={cn("relative overflow-x-auto text-[0.8125rem] leading-6", !expanded && "max-h-72 overflow-y-hidden")}>
        {html ? (
          <div className="[&_pre]:min-w-max [&_pre]:px-4 [&_pre]:py-3.5 [&_pre]:font-mono" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="min-w-max px-4 py-3.5 font-mono">
            <code>{code}</code>
          </pre>
        )}
        {!expanded && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-muted to-transparent" />}
      </div>
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="cue-dash-t flex w-full items-center justify-center gap-1.5 bg-muted/60 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDownIcon className="size-3.5" /> Expand {lines} lines
        </button>
      )}
    </figure>
  );
}

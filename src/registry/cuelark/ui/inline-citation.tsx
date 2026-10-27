"use client";

import * as React from "react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/cuelark/ui/hover-card";
import { SourceTile } from "@/registry/cuelark/ui/sources";
import { cn } from "@/lib/utils";

type InlineCitationProps = {
  index: number;
  source: { title: string; url: string; excerpt?: string };
  className?: string;
};

/**
 * A numbered citation inside a sentence. Hover or focus previews the source (title, domain, the quoted passage);
 * click opens it. The chip highlights the claim it backs so readers see exactly what is sourced.
 */
function InlineCitation({ index, source, className }: InlineCitationProps) {
  const domain = (() => {
    try {
      return new URL(source.url).hostname.replace(/^www\./, "");
    } catch {
      return source.url;
    }
  })();
  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          data-slot="inline-citation"
          aria-label={`Source ${index}: ${source.title}`}
          className={cn(
            "mx-0.5 inline-grid h-4 min-w-4 -translate-y-px place-items-center rounded-[5px] bg-muted px-1 align-middle font-mono text-[0.625rem] font-medium text-muted-foreground no-underline ring-1 ring-border outline-none transition-colors hover:bg-signal hover:text-signal-foreground hover:ring-transparent focus-visible:ring-3 focus-visible:ring-ring/50",
            className,
          )}
        >
          {index}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="grid w-80 gap-2 p-3.5">
        <div className="flex items-center gap-2">
          <SourceTile url={source.url} />
          <span className="truncate font-mono text-xs text-muted-foreground">{domain}</span>
        </div>
        <p className="text-sm leading-snug font-medium">{source.title}</p>
        {source.excerpt && <blockquote className="border-s-2 border-signal ps-2.5 text-xs leading-relaxed text-muted-foreground">“{source.excerpt}”</blockquote>}
      </HoverCardContent>
    </HoverCard>
  );
}

export { InlineCitation };
export type { InlineCitationProps };

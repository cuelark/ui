"use client";

import * as React from "react";
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";

import { enterChildren, gsap, motionScale } from "@/lib/motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/cuelark/ui/collapsible";
import { cn } from "@/lib/utils";

type Source = { title: string; url: string };

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** A letter tile per domain, tinted deterministically: recognizable without loading third-party favicons. */
function SourceTile({ url, className }: { url: string; className?: string }) {
  const h = host(url);
  const hue = [...h].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 11);
  return (
    <span className={cn("grid size-5 shrink-0 place-items-center rounded-md text-[0.625rem] font-semibold uppercase ring-2 ring-card", className)} style={{ background: `oklch(0.92 0.05 ${hue})`, color: `oklch(0.38 0.1 ${hue})` }}>
      {h[0]}
    </span>
  );
}

/** "Used 5 sources", with their tiles stacked; expands into the list of links, staggered in. */
function Sources({ sources, className, ...props }: Omit<React.ComponentProps<typeof Collapsible>, "children"> & { sources: Source[] }) {
  const list = React.useRef<HTMLUListElement>(null);
  return (
    <Collapsible
      data-slot="sources"
      className={cn("grid gap-2", className)}
      onOpenChange={(o) => o && requestAnimationFrame(() => list.current && motionScale(list.current) && enterChildren(list.current.children, { opacity: 0, y: 4 }, { stagger: 0.03, duration: 0.25 }))}
      {...props}
    >
      <CollapsibleTrigger
        onPointerEnter={(e) => motionScale(e.currentTarget) && gsap.to(e.currentTarget.querySelectorAll('[data-part="tile"]'), { x: (i) => i * 4, duration: 0.3, ease: "cue", overwrite: "auto" })}
        onPointerLeave={(e) => gsap.to(e.currentTarget.querySelectorAll('[data-part="tile"]'), { x: 0, duration: 0.3, ease: "cue", overwrite: "auto" })}
        className="group/sources flex w-fit items-center gap-2 rounded-full border border-border bg-card py-1 ps-1 pe-2.5 text-xs font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="flex -space-x-1.5">
          {sources.slice(0, 4).map((s) => (
            <span key={s.url} data-part="tile" className="grid">
              <SourceTile url={s.url} />
            </span>
          ))}
        </span>
        Used {sources.length} sources
        <ChevronDownIcon className="size-3.5 text-muted-foreground transition-transform duration-200 ease-cue group-data-[state=open]/sources:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul ref={list} className="grid gap-1 sm:grid-cols-2">
          {sources.map((s, i) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="group/src flex items-center gap-2.5 rounded-lg border border-border bg-card p-2 text-sm outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50">
                <span className="font-mono text-[0.6875rem] text-muted-foreground tabular-nums">{i + 1}</span>
                <SourceTile url={s.url} />
                <span className="grid min-w-0 flex-1">
                  <span className="truncate font-medium">{s.title}</span>
                  <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">{host(s.url)}</span>
                </span>
                <ArrowUpRightIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover/src:translate-x-0.5 group-hover/src:-translate-y-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { Sources, SourceTile };
export type { Source };

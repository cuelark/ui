import * as React from "react";
import { Link } from "@tanstack/react-router";

import { formatMarkup, iconTitle, svgMarkup, type IconData } from "@/lib/icons";
import { CopyButton } from "@/registry/cuelark/ui/copy-button";

export type IconSearchHit = { setId: string; setSlug: string; setName: string; name: string; slug: string; data: IconData };

/** Search hits that copy SVG or JSX here. The set name links to the set page; there is no per-icon URL. */
export function IconSearchResults({ results }: { results: IconSearchHit[] }) {
  const [key, setKey] = React.useState<string | null>(null);
  const hit = results.find((r) => `${r.setSlug}/${r.slug}` === key) ?? null;
  const id = hit ? hit.setId : "";
  const jsx = hit ? `import { ${hit.name} } from "react-icons/${id}";\n\n<${hit.name} className="size-5" />` : "";
  const svg = hit ? formatMarkup(svgMarkup(hit.data)) : "";
  return (
    <div className="grid gap-4">
      {hit && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3">
          <span className="text-2xl" dangerouslySetInnerHTML={{ __html: svgMarkup(hit.data) }} />
          <div className="grid min-w-0 flex-1">
            <span className="truncate text-sm font-semibold">{iconTitle(hit.name, id)}</span>
            <Link to="/icons/$set" params={{ set: hit.setSlug }} className="truncate text-xs text-muted-foreground hover:text-foreground hover:underline">
              {hit.setName}
            </Link>
          </div>
          <CopyButton value={jsx} label="Copy JSX" variant="outline" size="sm" />
          <CopyButton value={svg} label="Copy SVG" variant="outline" size="sm" />
          <a
            href={`/r/icons/${hit.setSlug}/${hit.slug}.svg`}
            download={`${hit.slug}.svg`}
            className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted"
          >
            Download
          </a>
        </div>
      )}
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">
        {results.map((r) => {
          const on = hit?.setSlug === r.setSlug && hit.slug === r.slug;
          return (
            <li key={`${r.setSlug}/${r.slug}`}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setKey(`${r.setSlug}/${r.slug}`)}
                className="grid w-full justify-items-center gap-1.5 rounded-xl border border-transparent p-3 text-center outline-none transition-colors hover:border-border hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:border-primary/40 aria-pressed:bg-primary/10"
              >
                <span className="text-2xl" dangerouslySetInnerHTML={{ __html: svgMarkup(r.data) }} />
                <span className="w-full truncate text-[0.6875rem]">{r.slug.replace(/-/g, " ")}</span>
                <span className="w-full truncate text-[0.625rem] text-muted-foreground">{r.setName}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { Link } from "@tanstack/react-router";

import { components, SECTIONS } from "@/content/components";
import { DOC_PAGES } from "@/content/site";
import { ScrollArea } from "@/registry/cuelark/ui/scroll-area";

const linkClass =
  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-accent-foreground";

/** Every docs and component page, grouped. Plain links, so crawlers reach all pages from any page. */
export function DocsSidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 lg:block">
      <ScrollArea fade className="h-full">
        <nav aria-label="Docs" className="grid gap-6 py-8 pe-4">
          <div className="grid gap-1">
            <h2 className="cue-label px-2.5 pb-1">Getting started</h2>
            {DOC_PAGES.map((p) => (
              <Link key={p.path} to={p.path} activeOptions={{ exact: true }} className={linkClass}>
                {p.title}
              </Link>
            ))}
            <Link to="/components" activeOptions={{ exact: true }} className={linkClass}>
              All components
            </Link>
            <Link to="/agents" className={linkClass}>
              Agent UI kit <span className="ms-auto size-1.5 rounded-full bg-signal" />
            </Link>
          </div>
          {SECTIONS.map((section) => (
            <div key={section} className="grid gap-1">
              <h2 className="cue-label px-2.5 pb-1">{section}</h2>
              {components
                .filter((c) => c.section === section)
                .map((c) => (
                  <Link key={c.slug} to="/components/$slug" params={{ slug: c.slug }} className={linkClass}>
                    {c.name}
                  </Link>
                ))}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

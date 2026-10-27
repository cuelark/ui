import * as React from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRightIcon, SearchIcon } from "lucide-react";

import { examples } from "@/components/site/examples";
import { components, SECTIONS, type ComponentDoc, type Section } from "@/content/components";
import { SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";
import { Badge } from "@/registry/cuelark/ui/badge";
import { Empty, EmptyDescription, EmptyTitle } from "@/registry/cuelark/ui/empty";
import { Input } from "@/registry/cuelark/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/registry/cuelark/ui/toggle-group";
import { cn } from "@/lib/utils";

const TITLE = "React components for shadcn/ui";
const DESCRIPTION = `All ${components.length} Cuelark UI components, live: buttons, forms, menus, dialogs, toasts, tables and animated components like text reveal, number ticker, dock and marquee. Accessible, themeable, installable with the shadcn CLI.`;

export const Route = createFileRoute("/_docs/components/")({
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: "/components",
      keywords: ["react components", "shadcn components", "tailwind components", "animated react components", "gsap react components", "ui library"],
      jsonLd: [
        ld.collection(TITLE, DESCRIPTION, "/components", components.map((c) => ({ name: c.name, path: `/components/${c.slug}` }))),
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Components", path: "/components" },
        ]),
      ],
    }),
  component: ComponentsIndex,
});

/** Every card is the real component, not a screenshot: you can press, type and toggle right here. */
function ComponentsIndex() {
  const [query, setQuery] = React.useState("");
  const [section, setSection] = React.useState<Section | "All">("All");
  const q = query.trim().toLowerCase();
  const matches = (c: ComponentDoc) =>
    (section === "All" || c.section === section) && (!q || [c.name, c.description, c.section, ...c.keywords].some((t) => t.toLowerCase().includes(q)));
  const visible = components.filter(matches);

  return (
    <div className="grid gap-10">
      <header className="grid gap-4">
        <span className="cue-label">Library · {components.length} components</span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Components</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">Every card below is the live component. Press, type and toggle, then open one for its source, props and accessibility notes.</p>
      </header>

      <div className="sticky top-14 z-20 -mx-1 grid gap-2.5 border-b border-border bg-background/85 px-1 py-3 backdrop-blur-md">
        <Input
          aria-label="Filter components"
          placeholder="Search components: chat, menu, animation, form…"
          leading={<SearchIcon />}
          trailing={<span className="font-mono text-xs tabular-nums">{visible.length}</span>}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        <div className="-mx-1 overflow-x-auto px-1 [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)] [scrollbar-width:none]">
          <ToggleGroup type="single" variant="ghost" size="sm" value={section} onValueChange={(v) => setSection((v || "All") as Section | "All")} className="w-max" aria-label="Category">
            {(["All", ...SECTIONS] as const).map((s) => (
              <ToggleGroupItem key={s} value={s} className="h-ctl-sm gap-1.5 whitespace-nowrap">
                {s}
                <span className="font-mono text-[0.625rem] text-muted-foreground">{s === "All" ? components.length : components.filter((c) => c.section === s).length}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {visible.length === 0 && (
        <Empty>
          <EmptyTitle>No component matches “{query}”</EmptyTitle>
          <EmptyDescription>Try a broader word, or clear the category filter.</EmptyDescription>
        </Empty>
      )}

      {SECTIONS.map((s) => {
        const items = components.filter((c) => c.section === s);
        const shown = items.filter(matches);
        return (
          <section key={s} aria-labelledby={`section-${s}`} className={cn("grid gap-4", !shown.length && "hidden")}>
            <h2 id={`section-${s}`} className="flex items-center gap-3 text-lg font-semibold tracking-tight">
              {s}
              <Badge size="sm" mono>
                {items.length}
              </Badge>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {items.map((c) => (
                <ComponentCard key={c.slug} doc={c} hidden={!matches(c)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ComponentCard({ doc, hidden }: { doc: ComponentDoc; hidden: boolean }) {
  const Example = examples[doc.examples[0]?.name ?? ""];
  return (
    <article className={cn("group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-raised", hidden && "hidden")}>
      <div className="relative flex h-64 items-center justify-center overflow-hidden border-b border-border bg-muted/40">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative flex w-full origin-center scale-[0.82] justify-center px-4">{Example && <Example />}</div>
      </div>
      <div className="flex items-start gap-3 p-5">
        <div className="grid flex-1 gap-1">
          <h3 className="flex items-center gap-2 font-semibold tracking-tight">
            <Link to="/components/$slug" params={{ slug: doc.slug }} className="outline-none after:absolute after:inset-x-0 after:bottom-0 after:h-[calc(100%-16rem)] focus-visible:underline">
              {doc.name}
            </Link>
            {doc.motion && <span className="size-1.5 rounded-full bg-signal ring-2 ring-signal/30" title="Animated" aria-label="Animated" />}
          </h3>
          <p className="text-sm text-muted-foreground">{doc.description}</p>
        </div>
        <ArrowUpRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-[translate,color] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>
    </article>
  );
}

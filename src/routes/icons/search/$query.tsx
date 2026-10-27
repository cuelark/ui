import { Link, createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/content/site";
import { POPULAR_SEARCHES, relatedTerms, termFromSlug, titleCase } from "@/lib/icon-seo";
import { kebab } from "@/lib/icon-slugs";
import { svgMarkup } from "@/lib/icons";
import { searchIcons } from "@/lib/icons-server";
import { ld, seo } from "@/lib/seo";

export const Route = createFileRoute("/icons/search/$query")({
  validateSearch: (s: Record<string, unknown>): { page?: number; set?: string } => ({
    ...(Number(s.page) > 1 ? { page: Number(s.page) } : {}),
    ...(typeof s.set === "string" && s.set ? { set: s.set } : {}),
  }),
  loaderDeps: ({ search }) => ({ page: search.page ?? 1, set: search.set }),
  loader: async ({ params, deps }) => {
    const q = termFromSlug(params.query);
    return { q, ...(await searchIcons({ data: { q, page: deps.page, set: deps.set } })) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const { q, total, page } = loaderData;
    const T = titleCase(q);
    const path = `/icons/search/${kebab(q) || params.query}`;
    return seo({
      title: `${T} Icons: ${total.toLocaleString()} Free SVG & React Icons${page > 1 ? ` (Page ${page})` : ""}`,
      description: `Find ${total.toLocaleString()} free ${q} icons${relatedTerms(q, 3).length ? ` (also ${relatedTerms(q, 3).join(", ")} icons)` : ""} from Lucide, Heroicons, Font Awesome, Material Design, Phosphor, Tabler and more. Download SVGs or copy static and animated React components, installable with the shadcn CLI.`,
      // Filtered (?set=) and paged variants all canonicalize to the main results page.
      path,
      noindex: total === 0,
      keywords: [...relatedTerms(q, 6).map((t) => `${t} icon`), `${q} icon`, `${q} icons`, `${q} icon svg`, `${q} icon react`, `free ${q} icons`, `${q} icon png svg`, `animated ${q} icon`, `${q} icon tailwind`, `${q} icon shadcn`, `${q} vector icon`],
      jsonLd: [
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Icons", path: "/icons" },
          { name: `${T} icons`, path },
        ]),
        ld.collection(
          `${T} icons`,
          `${total} ${q} icons`,
          path,
          loaderData.results.slice(0, 30).map((r) => ({ name: `${r.slug.replace(/-/g, " ")} (${r.setName})`, path: `/icons/${r.setSlug}/${r.slug}` })),
        ),
      ],
    });
  },
  component: SearchPage,
});

function SearchPage() {
  const { q, total, page, pages, set, bySet, results } = Route.useLoaderData();
  const { query } = Route.useParams();
  const T = titleCase(q);
  const synonyms = relatedTerms(q, 10);
  const related = [...new Set([...synonyms.map(kebab), ...POPULAR_SEARCHES.filter((t) => t !== kebab(q) && (t.includes(q.split(" ")[0]!) || q.includes(t.split("-")[0]!)))])].filter((t) => t !== kebab(q)).slice(0, 14);
  const popular = POPULAR_SEARCHES.filter((t) => !related.includes(t) && t !== kebab(q)).slice(0, 24);
  return (
    <main id="main" className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/icons" className="hover:text-foreground">
          Icons
        </Link>
        <span>/</span>
        <span className="text-foreground">Search</span>
      </nav>
      <header className="grid gap-3">
        <span className="cue-label">{total.toLocaleString()} results across {bySet.length} sets</span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{T} icons</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {total ? `${total.toLocaleString()} free ${q} icons` : `No ${q} icons yet`} from every major icon set. Open any icon to download the SVG or copy it as a static or animated React component.
        </p>
        {synonyms.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Includes icons named <span className="text-foreground">{synonyms.slice(0, 6).join(", ")}</span>.
          </p>
        )}
        <form action="/icons/search" method="get" className="flex max-w-xl gap-2" onSubmit={(e) => {
          e.preventDefault();
          const v = new FormData(e.currentTarget).get("q")?.toString() ?? "";
          if (v.trim()) window.location.href = `/icons/search/${kebab(v)}`;
        }}>
          <input name="q" defaultValue={q} aria-label="Search icons" className="h-11 flex-1 rounded-xl border border-input bg-card px-4 text-sm shadow-well outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20" />
          <button type="submit" className="h-11 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground">
            Search
          </button>
        </form>
      </header>

      {bySet.length > 1 && (
        <nav aria-label="Filter by icon set" className="flex flex-wrap gap-1.5">
          <Link to="/icons/search/$query" params={{ query }} search={{}} className={chip(!set)}>
            All <span className="font-mono text-[0.625rem] opacity-70">{bySet.reduce((n, s) => n + s.count, 0)}</span>
          </Link>
          {bySet.map((s) => (
            <Link key={s.slug} to="/icons/search/$query" params={{ query }} search={{ set: s.slug }} className={chip(set === s.slug)}>
              {s.name} <span className="font-mono text-[0.625rem] opacity-70">{s.count}</span>
            </Link>
          ))}
        </nav>
      )}

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">
        {results.map((r) => (
          <li key={`${r.setSlug}/${r.slug}`}>
            <Link
              to="/icons/$set/$icon"
              params={{ set: r.setSlug, icon: r.slug }}
              className="grid justify-items-center gap-1.5 rounded-xl border border-transparent p-3 text-center outline-none transition-colors hover:border-border hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="text-2xl" dangerouslySetInnerHTML={{ __html: svgMarkup(r.data) }} />
              <span className="w-full truncate text-[0.6875rem]">{r.slug.replace(/-/g, " ")}</span>
              <span className="w-full truncate text-[0.625rem] text-muted-foreground">{r.setName}</span>
            </Link>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav aria-label="Pages" className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              to="/icons/search/$query"
              params={{ query }}
              search={{ ...(p > 1 ? { page: p } : {}), ...(set ? { set } : {}) }}
              aria-current={p === page ? "page" : undefined}
              className="grid h-8 min-w-8 place-items-center rounded-lg px-2 font-mono text-xs text-muted-foreground hover:bg-muted aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
            >
              {p}
            </Link>
          ))}
        </nav>
      )}

      {related.length > 0 && <Terms title="Related searches" terms={related} />}
      <Terms title="Popular icon searches" terms={popular} />
    </main>
  );
}

const chip = (active: boolean) =>
  `inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors ${active ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-muted"}`;

function Terms({ title, terms }: { title: string; terms: string[] }) {
  return (
    <section aria-label={title} className="grid gap-3 border-t border-border pt-6">
      <h2 className="cue-label">{title}</h2>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {terms.map((t) => (
          <li key={t}>
            <Link to="/icons/search/$query" params={{ query: t }} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              {titleCase(t.replace(/-/g, " "))} icons
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

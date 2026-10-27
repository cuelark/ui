import { Link, createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { IconLicense, licenseLabel } from "@/components/site/icon-license";
import { SITE } from "@/content/site";
import { iconWords, svgMarkup } from "@/lib/icons";
import { getIconSetPage } from "@/lib/icons-server";
import { ld, seo } from "@/lib/seo";

export const Route = createFileRoute("/icons/$set/")({
  validateSearch: (s: Record<string, unknown>): { page?: number } => (Number(s.page) > 1 ? { page: Number(s.page) } : {}),
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ params, deps }) => {
    const data = await getIconSetPage({ data: { set: params.set, page: deps.page } });
    if (!data) throw notFound();
    // Old react-icons ids (/icons/lu) move permanently to readable slugs (/icons/lucide).
    if (data.setSlug !== params.set) throw redirect({ to: "/icons/$set", params: { set: data.setSlug }, search: deps.page > 1 ? { page: deps.page } : {}, statusCode: 301 });
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { meta, page, setSlug } = loaderData;
    const n = meta.name;
    const title = `${n} Icons: ${meta.count.toLocaleString()} Free SVG & React Icons${page > 1 ? ` (Page ${page})` : ""}`;
    const description = `Browse all ${meta.count.toLocaleString()} ${n} icons, free under the ${licenseLabel(meta.license)}. Download SVGs, copy static or animated React components (react-icons/${meta.id}), or install any icon with the shadcn CLI.`;
    return seo({
      title,
      description,
      path: `/icons/${setSlug}${page > 1 ? `?page=${page}` : ""}`,
      keywords: [`${n} icons`, `${n} icons react`, `${n} svg icons`, `free ${n} icons`, `${n} icon pack`, `${n} icons download`, `animated ${n} icons`, `react-icons ${meta.id}`, `${n} icons tailwind`, `${n} icons shadcn`],
      jsonLd: [
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Icons", path: "/icons" },
          { name: n, path: `/icons/${setSlug}` },
        ]),
        {
          "@type": "CollectionPage",
          name: `${n} icons`,
          url: `${SITE.url}/icons/${setSlug}`,
          description,
          license: meta.licenseUrl,
          isBasedOn: meta.projectUrl,
          numberOfItems: meta.count,
          mainEntity: { "@type": "CreativeWork", name: n, url: meta.projectUrl, license: meta.licenseUrl },
        },
      ],
    });
  },
  component: SetPage,
});

function SetPage() {
  const { meta, setSlug, page, pages, icons } = Route.useLoaderData();
  return (
    <main id="main" className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/icons" className="hover:text-foreground">
          Icons
        </Link>
        <span>/</span>
        <span className="text-foreground">{meta.name}</span>
      </nav>
      <header className="grid gap-3">
        <span className="cue-label">
          {meta.count.toLocaleString()} icons · react-icons/{meta.id}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{meta.name} icons</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          All {meta.count.toLocaleString()} {meta.name} icons for React. Open any icon to download the SVG, copy it as a static or animated component, or install it with the shadcn CLI.
        </p>
        <IconLicense set={meta} className="w-fit" />
      </header>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">
        {icons.map((i) => (
          <li key={i.name}>
            <Link
              to="/icons/$set/$icon"
              params={{ set: setSlug, icon: i.slug }}
              className="grid justify-items-center gap-2 rounded-xl border border-transparent p-3 text-center outline-none transition-colors hover:border-border hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="text-2xl" dangerouslySetInnerHTML={{ __html: svgMarkup(i.data) }} />
              <span className="w-full truncate text-[0.6875rem] text-muted-foreground" title={i.name}>
                {iconWords(i.name, meta.id) || i.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <nav aria-label="Pages" className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              to="/icons/$set"
              params={{ set: setSlug }}
              search={p > 1 ? { page: p } : {}}
              aria-current={p === page ? "page" : undefined}
              className="grid h-8 min-w-8 place-items-center rounded-lg px-2 font-mono text-xs text-muted-foreground hover:bg-muted aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </main>
  );
}

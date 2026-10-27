import { Link, createFileRoute } from "@tanstack/react-router";

import { IconExplorer } from "@/components/site/icon-explorer";
import { IconLicense } from "@/components/site/icon-license";
import { POPULAR_SEARCHES, titleCase } from "@/lib/icon-seo";
import { getIconSets } from "@/lib/icons-server";
import { SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";

const TITLE = "50,000+ free React icons: searchable, animated, shadcn installable";
const DESCRIPTION =
  "Search every react-icons set (Lucide, Font Awesome, Material Design, Heroicons, Phosphor, Tabler, Remix, Bootstrap and more) in one place. Animate any icon with GSAP, copy JSX or SVG, or install it as a component with the shadcn CLI.";

export const Route = createFileRoute("/icons/")({
  loader: () => getIconSets(),
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: "/icons",
      keywords: ["react icons", "free svg icons", "animated icons react", "shadcn icons", "lucide icons", "font awesome react", "heroicons", "material icons react", "icon search", "icon library"],
      jsonLd: [
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Icons", path: "/icons" },
        ]),
      ],
    }),
  component: IconsPage,
});

function IconsPage() {
  const sets = Route.useLoaderData();
  return (
    <main id="main" className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6">
      <header className="grid gap-3">
        <span className="cue-label">Icons · 31 sets</span>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Every icon, searchable and alive</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Over 50,000 icons from every react-icons set in one search. Pick an animation and hover to preview it, then copy the import, the SVG, or install the icon as its own component
          with the shadcn CLI.
        </p>
      </header>
      <IconExplorer />
      <section aria-labelledby="popular-title" className="grid gap-4 border-t border-border pt-10">
        <h2 id="popular-title" className="text-2xl font-semibold tracking-tight">
          Popular icon searches
        </h2>
        <ul className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((t) => (
            <li key={t}>
              <Link to="/icons/search/$query" params={{ query: t }} className="inline-flex h-8 items-center rounded-full border border-border bg-card px-3 text-sm transition-colors hover:bg-muted">
                {titleCase(t.replace(/-/g, " "))} icons
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="sets-title" className="grid gap-5 border-t border-border pt-10">
        <div className="grid gap-2">
          <h2 id="sets-title" className="text-2xl font-semibold tracking-tight">
            All {sets.length} icon sets
          </h2>
          <p className="max-w-2xl text-muted-foreground">Each set keeps its original license. Follow it when you ship: most are MIT or ISC; Creative Commons sets ask for attribution.</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((s) => (
            <li key={s.id} className="grid gap-3 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-raised">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold tracking-tight">
                  <Link to="/icons/$set" params={{ set: s.slug }} className="hover:underline">
                    {s.name}
                  </Link>
                </h3>
                <span className="font-mono text-xs text-muted-foreground">{s.count.toLocaleString()} icons</span>
              </div>
              <code className="font-mono text-xs text-muted-foreground">react-icons/{s.id}</code>
              <IconLicense set={s} compact />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

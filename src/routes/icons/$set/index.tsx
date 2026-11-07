import { Link, createFileRoute, redirect } from "@tanstack/react-router";

import { IconExplorer } from "@/components/site/icon-explorer";
import { IconLicense } from "@/components/site/icon-license";
import { SITE } from "@/content/site";
import { licenseLabel, setPageCopy } from "@/lib/icon-set-seo";
import { getIconSet } from "@/lib/icons-server";
import { ld, seo } from "@/lib/seo";

export const Route = createFileRoute("/icons/$set/")({
  loader: async ({ params }) => {
    const data = await getIconSet({ data: { set: params.set } });
    // Unknown icon URLs belong on the hub. Old react-icons ids (/icons/lu) move to readable slugs (/icons/lucide).
    if (!data) throw redirect({ to: "/icons", statusCode: 301 });
    if (data.setSlug !== params.set) throw redirect({ to: "/icons/$set", params: { set: data.setSlug }, statusCode: 301 });
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { meta, setSlug } = loaderData;
    const license = licenseLabel(meta.license);
    const { label, title, description } = setPageCopy(meta, license);
    const path = `/icons/${setSlug}`;
    return seo({
      title,
      description,
      path,
      keywords: [`${label} icons`, `${meta.name} icons`, `${meta.name} svg`, `${meta.name} react`, `free ${meta.name} icons`, `react-icons ${meta.id}`],
      jsonLd: [
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Icons", path: "/icons" },
          { name: meta.name, path },
        ]),
        {
          "@type": "CollectionPage",
          name: `${meta.name} icons`,
          url: `${SITE.url}${path}`,
          description,
          license: meta.licenseUrl,
          isBasedOn: meta.projectUrl,
          numberOfItems: meta.count,
          isPartOf: { "@id": `${SITE.url}/#website` },
        },
      ],
    });
  },
  component: SetPage,
});

function SetPage() {
  const { meta } = Route.useLoaderData();
  const license = licenseLabel(meta.license);
  const { label, intro } = setPageCopy(meta, license);
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
          {meta.count.toLocaleString("en-US")} icons · react-icons/{meta.id} · {license}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{label} icons</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{intro}</p>
        <IconLicense set={meta} className="w-fit" />
      </header>
      <IconExplorer lockedSet={meta.id} />
    </main>
  );
}

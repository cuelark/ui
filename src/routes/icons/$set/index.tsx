import { Link, createFileRoute, redirect } from "@tanstack/react-router";

import { IconExplorer } from "@/components/site/icon-explorer";
import { IconLicense } from "@/components/site/icon-license";
import { IconSample } from "@/components/site/icon-sample";
import { SITE } from "@/content/site";
import { licenseLabel, setAttribution, setExtra, setGuide, setImportExample, setPageCopy } from "@/lib/icon-set-seo";
import { getIconSet } from "@/lib/icons-server";
import { ld, seo } from "@/lib/seo";
import { CopyButton } from "@/registry/cuelark/ui/copy-button";

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
    const { noun, title, description } = setPageCopy(meta, license);
    const path = `/icons/${setSlug}`;
    const extra = setExtra(meta.id);
    return seo({
      title,
      description,
      path,
      keywords: [noun.toLowerCase(), `${meta.name} icons`, `${meta.name} svg`, `${meta.name} react`, `free ${meta.name} icons`, `react-icons ${meta.id}`],
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
        ...(extra
          ? [
              {
                "@type": "FAQPage",
                mainEntity: extra.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
              },
            ]
          : []),
      ],
    });
  },
  component: SetPage,
});

function SetPage() {
  const { meta, sample, featured } = Route.useLoaderData();
  const extra = setExtra(meta.id);
  const license = licenseLabel(meta.license);
  const { noun } = setPageCopy(meta, license);
  const guide = setGuide(meta.id);
  const exampleIcon = sample[0];
  const example = exampleIcon ? setImportExample(meta.id, exampleIcon.name) : null;
  const credit = setAttribution(meta);
  const count = meta.count.toLocaleString("en-US");
  const sampleLead = sample.length === meta.count ? `All ${count} icons are drawn in the page HTML.` : `${sample.length} of ${count} icons are drawn in the page HTML.`;
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
          {count} icons · react-icons/{meta.id} · {meta.license}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{noun}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{guide}</p>
        <IconLicense set={meta} verbatim className="max-w-2xl" />
        <p className="max-w-2xl text-sm text-muted-foreground">{credit}</p>
      </header>
      {example && (
        <section aria-labelledby="install-title" className="grid max-w-2xl gap-3">
          <h2 id="install-title" className="text-xl font-semibold tracking-tight">
            Install and import
          </h2>
          <p className="text-sm text-muted-foreground">
            Install react-icons, then import <code className="font-mono text-foreground">{exampleIcon?.name}</code> from <code className="font-mono text-foreground">react-icons/{meta.id}</code>.
          </p>
          <CodeSample label="Install command" code={example.install} />
          <CodeSample label="Import example" code={example.code} />
        </section>
      )}
      <section aria-labelledby="sample-title" className="grid gap-4">
        <div className="grid gap-2">
          <h2 id="sample-title" className="text-2xl font-semibold tracking-tight">
            Icons in this set
          </h2>
          <p className="max-w-2xl text-muted-foreground">{sampleLead} Search below to filter the full set and copy SVG or JSX.</p>
        </div>
        <IconSample setId={meta.id} icons={sample} />
      </section>
      {extra && featured.length > 0 && (
        <section aria-labelledby="featured-title" className="grid gap-4">
          <div className="grid gap-2">
            <h2 id="featured-title" className="text-2xl font-semibold tracking-tight">
              {extra.featured.title}
            </h2>
            <p className="max-w-2xl text-muted-foreground">{extra.featured.lead}</p>
          </div>
          <IconSample setId={meta.id} icons={featured} />
        </section>
      )}
      {extra && (
        <section aria-labelledby="classmap-title" className="grid max-w-2xl gap-3">
          <h2 id="classmap-title" className="text-2xl font-semibold tracking-tight">
            {extra.classMap.heading}
          </h2>
          <p className="text-muted-foreground">{extra.classMap.lead}</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-start text-muted-foreground">
                <th scope="col" className="py-2 pe-4 text-start font-medium">
                  HTML class
                </th>
                <th scope="col" className="py-2 text-start font-medium">
                  react-icons/{meta.id}
                </th>
              </tr>
            </thead>
            <tbody>
              {extra.classMap.rows.map(([cls, comp]) => (
                <tr key={cls} className="border-b border-border">
                  <td className="py-2 pe-4 font-mono">{cls}</td>
                  <td className="py-2 font-mono">{comp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <IconExplorer lockedSet={meta.id} />
      {extra && (
        <section aria-labelledby="faq-title" className="grid max-w-2xl gap-4">
          <h2 id="faq-title" className="text-2xl font-semibold tracking-tight">
            {noun} questions
          </h2>
          <dl className="grid gap-4">
            {extra.faq.map((f) => (
              <div key={f.q} className="grid gap-1">
                <dt className="font-medium">{f.q}</dt>
                <dd className="text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </main>
  );
}

function CodeSample({ label, code }: { label: string; code: string }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="cue-label">{label}</h3>
        <CopyButton value={code} label="Copy" variant="outline" size="sm" />
      </div>
      <pre className="overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-[0.8125rem] leading-relaxed">{code}</pre>
    </div>
  );
}

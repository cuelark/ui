import * as React from "react";
import { Link, createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { attribution, IconLicense, licenseLabel } from "@/components/site/icon-license";
import { SITE } from "@/content/site";
import { iconKeywords, iconSeoDescription, iconSeoTitle } from "@/lib/icon-seo";
import { kebab } from "@/lib/icon-slugs";
import { CodeBlock } from "@/components/site/code-block";
import { getCode } from "@/lib/code";
import { animatedIconComponentSource, formatMarkup, iconComponentSource, iconTitle, iconWords, svgMarkup } from "@/lib/icons";
import { getIconPage } from "@/lib/icons-server";
import { ld, seo } from "@/lib/seo";
import { AnimatedIcon, ANIMATIONS, animationFor } from "@/registry/cuelark/ui/animated-icon";
import { CopyButton } from "@/registry/cuelark/ui/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";

export const Route = createFileRoute("/icons/$set/$icon")({
  loader: async ({ params }) => {
    const data = await getIconPage({ data: { set: params.set, icon: params.icon } });
    if (!data) throw notFound();
    // Canonical, readable URL: /icons/lucide/arrow-right (old /icons/lu/LuArrowRight links redirect permanently).
    if (data.setSlug !== params.set || data.slug !== params.icon) throw redirect({ to: "/icons/$set/$icon", params: { set: data.setSlug, icon: data.slug }, statusCode: 301 });
    // Highlight every snippet on the server so the formatted code is in the HTML (crawlable, no client highlighter).
    const snippets = buildSnippets(data, animationFor(data.name));
    const html = await getCode({ data: snippets.map((x) => ({ code: x.code, lang: x.lang })) });
    return { ...data, snippets: snippets.map((x, i) => ({ ...x, html: html[i]!.html })) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { meta, name, setSlug, slug, words } = loaderData;
    const t = iconTitle(name, meta.id);
    const path = `/icons/${setSlug}/${slug}`;
    return seo({
      title: iconSeoTitle(t, meta.name),
      description: iconSeoDescription(t, meta.name, licenseLabel(meta.license), words),
      path,
      keywords: [...iconKeywords(words, meta.name), name],
      jsonLd: [
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Icons", path: "/icons" },
          { name: meta.name, path: `/icons/${setSlug}` },
          { name: t, path },
        ]),
        {
          "@type": "ImageObject",
          name: `${t} icon`,
          description: `${t} icon from ${meta.name} (${name})`,
          contentUrl: `${SITE.url}/r/icons/${setSlug}/${slug}.svg`,
          encodingFormat: "image/svg+xml",
          license: meta.licenseUrl,
          acquireLicensePage: `${SITE.url}${path}`,
          creditText: meta.name,
          copyrightNotice: `${meta.name}, ${licenseLabel(meta.license)}`,
          isBasedOn: meta.projectUrl,
          keywords: iconKeywords(words, meta.name).slice(0, 8).join(", "),
        },
        {
          "@type": "SoftwareSourceCode",
          name: `${t} icon component`,
          programmingLanguage: ["TypeScript", "React"],
          codeRepository: SITE.github,
          license: meta.licenseUrl,
          url: `${SITE.url}${path}`,
        },
      ],
    });
  },
  component: IconPage,
});

type PageData = Awaited<ReturnType<typeof getIconPage>> & {};
type Snip = { id: string; group: "static" | "animated" | "other"; label: string; code: string; lang: "tsx" | "bash"; html?: string };

/** Every copyable form of the icon. */
function buildSnippets(d: PageData, animation: string): Snip[] {
  const base = `${SITE.url}/r/icons/${d.setSlug}/${d.slug}`;
  const t = iconTitle(d.name, d.meta.id);
  return [
    { id: "install", group: "static", label: "Install with shadcn", code: `npx shadcn@latest add ${base}.json`, lang: "bash" },
    { id: "component", group: "static", label: `components/icons/${d.setSlug}-${d.slug}.tsx`, code: iconComponentSource(d.name, d.meta, d.icon), lang: "tsx" },
    { id: "react-icons", group: "static", label: "With react-icons", code: `import { ${d.name} } from "react-icons/${d.meta.id}";\n\nexport function Example() {\n  return <${d.name} className="size-5" />;\n}`, lang: "tsx" },
    { id: "svg", group: "static", label: `${d.slug}.svg`, code: formatMarkup(svgMarkup(d.icon)), lang: "tsx" },
    { id: "install-animated", group: "animated", label: "Install with shadcn", code: `npx shadcn@latest add ${base}-animated.json`, lang: "bash" },
    { id: "animated", group: "animated", label: `components/icons/${d.setSlug}-${d.slug}-animated.tsx`, code: animatedIconComponentSource(d.name, d.meta, d.icon, animation), lang: "tsx" },
    {
      id: "gsap",
      group: "animated",
      label: "With Cuelark AnimatedIcon (GSAP)",
      code: `import { AnimatedIcon } from "@/components/ui/animated-icon";\nimport { ${d.name} } from "react-icons/${d.meta.id}";\n\nexport function Example() {\n  return (\n    <AnimatedIcon animation="${animation}">\n      <${d.name} />\n    </AnimatedIcon>\n  );\n}`,
      lang: "tsx",
    },
    { id: "attribution", group: "other", label: "Attribution", code: attribution(t, d.meta), lang: "bash" },
  ];
}

function IconPage() {
  const data = Route.useLoaderData();
  const { meta, name, setSlug, slug, words, icon, related, alsoIn, alike, aka } = data;
  const t = iconTitle(name, meta.id);
  const auto = animationFor(name);
  const [animation, setAnimation] = React.useState<string>(auto);
  // Still by default; plays on hover, on "Play", or when another animation is picked.
  const [play, setPlay] = React.useState(0);
  // Re-highlight the animated snippets when another motion is picked (server-side Shiki, one small request).
  const [snippets, setSnippets] = React.useState<Snip[]>(data.snippets);
  React.useEffect(() => {
    const next = buildSnippets(data, animation);
    if (animation === auto) return setSnippets(data.snippets);
    let live = true;
    void getCode({ data: next.map((x) => ({ code: x.code, lang: x.lang })) }).then((html) => live && setSnippets(next.map((x, i) => ({ ...x, html: html[i]!.html }))));
    return () => {
      live = false;
    };
  }, [animation, auto, data]);
  const group = (g: Snip["group"]) => snippets.filter((x) => x.group === g);
  return (
    <main id="main" className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/icons" className="hover:text-foreground">
          Icons
        </Link>
        <span>/</span>
        <Link to="/icons/$set" params={{ set: setSlug }} className="hover:text-foreground">
          {meta.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{t}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid content-start gap-4">
          <div className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl border border-border bg-card text-[7rem]">
            <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
            <button type="button" onClick={() => setPlay((p) => p + 1)} className="absolute end-3 bottom-3 inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background/90 px-3 text-xs font-medium shadow-control backdrop-blur hover:bg-muted">
              ▶ Play {animation}
            </button>
            <AnimatedIcon key={`${animation}-${play}`} animation={animation as never} name={name} trigger={play ? "mount" : "hover"} className="relative cursor-pointer">
              <span role="img" aria-label={`${t} icon`} className="contents" dangerouslySetInnerHTML={{ __html: svgMarkup(icon) }} />
            </AnimatedIcon>
          </div>
          <p className="text-xs text-muted-foreground">
            Hover the icon or press Play. Suggested motion: <span className="font-medium text-foreground">{auto}</span>. Pick another to preview it and update the animated code:
          </p>
          <ul className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Animation">
            {ANIMATIONS.filter((a) => a !== "auto").map((a) => (
              <li key={a}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={animation === a}
                  onClick={() => {
                    setAnimation(a);
                    setPlay((p) => p + 1);
                  }}
                  className="grid w-full justify-items-center gap-1 rounded-xl border border-border bg-card p-2 text-2xl outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-checked:border-primary aria-checked:bg-primary/10"
                >
                  <AnimatedIcon animation={a} name={name}>
                    <span className="contents" dangerouslySetInnerHTML={{ __html: svgMarkup(icon) }} />
                  </AnimatedIcon>
                  <span className="text-[0.625rem] text-muted-foreground capitalize">{a}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-5">
          <header className="grid gap-2">
            <span className="cue-label">
              {meta.name} · {name}
            </span>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t} icon</h1>
            <p className="text-muted-foreground">
              A free {words || t.toLowerCase()} icon from{" "}
              <Link to="/icons/$set" params={{ set: setSlug }} className="font-medium text-foreground underline decoration-border underline-offset-4">
                {meta.name}
              </Link>
              , ready for React. Use it static or animated: both versions are below, copy-paste or one shadcn command away. Sized in em and colored by currentColor.
            </p>
          </header>
          {aka.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-sm">
              <span className="me-1 text-muted-foreground">Also known as</span>
              {aka.map((t) => (
                <Link key={t} to="/icons/search/$query" params={{ query: kebab(t) }} className="inline-flex h-7 items-center rounded-full border border-border bg-card px-2.5 text-xs transition-colors hover:bg-muted">
                  {t} icon
                </Link>
              ))}
            </div>
          )}
          <IconLicense set={meta} />
          <div className="flex flex-wrap gap-2">
            <a href={`/r/icons/${setSlug}/${slug}.svg`} download={`${slug}.svg`} className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-control hover:brightness-110">
              Download SVG
            </a>
            <CopyButton value={svgMarkup(icon)} aria-label="Copy SVG" className="h-9 rounded-full border border-border px-3" />
          </div>
          <Tabs defaultValue="static">
            <TabsList>
              <TabsTrigger value="static">Static</TabsTrigger>
              <TabsTrigger value="animated">Animated</TabsTrigger>
            </TabsList>
            <TabsContent value="static" className="grid gap-3 pt-3">
              {group("static").map((x) => (
                <CodeBlock key={x.id} title={x.label} code={x.code} html={x.html} collapsible />
              ))}
            </TabsContent>
            <TabsContent value="animated" className="grid gap-3 pt-3">
              {group("animated").map((x) => (
                <CodeBlock key={x.id} title={x.label} code={x.code} html={x.html} collapsible />
              ))}
            </TabsContent>
          </Tabs>
          {group("other").map((x) => (
            <CodeBlock key={x.id} title={x.label} code={x.code} className="[&_pre]:whitespace-pre-wrap" />
          ))}
        </div>
      </div>
      {alike.length > 0 && (
        <section aria-labelledby="alike" className="grid gap-4">
          <h2 id="alike" className="font-semibold tracking-tight">
            Related icons: {aka.slice(0, 4).join(", ")}
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
            {alike.map((r) => (
              <li key={r.name}>
                <Link to="/icons/$set/$icon" params={{ set: setSlug, icon: r.slug }} className="grid justify-items-center gap-2 rounded-xl border border-transparent p-3 text-center hover:border-border hover:bg-card">
                  <span className="text-2xl" dangerouslySetInnerHTML={{ __html: svgMarkup(r.data) }} />
                  <span className="w-full truncate text-[0.6875rem] text-muted-foreground">{iconWords(r.name, meta.id) || r.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {alsoIn.length > 0 && (
        <section aria-labelledby="also-in" className="grid gap-4">
          <h2 id="also-in" className="font-semibold tracking-tight">
            {t} icon in other sets
          </h2>
          <ul className="flex flex-wrap gap-2">
            {alsoIn.map((a) => (
              <li key={a.setSlug}>
                <Link
                  to="/icons/$set/$icon"
                  params={{ set: a.setSlug, icon: a.slug }}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm shadow-control transition-colors hover:bg-muted"
                >
                  {t} <span className="text-muted-foreground">· {a.setName}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section aria-labelledby="related" className="grid gap-4">
        <h2 id="related" className="font-semibold tracking-tight">
          Similar {meta.name} icons
        </h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
          {related.map((r) => (
            <li key={r.name}>
              <Link to="/icons/$set/$icon" params={{ set: setSlug, icon: r.slug }} className="grid justify-items-center gap-2 rounded-xl border border-transparent p-3 text-center hover:border-border hover:bg-card">
                <span className="text-2xl" dangerouslySetInnerHTML={{ __html: svgMarkup(r.data) }} />
                <span className="w-full truncate text-[0.6875rem] text-muted-foreground">{iconWords(r.name, meta.id) || r.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}


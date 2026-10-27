import type { ReactNode } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { PiSparkleFill as SparklesIcon } from "react-icons/pi";

import { CodeBlock } from "@/components/site/code-block";
import { ComponentPreview } from "@/components/site/component-preview";
import { InstallTabs } from "@/components/site/install-tabs";
import { PropsTable } from "@/components/site/props-table";
import { componentBySlug, components } from "@/content/components";
import { SITE } from "@/content/site";
import { getComponentPage } from "@/lib/code";
import { ld, seo } from "@/lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/cuelark/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/registry/cuelark/ui/alert";
import { Badge } from "@/registry/cuelark/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/registry/cuelark/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";

export const Route = createFileRoute("/_docs/components/$slug")({
  loader: async ({ params }) => {
    const doc = componentBySlug.get(params.slug);
    if (!doc) throw notFound();
    return getComponentPage({ data: { slug: doc.slug, usage: `${doc.usage.imports}\n\n${doc.usage.code}`, examples: doc.examples.map((e) => e.name) } });
  },
  head: ({ params }) => {
    const doc = componentBySlug.get(params.slug);
    if (!doc) return {};
    const path = `/components/${doc.slug}`;
    const title = `${doc.name}: ${doc.description.replace(/\.$/, "")}`;
    const description = `${doc.intro.split(". ").slice(0, 2).join(". ").replace(/\.?$/, ".")} Install the ${doc.name} component with the shadcn CLI.`.slice(0, 300);
    return seo({
      title: `React ${doc.name} component for shadcn/ui`,
      description,
      path,
      type: "article",
      keywords: doc.keywords,
      jsonLd: [
        ld.sourceCode(`Cuelark UI ${doc.name}`, title, path, doc.keywords),
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Components", path: "/components" },
          { name: doc.name, path },
        ]),
        ...(doc.faq.length ? [ld.faq(doc.faq)] : []),
      ],
    });
  },
  component: ComponentPage,
});

const TOC = [
  { id: "preview", label: "Preview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "examples", label: "Examples" },
  { id: "motion", label: "Motion" },
  { id: "api", label: "API reference" },
  { id: "accessibility", label: "Accessibility" },
  { id: "faq", label: "FAQ" },
];

function ComponentPage() {
  const { slug } = Route.useParams();
  const data = Route.useLoaderData();
  const doc = componentBySlug.get(slug)!;
  const index = components.findIndex((c) => c.slug === slug);
  const prev = components[index - 1];
  const next = components[index + 1];
  const [first, ...rest] = doc.examples;
  const files = [doc.slug, ...data.deps.registry.filter((d) => d !== "utils" && d !== "theme")];
  const toc = TOC.filter((t) => (t.id === "motion" ? doc.motion : t.id === "examples" ? rest.length : true));

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/components">Components</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{doc.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="cue-label">{doc.section}</span>
            {doc.motion && (
              <Badge size="sm" variant="signal" mono>
                Animated
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{doc.name}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{doc.description}</p>
          <p className="max-w-2xl leading-7 text-muted-foreground">{doc.intro}</p>
        </header>

        {first && (
          <Section id="preview" title="Preview">
            <ComponentPreview name={first.name} code={data.examples[first.name]} />
          </Section>
        )}

        <Section id="installation" title="Installation">
          <Tabs defaultValue="cli" className="gap-4">
            <TabsList>
              <TabsTrigger value="cli">CLI</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
            </TabsList>
            <TabsContent value="cli" className="grid gap-3">
              <InstallTabs items={[doc.slug]} />
              <p className="text-sm text-muted-foreground">
                The CLI also installs the Cuelark theme tokens{data.deps.registry.includes("motion") ? ", the GSAP motion layer" : ""}
                {data.deps.registry.length > 3 ? " and the components it builds on" : ""}. With the <Link to="/docs/installation" hash="namespace" className="font-medium text-foreground underline decoration-border underline-offset-4">@cuelark namespace</Link> configured, use{" "}
                <code className="rounded-sm border border-border bg-muted px-1 font-mono text-xs">@cuelark/{doc.slug}</code>.
              </p>
            </TabsContent>
            <TabsContent value="manual" className="grid gap-4">
              <ol className="grid gap-4 text-sm text-muted-foreground">
                {data.deps.npm.length > 0 && (
                  <li className="grid gap-2">
                    <span>1. Install the dependencies:</span>
                    <CodeBlock code={`pnpm add ${data.deps.npm.join(" ")}`} />
                  </li>
                )}
                <li>
                  2. Add the <Link to="/docs/theming" className="font-medium text-foreground underline decoration-border underline-offset-4">theme tokens</Link>
                  {data.deps.registry.includes("motion") && " and lib/motion.ts"} if you have not already.
                </li>
                <li className="grid gap-2">
                  <span>
                    3. Copy the source into <code className="font-mono text-xs">components/ui/{doc.slug}.tsx</code>:
                  </span>
                  <CodeBlock code={data.source.code} html={data.source.html} title={`components/ui/${doc.slug}.tsx`} collapsible />
                </li>
              </ol>
            </TabsContent>
          </Tabs>
          {files.length > 1 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Builds on:{" "}
              {files.slice(1).map((f, i) => (
                <span key={f}>
                  {i > 0 && ", "}
                  {componentBySlug.has(f) ? (
                    <Link to="/components/$slug" params={{ slug: f }} className="font-mono text-foreground underline decoration-border underline-offset-4">
                      {f}
                    </Link>
                  ) : (
                    <span className="font-mono">{f}</span>
                  )}
                </span>
              ))}
            </p>
          )}
        </Section>

        <Section id="usage" title="Usage">
          <CodeBlock code={data.usage.code} html={data.usage.html} />
        </Section>

        {rest.length > 0 && (
          <Section id="examples" title="Examples">
            <div className="grid gap-12">
              {rest.map((e) => (
                <div key={e.name} className="grid gap-3">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{e.title}</h3>
                    <p className="text-sm text-muted-foreground">{e.description}</p>
                  </div>
                  <ComponentPreview name={e.name} code={data.examples[e.name]} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {doc.motion && (
          <Section id="motion" title="Motion">
            <Alert tone="info" icon={<SparklesIcon />}>
              <AlertTitle>How it moves</AlertTitle>
              <AlertDescription>
                <p>{doc.motion}</p>
                <p className="mt-2">
                  Scale it with <code className="font-mono text-xs">--cl-motion</code> (0 off, 1 default, 1.5 expressive) on any ancestor. Reduced-motion preferences always switch it off.
                </p>
              </AlertDescription>
            </Alert>
          </Section>
        )}

        <Section id="api" title="API reference">
          <PropsTable api={doc.api} />
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="grid list-disc gap-2 ps-5 text-sm leading-6 text-muted-foreground marker:text-border">
            {doc.accessibility.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Section>

        <Section id="faq" title="FAQ">
          <Accordion type="multiple" variant="dashed" numbered>
            {doc.faq.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-6 text-xs text-muted-foreground">Also searched as: {doc.keywords.join(" · ")}</p>
        </Section>

        <nav aria-label="Pagination" className="cue-dash-t mt-16 grid grid-cols-2 gap-4 pt-6">
          {prev ? (
            <Link to="/components/$slug" params={{ slug: prev.slug }} className="group grid gap-1 rounded-lg p-3 transition-colors hover:bg-muted">
              <span className="cue-label inline-flex items-center gap-1">
                <ArrowLeftIcon className="size-3" /> Previous
              </span>
              <span className="font-medium">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to="/components/$slug" params={{ slug: next.slug }} className="group grid justify-items-end gap-1 rounded-lg p-3 text-right transition-colors hover:bg-muted">
              <span className="cue-label inline-flex items-center gap-1">
                Next <ArrowRightIcon className="size-3" />
              </span>
              <span className="font-medium">{next.name}</span>
            </Link>
          )}
        </nav>
      </article>

      <aside className="sticky top-24 hidden h-fit w-44 shrink-0 xl:block">
        <h2 className="cue-label mb-3">On this page</h2>
        <ul className="grid gap-2 text-sm">
          {toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="text-muted-foreground transition-colors hover:text-foreground">
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-14 scroll-mt-24">
      <h2 id={`${id}-title`} className="mb-5 text-xl font-semibold tracking-tight">
        <a href={`#${id}`} className="outline-none hover:underline hover:decoration-border hover:underline-offset-4 focus-visible:underline">
          {title}
        </a>
      </h2>
      {children}
    </section>
  );
}

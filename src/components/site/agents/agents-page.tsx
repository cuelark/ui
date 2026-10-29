import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon, MousePointerClickIcon } from "lucide-react";

import { LIFECYCLE, SCENARIOS, ZONES, type Scenario } from "@/content/agent-guide";
import { SHOTS, type Shot } from "@/content/agent-shots";
import { components } from "@/content/components";
import { registryUrl } from "@/content/site";
import { Badge } from "@/registry/cuelark/ui/badge";
import { CopyButton } from "@/registry/cuelark/ui/copy-button";
import { Switch } from "@/registry/cuelark/ui/switch";
import { cn } from "@/lib/utils";
import { InspectArea, InspectProvider, PartLegend, componentName, useInspect } from "./inspect";
import { CodingScenario } from "./scenarios/coding";
import { DataScenario } from "./scenarios/data";
import { ResearchScenario } from "./scenarios/research";

const DEMOS: Record<string, React.ComponentType> = {
  "coding-agent": CodingScenario,
  "research-agent": ResearchScenario,
  "data-analyst-agent": DataScenario,
};
const DOCS = new Map(components.map((c) => [c.slug, c]));
const agentCount = components.filter((c) => c.section === "Agents").length;
/** The first scenario lives at /agents itself; the others at /agents/<slug>. */
export const scenarioLink = (s: Scenario) => (s === SCENARIOS[0] ? ({ to: "/agents" } as const) : ({ to: "/agents/$scenario", params: { scenario: s.slug } } as const));
const usedIn = (slug: string) => SCENARIOS.filter((s) => s.components.includes(slug));

export const AGENTS_FAQ = [
  { q: "What is agentic UI?", a: "Agentic UI is the interface layer for AI agents that take actions, not just answer questions: showing reasoning, tool calls, plans that wait for approval, file changes, test runs and the sources behind an answer, so people can follow and steer the agent." },
  { q: "Where should tool calls go in a chat interface?", a: "Inside the assistant's turn, before the answer, as compact rows: tool name, status and duration, with the exact input and output one click away. Failed calls open themselves. Big outputs (documents, charts, diffs of many files) go to a side panel as artifacts." },
  { q: "When should an agent ask for approval?", a: "Before anything with side effects: sending, paying, deleting, deploying or writing to shared data. Show a plan before multi-step work and a confirmation with the exact command before a single risky action. Don't ask for harmless reads, or people learn to click through." },
  { q: "Is this an alternative to shadcn AI Elements?", a: "Yes. It covers the same building blocks (prompt input, message, conversation, reasoning, chain of thought, tool, sources, inline citation, plan, confirmation, task, queue, terminal, file tree, stack trace, test results, artifact, web preview, branch, checkpoint, model selector, context) in the Cuelark style, with GSAP motion and extra pieces like a trace waterfall, sub-agents and file diffs." },
  { q: "Does it work with the Vercel AI SDK?", a: "Yes. The components are presentational: map useChat messages, message parts, tool invocation states and reasoning onto their props. They also work with LangChain, the OpenAI or Anthropic SDKs, or any stream." },
  { q: "How do I install an agent component?", a: "Run npx shadcn@latest add https://ui.cuelark.com/r/<name>.json, for example prompt-input or reasoning. The source lands in your project, so you own and can change every line." },
];

/** /agents and /agents/<scenario>: the live demos full width, then where each piece goes, then every component. */
export function AgentsPage({ scenario }: { scenario: Scenario }) {
  const Demo = DEMOS[scenario.slug]!;
  return (
    <main id="main" className="mx-auto grid max-w-[100rem] gap-24 px-4 pt-8 pb-24 sm:px-6 lg:px-8">
      <div className="grid gap-10">
        <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <span className="cue-label">Agent UI kit · {agentCount} components</span>
              <Badge variant="signal" size="sm" mono>
                MIT
              </Badge>
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Interfaces for agents that think, act and ask.</h1>
            <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
              React components for AI agents, built for shadcn/ui and the Vercel AI SDK. Watch a real run below, hover any part to see what it is, and open it to copy the code.
            </p>
          </div>
          <InstallLine />
        </header>

        <section aria-labelledby="demo-title" className="grid gap-4">
          <InspectProvider>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <nav aria-label="Demo scenarios" className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1">
                {SCENARIOS.map((s) => (
                  <Link
                    key={s.slug}
                    {...scenarioLink(s)}
                    resetScroll={false}
                    aria-current={s.slug === scenario.slug ? "page" : undefined}
                    className="rounded-lg px-3 py-1.5 text-sm whitespace-nowrap text-muted-foreground outline-none transition-[color,background-color,box-shadow] duration-150 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:bg-background aria-[current=page]:text-foreground aria-[current=page]:shadow-raised"
                  >
                    {s.label}
                  </Link>
                ))}
              </nav>
              <InspectToggle />
            </div>
            <div className="grid gap-1">
              <h2 id="demo-title" className="text-lg font-semibold tracking-tight">
                {scenario.title}
              </h2>
              <p className="max-w-3xl text-sm text-pretty text-muted-foreground">{scenario.description}</p>
            </div>
            <InspectArea>
              <Demo key={scenario.slug} />
            </InspectArea>
            <PartLegend slugs={scenario.components} />
          </InspectProvider>
        </section>
      </div>

      <Anatomy />
      <ComponentIndex />
      <Faq />
    </main>
  );
}

function InstallLine() {
  const cmd = `npx shadcn@latest add ${registryUrl("prompt-input")}`;
  return (
    <div className="flex max-w-full items-center gap-1 rounded-xl border border-border bg-card py-1 ps-3 pe-1 font-mono text-xs shadow-raised">
      <span className="text-muted-foreground select-none">$</span>
      <span className="truncate">{cmd}</span>
      <CopyButton value={cmd} className="shrink-0" />
    </div>
  );
}

function InspectToggle() {
  const { on, setOn } = useInspect();
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
      <MousePointerClickIcon className="size-4" />
      Inspect parts
      <Switch size="sm" checked={on} onCheckedChange={setOn} aria-label="Inspect parts" />
    </label>
  );
}

function ShotImage({ shot, alt, className }: { shot: Shot; alt: string; className?: string }) {
  return <img src={shot.src} width={shot.width} height={shot.height} alt={alt} loading="lazy" decoding="async" className={cn("h-auto w-full", className)} />;
}

/** The map of an agent app: zones on a wireframe that light up with the list beside it. */
function Anatomy() {
  const [zone, setZone] = React.useState<string | null>(null);
  return (
    <section aria-labelledby="anatomy-title" className="grid gap-8">
      <div className="grid max-w-3xl gap-3">
        <span className="cue-label">Guide</span>
        <h2 id="anatomy-title" className="text-3xl font-semibold tracking-tight text-balance">
          Where each piece goes in an agent app
        </h2>
        <p className="text-pretty text-muted-foreground">
          Every agent interface has the same seven places. Put each component where people expect it and the run explains itself. Hover a zone to find it on the map.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
        <Wireframe zone={zone} onZone={setZone} className="lg:sticky lg:top-24" />
        <ol className="grid gap-4">
          {ZONES.map((z, i) => {
            const shot = SHOTS[`zone:${z.id}`];
            return (
              <li
                key={z.id}
                id={`zone-${z.id}`}
                onMouseEnter={() => setZone(z.id)}
                onMouseLeave={() => setZone(null)}
                data-lit={zone === z.id || undefined}
                className="grid scroll-mt-24 gap-4 rounded-2xl border border-border bg-card p-5 transition-[border-color,box-shadow] duration-150 data-lit:border-signal/40 data-lit:shadow-raised md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]"
              >
                <div className="grid content-start gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-lg font-semibold tracking-tight">{z.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{z.summary}</p>
                  <dl className="grid gap-2.5">
                    {z.items.map((it) => (
                      <div key={it.slug} className="grid gap-0.5 text-sm">
                        <dt>
                          <Link to="/components/$slug" params={{ slug: it.slug }} className="font-medium underline decoration-border underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
                            {componentName(it.slug)}
                          </Link>
                        </dt>
                        <dd className="text-muted-foreground">
                          {it.when}
                          {it.avoid && <span className="block text-xs">Avoid: {it.avoid}</span>}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {shot && (
                  <figure className="grid content-start gap-2">
                    <div className="overflow-hidden rounded-xl border border-border bg-background">
                      <ShotImage shot={shot} alt={`${z.name} of an agent app built with Cuelark UI: ${z.items.map((it) => componentName(it.slug)).join(", ")}`} />
                    </div>
                    <figcaption className="text-xs text-muted-foreground">From the live demo above.</figcaption>
                  </figure>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** A schematic agent app: run header, thread with its work, approvals and evidence, composer, side panel. */
function Wireframe({ zone, onZone, className }: { zone: string | null; onZone: (z: string | null) => void; className?: string }) {
  const box = (id: string, label: string, extra?: string) => (
    <a
      href={`#zone-${id}`}
      onMouseEnter={() => onZone(id)}
      onMouseLeave={() => onZone(null)}
      onFocus={() => onZone(id)}
      onBlur={() => onZone(null)}
      data-lit={zone === id || undefined}
      className={cn(
        "grid place-items-center rounded-lg border border-dashed border-border bg-muted/40 p-2 text-center text-[0.6875rem] font-medium text-muted-foreground outline-none transition-[background-color,border-color,color] duration-150 focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-lit:border-solid data-lit:border-signal/60 data-lit:bg-signal/10 data-lit:text-foreground",
        extra,
      )}
    >
      {label}
    </a>
  );
  return (
    <figure className={cn("grid gap-3", className)} aria-label="Map of an agent app">
      <div className="grid aspect-[4/3.4] grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-2 rounded-2xl border border-border bg-card p-3 shadow-raised">
        {box("observe", "Run header", "col-span-2 py-2")}
        <div className="grid grid-rows-[auto_minmax(0,1.4fr)_auto_auto_auto] gap-2">
          {box("thread", "Thread", "py-3")}
          {box("work", "Work in progress")}
          {box("approvals", "Approvals", "py-3")}
          {box("evidence", "Evidence", "py-3")}
          {box("composer", "Composer", "py-4")}
        </div>
        {box("panel", "Side panel")}
      </div>
      <figcaption className="text-xs text-muted-foreground">Hover a zone to see what goes there.</figcaption>
    </figure>
  );
}

/** Every agent component, grouped by the moment of a run it belongs to. */
function ComponentIndex() {
  return (
    <section aria-labelledby="index-title" className="grid gap-8">
      <div className="grid max-w-3xl gap-3">
        <span className="cue-label">All {agentCount} components</span>
        <h2 id="index-title" className="text-3xl font-semibold tracking-tight text-balance">
          Every agent component, by moment
        </h2>
        <p className="text-pretty text-muted-foreground">From the first prompt to the trace of the finished run. Each one installs on its own with the shadcn CLI.</p>
      </div>
      <div className="grid gap-10">
        {LIFECYCLE.map((group) => (
          <section key={group.id} aria-labelledby={`life-${group.id}`} className="grid gap-4">
            <div className="flex items-baseline gap-3">
              <h3 id={`life-${group.id}`} className="text-lg font-semibold tracking-tight">
                {group.name}
              </h3>
              <p className="text-sm text-muted-foreground">{group.summary}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {group.slugs.map((slug) => {
                const doc = DOCS.get(slug);
                if (!doc) return null;
                const shot = SHOTS[`component:${slug}`];
                const scenarios = usedIn(slug);
                return (
                  <li key={slug}>
                    <Link
                      to="/components/$slug"
                      params={{ slug }}
                      className="group grid h-full content-start overflow-hidden rounded-2xl border border-border bg-card outline-none transition-[border-color,box-shadow,translate] duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-raised focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-0 motion-reduce:hover:translate-y-0"
                    >
                      {shot && (
                        <div className="flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border bg-muted/30 p-3">
                          <ShotImage shot={shot} alt={`${doc.name}: ${doc.description}`} className="max-h-full w-auto max-w-full rounded-lg object-contain" />
                        </div>
                      )}
                      <div className="grid gap-1.5 p-4">
                        <span className="flex items-center justify-between gap-2 font-medium">
                          {doc.name}
                          <ArrowUpRightIcon className="size-4 text-muted-foreground transition-[translate,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                        </span>
                        <span className="text-sm text-muted-foreground">{doc.description}</span>
                        {scenarios.length > 0 && <span className="pt-1 text-xs text-muted-foreground">In the {scenarios.map((s) => s.label.toLowerCase()).join(", ")} demo</span>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq-title" className="grid gap-6">
      <h2 id="faq-title" className="text-3xl font-semibold tracking-tight">
        Agentic UI, answered
      </h2>
      <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
        {AGENTS_FAQ.map((f) => (
          <div key={f.q} className="grid content-start gap-2 bg-card p-5">
            <dt className="font-medium">{f.q}</dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";

import { AgentDemo } from "@/components/site/agent-demo";
import { examples } from "@/components/site/examples";
import { components } from "@/content/components";
import { SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";
import { Badge } from "@/registry/cuelark/ui/badge";

const agents = components.filter((c) => c.section === "Agents");

const FAQ = [
  { q: "What is agentic UI?", a: "Agentic UI is the interface layer for AI agents that take actions, not just answer questions: showing reasoning, tool calls, plans that wait for approval, file changes, test runs and the sources behind an answer, so people can follow and steer the agent." },
  { q: "Is this an alternative to shadcn AI Elements?", a: "Yes. It covers the same building blocks (prompt input, message, conversation, reasoning, chain of thought, tool, sources, inline citation, plan, confirmation, task, queue, terminal, file tree, stack trace, test results, artifact, web preview, branch, checkpoint, model selector, context) in the Cuelark style, with GSAP motion and extra pieces like a trace waterfall and file diff." },
  { q: "Does it work with the Vercel AI SDK?", a: "Yes. The components are presentational: map useChat messages, message parts, tool invocation states and reasoning onto their props. They also work with LangChain, the OpenAI or Anthropic SDKs, or any stream." },
  { q: "How do I install an agent component?", a: "Run npx shadcn@latest add https://ui.cuelark.com/r/<name>.json, for example prompt-input or reasoning. The source lands in your project, so you own and can change every line." },
  { q: "Are the agent components accessible?", a: "Yes. Streaming regions are polite live regions, every control is keyboard operable (Enter to send, Esc to stop, ⌘Enter to approve a plan), and all motion respects reduced-motion settings." },
];
const TITLE = "AI agent UI components for React and shadcn/ui";
const DESCRIPTION = `${agents.length} open-source components for AI chat and agents: prompt input, messages, reasoning, tool calls, plans with approval, file diffs, terminals, citations, sources and trace waterfalls. Built for the Vercel AI SDK and shadcn/ui.`;

export const Route = createFileRoute("/_docs/agents")({
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: "/agents",
      keywords: [
        "ai agent ui components",
        "agentic ui",
        "agentic ui components",
        "ai chat ui react",
        "ai elements alternative",
        "shadcn ai components",
        "vercel ai sdk ui components",
        "llm ui kit",
        "chatbot ui react",
        "tool calling ui",
        "human in the loop ui",
        "ai reasoning ui",
      ],
      jsonLd: [
        ld.collection(TITLE, DESCRIPTION, "/agents", agents.map((c) => ({ name: c.name, path: `/components/${c.slug}` }))),
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Agents", path: "/agents" },
        ]),
        ld.faq(FAQ),
      ],
    }),
  component: AgentsPage,
});

function AgentsPage() {
  return (
    <div className="grid gap-14">
      <header className="grid gap-4">
        <div className="flex items-center gap-2">
          <span className="cue-label">Agent UI kit · {agents.length} components</span>
          <Badge variant="signal" size="sm" mono>
            New
          </Badge>
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Interfaces for agents that think, act and ask.</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Everything you need to show an AI agent at work: the composer, the conversation, reasoning, tool calls, plans that wait for approval, diffs, terminals, citations and a live trace.
          Works with the Vercel AI SDK, or any stream.
        </p>
      </header>

      <section aria-labelledby="demo-title" className="grid gap-4">
        <h2 id="demo-title" className="text-lg font-semibold tracking-tight">
          A live agent run
        </h2>
        <AgentDemo />
      </section>

      <section aria-labelledby="all-title" className="grid gap-4">
        <h2 id="all-title" className="text-lg font-semibold tracking-tight">
          All agent components
        </h2>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {agents.map((c) => {
            const Example = examples[c.examples[0]?.name ?? ""];
            return (
              <article key={c.slug} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-raised">
                <div className="relative flex h-72 items-center justify-center overflow-hidden border-b border-border bg-muted/40 p-5">
                  <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                  <div className="relative flex w-full origin-center scale-[0.86] justify-center">{Example && <Example />}</div>
                </div>
                <div className="flex items-start gap-3 p-5">
                  <div className="grid flex-1 gap-1">
                    <h3 className="font-semibold tracking-tight">
                      <Link to="/components/$slug" params={{ slug: c.slug }} className="outline-none focus-visible:underline">
                        {c.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{c.description}</p>
                  </div>
                  <ArrowUpRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-[translate,color] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="faq-title" className="grid gap-4">
        <h2 id="faq-title" className="text-lg font-semibold tracking-tight">
          Agentic UI, answered
        </h2>
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {FAQ.map((f) => (
            <div key={f.q} className="grid gap-2 bg-card p-5">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

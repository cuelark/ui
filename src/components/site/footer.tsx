import { Link, useRouterState } from "@tanstack/react-router";

import { components, SECTIONS } from "@/content/components";
import type { Section } from "@/content/types";
import { DOC_PAGES, SITE } from "@/content/site";
import { Logo } from "./logo";

/** Footer groups: every component is one link away from every page (internal linking for crawlers and people). */
const GROUPS: { title: string; sections: Section[] }[] = [
  { title: "AI agent UI", sections: ["Agents"] },
  { title: "Forms & actions", sections: ["Forms", "Actions"] },
  { title: "Overlays & navigation", sections: ["Overlays", "Navigation"] },
  { title: "Display & layout", sections: ["Display", "Layout", "Feedback"] },
  { title: "Motion & effects", sections: ["Motion", "Effects"] },
];

/** Search topics, each linked to the page that best answers it. */
const TOPICS: { label: string; to: string }[] = [
  { label: "AI chat UI", to: "/components/conversation" },
  { label: "Agentic UI", to: "/agents" },
  { label: "AI agent components", to: "/agents" },
  { label: "Prompt input", to: "/components/prompt-input" },
  { label: "Tool calling UI", to: "/components/tool" },
  { label: "Human-in-the-loop approval", to: "/components/confirmation" },
  { label: "Reasoning display", to: "/components/reasoning" },
  { label: "Chain of thought", to: "/components/chain-of-thought" },
  { label: "Citations & sources", to: "/components/inline-citation" },
  { label: "Agent trace viewer", to: "/components/trace-waterfall" },
  { label: "Streaming text", to: "/components/streaming-text" },
  { label: "shadcn/ui components", to: "/components" },
  { label: "shadcn registry install", to: "/docs/installation" },
  { label: "Tailwind CSS v4 themes", to: "/docs/theming" },
  { label: "Dark mode & presets", to: "/docs/theming" },
  { label: "Command palette", to: "/components/command" },
  { label: "GSAP text animation", to: "/components/text-reveal" },
  { label: "Animated number ticker", to: "/components/number-ticker" },
  { label: "Marquee", to: "/components/marquee" },
  { label: "Toast notifications", to: "/components/toast" },
  { label: "Accessible dialogs", to: "/components/dialog" },
  { label: "File upload dropzone", to: "/components/file-dropzone" },
  { label: "React icons", to: "/icons" },
  { label: "Animated icons", to: "/components/animated-icon" },
  { label: "Lucide icons", to: "/icons/lucide" },
  { label: "Heroicons", to: "/icons/heroicons-2" },
  { label: "Font Awesome icons", to: "/icons/font-awesome-6" },
  { label: "Material icons", to: "/icons/material-design" },
  { label: "Phosphor icons", to: "/icons/phosphor" },
];

export function SiteFooter() {
  const home = useRouterState({ select: (s) => s.location.pathname === "/" });
  return (
    <footer className="cue-dash-t mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_2fr]">
          <div className="grid content-start gap-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE.name} is an open-source library of {components.length} React components for shadcn/ui: an AI agent UI kit for chat, reasoning, tool calls and approvals, GSAP-animated effects,
              and accessible Radix primitives, styled with Tailwind CSS v4 and themeable with CSS variables.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link to="/agents" className="rounded-full border border-border px-3 py-1.5 font-medium transition-colors hover:bg-muted">
                Agent UI kit
              </Link>
              <Link to="/components" className="rounded-full border border-border px-3 py-1.5 font-medium transition-colors hover:bg-muted">
                All components
              </Link>
              <Link to="/docs/theming" className="rounded-full border border-border px-3 py-1.5 font-medium transition-colors hover:bg-muted">
                Theme editor
              </Link>
            </div>
          </div>
          <nav aria-label="Documentation and resources" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn title="Docs" links={[...DOC_PAGES.map((p) => ({ to: p.path, label: p.title })), { to: "/components", label: "All components" }, { to: "/agents", label: "Agent UI kit" }, { to: "/icons", label: "50,000+ icons" }]} />
            <div className="grid content-start gap-3">
              <h2 className="cue-label">Resources</h2>
              <ul className="grid gap-2 text-sm">
                {[
                  { href: SITE.github, label: "GitHub" },
                  { href: "/r/registry.json", label: "shadcn registry" },
                  { href: "/llms.txt", label: "llms.txt" },
                  { href: "/llms-full.txt", label: "llms-full.txt" },
                  { href: "/sitemap.xml", label: "Sitemap" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-3">
              <h2 className="cue-label">Install</h2>
              <code className="rounded-lg border border-border bg-muted/50 p-3 font-mono text-[0.6875rem] leading-relaxed break-all text-muted-foreground">
                npx shadcn@latest add https://ui.cuelark.com/r/prompt-input.json
              </code>
            </div>
          </nav>
        </div>

        {!home && (
        <nav aria-label="All components" className="grid gap-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-5">
          {GROUPS.map((g) => (
            <FooterColumn
              key={g.title}
              title={g.title}
              links={components.filter((c) => g.sections.includes(c.section)).map((c) => ({ to: `/components/${c.slug}`, label: c.name }))}
              dense
            />
          ))}
        </nav>
        )}

        <div className="grid gap-3 border-t border-border pt-8">
          <h2 className="cue-label">Topics</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {TOPICS.map((t) => (
              <li key={t.label}>
                <Link to={t.to} className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="cue-dash-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:px-6">
          <span>
            © {new Date().getFullYear()}{" "}
            <a href={SITE.parent.url} className="font-medium text-foreground hover:underline">
              {SITE.parent.name}
            </a>
            . {components.length} components across {SECTIONS.length} categories. MIT licensed.
          </span>
          <span>Built with Radix, Tailwind CSS and GSAP.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, dense }: { title: string; links: { to: string; label: string }[]; dense?: boolean }) {
  return (
    <div className="grid content-start gap-3">
      <h2 className="cue-label">{title}</h2>
      <ul className={dense ? "grid gap-1.5 text-[0.8125rem]" : "grid gap-2 text-sm"}>
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

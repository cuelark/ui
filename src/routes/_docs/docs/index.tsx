import { Link, createFileRoute } from "@tanstack/react-router";

import { DocHeader } from "@/components/site/doc-header";
import { components, SECTIONS } from "@/content/components";
import { DOC_PAGES, SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";

const page = DOC_PAGES[0]!;

export const Route = createFileRoute("/_docs/docs/")({
  head: () =>
    seo({
      title: "Introduction to Cuelark UI",
      description: page.description,
      path: page.path,
      type: "article",
      jsonLd: [ld.article("Introduction to Cuelark UI", page.description, page.path), ld.breadcrumbs([{ name: SITE.name, path: "/" }, { name: "Docs", path: "/docs" }])],
    }),
  component: Introduction,
});

function Introduction() {
  const animated = components.filter((c) => c.motion).length;
  return (
    <article className="max-w-3xl">
      <DocHeader label="Getting started" title="Introduction" description="A shadcn/ui registry of precise, tactile, animated components. You install the source and own it." />
      <div className="prose-cue">
        <p>
          Cuelark UI is a set of {components.length} React components across {SECTIONS.length} categories, distributed through the{" "}
          <a href="https://ui.shadcn.com/docs/registry">shadcn registry</a>. There is no package to import and nothing to upgrade around. The CLI copies each component's
          source into your project, next to your own code. Each one is built on Radix primitives where interaction is involved, styled with Tailwind CSS v4 tokens, and{" "}
          {animated} of them move with <a href="https://gsap.com">GSAP</a>.
        </p>

        <h2 id="style">The style: a cue in every interaction</h2>
        <p>The name is the idea. Every interaction answers with a small, precise signal that it registered:</p>
        <ul>
          <li>
            <strong>Crop marks.</strong> Print-registration marks frame cards, dialogs, popovers and selected options, and close in when something opens.
          </li>
          <li>
            <strong>Tactile depth.</strong> Controls sit raised with an inset highlight; inputs sit in a recessed well; pressed states travel one pixel.
          </li>
          <li>
            <strong>The ping.</strong> A thin ring ripples from the exact point you pressed (from the center when you use the keyboard).
          </li>
          <li>
            <strong>Keyboard-first hints.</strong> Shortcuts are shown where actions live: in buttons, tooltips, menus and the command palette.
          </li>
          <li>
            <strong>Mono detail.</strong> Labels, indexes and numbers are set in a mono face with tabular figures, so numbers line up and labels read as metadata.
          </li>
        </ul>

        <h2 id="motion">Motion you can turn down</h2>
        <p>
          All animation goes through one small library, <code>lib/motion.ts</code>. It reads a single CSS variable, <code>--cl-motion</code>: <code>0</code> turns animation off,{" "}
          <code>1</code> is the default and <code>1.5</code> is expressive. It cascades, so a dense dashboard can calm down while a landing page livens up. If a visitor asks their system
          for reduced motion, everything stops, whatever the variable says.
        </p>

        <h2 id="seo">Built for search, not just for looks</h2>
        <p>
          Animated text components render their full text on the server, so headings are indexed even when they arrive letter by letter. Reveal never hides content that is already
          on screen, and tables, timelines, breadcrumbs and pagination are semantic HTML. This site practises the same: every page is prerendered, with structured data, a sitemap and an{" "}
          <a href="/llms.txt">llms.txt</a> for AI assistants.
        </p>

        <h2 id="next">Next steps</h2>
        <ol>
          <li>
            <Link to="/docs/installation">Install</Link> your first component with the shadcn CLI.
          </li>
          <li>
            <Link to="/docs/theming">Tune the theme</Link>: accent, radius, density, crop marks and motion.
          </li>
          <li>
            Browse <Link to="/components">all components</Link>, or press <code>⌘K</code> to search.
          </li>
        </ol>

        <h2 id="credits">Credits and license</h2>
        <p>
          Cuelark UI is MIT licensed and made by <a href={SITE.parent.url}>Cuelark</a>. It stands on <a href="https://ui.shadcn.com">shadcn/ui</a>,{" "}
          <a href="https://www.radix-ui.com">Radix UI</a>, <a href="https://tailwindcss.com">Tailwind CSS</a>, <a href="https://gsap.com">GSAP</a> (free under its own standard license),{" "}
          <a href="https://cmdk.paco.me">cmdk</a> and <a href="https://input-otp.rodz.dev">input-otp</a>.
        </p>
      </div>
    </article>
  );
}

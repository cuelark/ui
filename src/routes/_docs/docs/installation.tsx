import { Link, createFileRoute } from "@tanstack/react-router";

import { CodeBlock } from "@/components/site/code-block";
import { DocHeader } from "@/components/site/doc-header";
import { InstallTabs } from "@/components/site/install-tabs";
import { DOC_PAGES, SITE } from "@/content/site";
import { getCode } from "@/lib/code";
import { ld, seo } from "@/lib/seo";

const page = DOC_PAGES[1]!;

const COMPONENTS_JSON = `{
  "registries": {
    "@cuelark": "${SITE.url}/r/{name}.json"
  }
}`;

const MCP_JSON = `{
  "mcpServers": {
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] }
  }
}`;

const USAGE = `import { Button } from "@/components/ui/button";

export function SaveBar() {
  return <Button kbd="⌘S">Save changes</Button>;
}`;

export const Route = createFileRoute("/_docs/docs/installation")({
  loader: () =>
    getCode({
      data: [
        { code: COMPONENTS_JSON, lang: "json" },
        { code: MCP_JSON, lang: "json" },
        { code: USAGE, lang: "tsx" },
      ],
    }),
  head: () =>
    seo({
      title: "Install Cuelark UI components with the shadcn CLI",
      description: page.description,
      path: page.path,
      type: "article",
      keywords: ["shadcn registry", "shadcn add", "install shadcn components", "shadcn namespace", "shadcn mcp"],
      jsonLd: [
        ld.article("Installation", page.description, page.path),
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Installation", path: page.path },
        ]),
      ],
    }),
  component: Installation,
});

function Installation() {
  const [componentsJson, mcpJson, usage] = Route.useLoaderData();
  return (
    <article className="max-w-3xl">
      <DocHeader label="Getting started" title="Installation" description={page.description} />
      <div className="prose-cue">
        <h2 id="prerequisites">1. A shadcn/ui project</h2>
        <p>
          Cuelark UI works in any React project set up for shadcn/ui with Tailwind CSS v4: Next.js, TanStack Start, React Router, Vite or Astro. If you are starting fresh, run{" "}
          <code>npx shadcn@latest init</code> and follow the prompts.
        </p>

        <h2 id="add">2. Add a component</h2>
        <p>Point the CLI at a component's registry URL. The theme tokens, the motion layer and any components it builds on come along automatically.</p>
      </div>
      <div className="mt-4">
        <InstallTabs items={["button"]} />
      </div>
      <div className="prose-cue">
        <h2 id="namespace">3. Optional: the @cuelark namespace</h2>
        <p>
          Add the registry to <code>components.json</code> once, then install by name, e.g. <code>npx shadcn@latest add @cuelark/dialog @cuelark/toast</code>.
        </p>
      </div>
      <CodeBlock className="mt-4" code={componentsJson!.code} html={componentsJson!.html} title="components.json" />
      <div className="prose-cue">
        <h2 id="use">4. Use it</h2>
        <p>Components land in your ui folder like any shadcn component. Import them and change whatever you like, because the code is yours.</p>
      </div>
      <CodeBlock className="mt-4" code={usage!.code} html={usage!.html} title="save-bar.tsx" />
      <div className="prose-cue">
        <h2 id="ai">Using an AI assistant</h2>
        <p>
          With the shadcn MCP server, assistants such as Claude, Cursor or Windsurf can browse and install Cuelark components for you once the namespace is configured. For context, point
          them at <a href="/llms.txt">llms.txt</a> or <a href="/llms-full.txt">llms-full.txt</a>.
        </p>
      </div>
      <CodeBlock className="mt-4" code={mcpJson!.code} html={mcpJson!.html} title=".mcp.json" />
      <div className="prose-cue">
        <h2 id="requirements">Requirements</h2>
        <ul>
          <li>React 19 and Tailwind CSS v4 with <code>tw-animate-css</code> (included by shadcn init).</li>
          <li>
            Animated components use <code>gsap</code> and <code>@gsap/react</code>, which the CLI installs. GSAP is free for commercial use under its standard license.
          </li>
          <li>
            Next steps: <Link to="/docs/theming">theming</Link> and the <Link to="/components">component index</Link>.
          </li>
        </ul>
      </div>
    </article>
  );
}

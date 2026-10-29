import * as React from "react";
import { Link } from "@tanstack/react-router";
import { CheckIcon, PaletteIcon } from "lucide-react";

import { THEMES, themeItem, type ThemePage } from "@/content/themes";
import { sameTheme, setSiteTheme, themeCss, themeTokens, useSiteTheme } from "@/lib/site-theme";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/registry/cuelark/ui/breadcrumb";
import { Button } from "@/registry/cuelark/ui/button";
import { CopyButton } from "@/registry/cuelark/ui/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";
import { CodeBlock } from "../code-block";
import { InstallTabs } from "../install-tabs";
import { AgentPreview, ComponentsPreview, TypePreview } from "../theme-previews";
import { ThemeScope } from "../theme-scope";
import { Palette } from "./theme-gallery";

/** The tokens worth showing, in reading order, with what each one paints. */
const TOKENS: [string, string][] = [
  ["background", "Page"],
  ["foreground", "Text"],
  ["card", "Cards"],
  ["muted", "Panels, wells"],
  ["muted-foreground", "Secondary text"],
  ["primary", "Primary buttons"],
  ["primary-foreground", "Text on primary"],
  ["secondary", "Secondary buttons"],
  ["accent", "Hover, selection"],
  ["border", "Borders"],
  ["input", "Input borders"],
  ["ring", "Focus ring"],
  ["signal", "Accent: checked, live, highlights"],
];

export function ThemeDetail({ page }: { page: ThemePage }) {
  const site = useSiteTheme();
  const active = sameTheme(site, page.theme);
  const tokens = themeTokens(page.theme);
  const css = themeCss(page.theme);
  const others = THEMES.filter((t) => t.slug !== page.slug);
  return (
    <main id="main" className="mx-auto grid max-w-7xl gap-14 px-4 pt-8 pb-24 sm:px-6">
      <div className="grid gap-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/themes">Themes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{page.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <Palette page={page} />
              <span className="cue-label">Theme · {page.theme.font}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{page.name} theme for shadcn/ui</h1>
            <p className="max-w-2xl text-base text-pretty text-muted-foreground">{page.intro}</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Font:</span> {page.font}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={active ? "secondary" : "primary"} onClick={() => setSiteTheme(page.theme)} aria-pressed={active}>
              {active ? <CheckIcon /> : <PaletteIcon />}
              {active ? "Applied to this site" : "Try it on this site"}
            </Button>
            <CopyButton value={css} label="Copy CSS" variant="outline" />
          </div>
        </header>
      </div>

      <section aria-labelledby="preview-title" className="grid gap-4">
        <h2 id="preview-title" className="text-lg font-semibold tracking-tight">
          Preview
        </h2>
        <Tabs defaultValue="components" className="gap-4">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="agent">Agent chat</TabsTrigger>
            <TabsTrigger value="type">Typography</TabsTrigger>
          </TabsList>
          {(["components", "agent", "type"] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid gap-4 xl:grid-cols-2">
                {(["light", "dark"] as const).map((mode) => (
                  <figure key={mode} className="grid gap-2">
                    <figcaption className="cue-label">{mode === "light" ? "Light" : "Dark"}</figcaption>
                    <ThemeScope theme={page.theme} mode={mode} className="overflow-hidden rounded-2xl border border-border">
                      {tab === "components" ? <ComponentsPreview /> : tab === "agent" ? <AgentPreview /> : <TypePreview />}
                    </ThemeScope>
                  </figure>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section aria-labelledby="install-title" className="grid gap-4">
        <h2 id="install-title" className="text-lg font-semibold tracking-tight">
          Install
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid content-start gap-3">
            <p className="text-sm text-muted-foreground">With the shadcn CLI. It writes the light and dark tokens into your global CSS (and the Cuelark utilities if you don't have them yet).</p>
            <InstallTabs items={[themeItem(page.slug)]} />
          </div>
          <div className="grid content-start gap-3">
            <p className="text-sm text-muted-foreground">Or paste the CSS after your Tailwind import. The variable names are the standard shadcn/ui ones, so it themes any shadcn project.</p>
            <CodeBlock code={css} title="globals.css" collapsible />
          </div>
        </div>
      </section>

      <section aria-labelledby="tokens-title" className="grid gap-4">
        <h2 id="tokens-title" className="text-lg font-semibold tracking-tight">
          Tokens
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="bg-muted/50 text-start">
              <tr className="border-b border-border">
                <th className="cue-label px-3 py-2.5 text-start">Token</th>
                <th className="cue-label px-3 py-2.5 text-start">Used for</th>
                <th className="cue-label px-3 py-2.5 text-start">Light</th>
                <th className="cue-label px-3 py-2.5 text-start">Dark</th>
              </tr>
            </thead>
            <tbody>
              {TOKENS.map(([name, use]) => (
                <tr key={name} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-mono text-xs">--{name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{use}</td>
                  {(["light", "dark"] as const).map((mode) => (
                    <td key={mode} className="px-3 py-1.5">
                      <TokenValue value={tokens[mode][name] ?? ""} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <nav aria-labelledby="more-title" className="grid gap-4">
        <h2 id="more-title" className="text-lg font-semibold tracking-tight">
          More themes
        </h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((t) => (
            <li key={t.slug}>
              <Link
                to="/themes/$slug"
                params={{ slug: t.slug }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1.5 ps-1.5 pe-3 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Palette page={t} />
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

/** A swatch and its value; click copies the value. */
function TokenValue({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      title="Copy value"
      className="group flex items-center gap-2 rounded-md px-1.5 py-1 font-mono text-xs outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="size-5 shrink-0 rounded-md ring-1 ring-border" style={{ background: value }} />
      <span className="truncate">{copied ? "Copied" : value}</span>
    </button>
  );
}

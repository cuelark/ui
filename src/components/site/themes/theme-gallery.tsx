import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon, CheckIcon, MoonIcon, SearchIcon, SunIcon } from "lucide-react";

import { THEMES, type ThemePage } from "@/content/themes";
import { sameTheme, setSiteTheme, themeCss, themeTokens, useSiteTheme } from "@/lib/site-theme";
import { Button } from "@/registry/cuelark/ui/button";
import { CopyButton } from "@/registry/cuelark/ui/copy-button";
import { Input } from "@/registry/cuelark/ui/input";
import { cn } from "@/lib/utils";
import { ThemeScope } from "../theme-scope";

/** Every theme as a live card: search by name, mood or brand, flip all cards to dark, copy CSS or apply in one click. */
export function ThemeGallery() {
  const [query, setQuery] = React.useState("");
  const [dark, setDark] = React.useState(false);
  const q = query.trim().toLowerCase();
  const shown = q ? THEMES.filter((t) => [t.name, t.summary, t.intro, t.font, ...t.keywords].join(" ").toLowerCase().includes(q)) : THEMES;
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          aria-label="Search themes"
          placeholder="Search themes: dark, warm, indigo, Geist…"
          leading={<SearchIcon />}
          trailing={<span className="font-mono text-xs tabular-nums">{shown.length}</span>}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 sm:max-w-sm"
        />
        <div role="radiogroup" aria-label="Card mode" className="flex items-center rounded-lg bg-muted p-0.5">
          {[
            { v: false, label: "Light", Icon: SunIcon },
            { v: true, label: "Dark", Icon: MoonIcon },
          ].map(({ v, label, Icon }) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={dark === v}
              onClick={() => setDark(v)}
              className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-checked:bg-background aria-checked:text-foreground aria-checked:shadow-control"
            >
              <Icon className="size-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>
      {shown.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((t) => (
            <li key={t.slug}>
              <ThemeCard page={t} dark={dark} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No theme matches “{query}”. Try a color (indigo, green), a mood (warm, minimal) or a face (Geist, Inter).</p>
      )}
    </div>
  );
}

function ThemeCard({ page, dark }: { page: ThemePage; dark: boolean }) {
  const site = useSiteTheme();
  const active = sameTheme(site, page.theme);
  const r = `${page.theme.radius}rem`;
  return (
    <article className="group grid h-full overflow-hidden rounded-xl border border-border bg-card transition-[border-color,box-shadow] duration-200 hover:border-foreground/15 hover:shadow-raised">
      <Link to="/themes/$slug" params={{ slug: page.slug }} className="outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset" aria-label={`${page.name} theme`}>
        <ThemeScope theme={page.theme} mode={dark ? "dark" : "light"} className="grid gap-3 border-b border-border p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold tracking-tight">{page.name}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[0.6875rem] text-muted-foreground">{page.theme.font}</span>
          </div>
          <div className="grid gap-2 rounded-lg border border-border bg-card p-3" style={{ borderRadius: r }}>
            <div className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-muted" />
              <span className="grid flex-1 gap-1">
                <span className="h-2 w-2/3 rounded-full bg-foreground/80" />
                <span className="h-1.5 w-1/2 rounded-full bg-muted-foreground/40" />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-primary px-2.5 py-1 text-[0.6875rem] font-medium text-primary-foreground" style={{ borderRadius: r }}>
                Primary
              </span>
              <span className="border border-border bg-background px-2.5 py-1 text-[0.6875rem] font-medium" style={{ borderRadius: r }}>
                Outline
              </span>
              <span className="relative ms-auto h-4 w-7 rounded-full bg-signal">
                <span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-white shadow" />
              </span>
            </div>
          </div>
        </ThemeScope>
      </Link>
      <div className="grid content-between gap-3 p-4">
        <p className="text-sm text-muted-foreground">{page.summary}</p>
        <div className="flex items-center gap-1.5">
          <Palette page={page} dark={dark} />
          <span className="ms-auto flex items-center gap-1">
            <CopyButton value={themeCss(page.theme)} aria-label={`Copy ${page.name} CSS`} title="Copy CSS" />
            <Button size="xs" variant={active ? "secondary" : "outline"} onClick={() => setSiteTheme(page.theme)} aria-pressed={active}>
              {active ? <CheckIcon /> : null}
              {active ? "Applied" : "Apply"}
            </Button>
            <Button size="xs" variant="ghost" asChild>
              <Link to="/themes/$slug" params={{ slug: page.slug }}>
                Open <ArrowUpRightIcon />
              </Link>
            </Button>
          </span>
        </div>
      </div>
    </article>
  );
}

/** The five colors that define a theme, as dots. */
export function Palette({ page, dark, className }: { page: ThemePage; dark?: boolean; className?: string }) {
  const t = themeTokens(page.theme)[dark ? "dark" : "light"];
  return (
    <span aria-hidden="true" className={cn("flex -space-x-1", className)}>
      {[t.background, t.foreground, t.primary, t.signal, t.border].map((c, i) => (
        <span key={i} className="size-4 rounded-full ring-2 ring-card" style={{ background: c }} />
      ))}
    </span>
  );
}

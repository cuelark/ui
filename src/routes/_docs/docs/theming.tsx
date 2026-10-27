import { createFileRoute } from "@tanstack/react-router";

import { DocHeader } from "@/components/site/doc-header";
import { ThemeEditor } from "@/components/site/theme-editor";
import { ThemePresets } from "@/components/site/theme-presets";
import { DOC_PAGES, SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";
import { cssVars } from "@/registry/cuelark/theme";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/cuelark/ui/table";

const page = DOC_PAGES[2]!;

const KNOBS = [
  { token: "--primary · --ring · --accent", role: "Accent color (OKLCH). The editor derives the light and dark set from one hue." },
  { token: "--radius", role: "Corner rounding; shadcn's radius scale (sm, md, lg, xl) is derived from it." },
  { token: "--cl-density", role: "Scales control heights (h-ctl-*) and card padding (p-card): 0.875 compact, 1 default, 1.125 roomy." },
  { token: "--cl-marks", role: "Crop-mark visibility, 0 or 1. Also --cl-mark-len and --cl-mark-gap for their geometry." },
  { token: "--cl-motion", role: "GSAP motion amplitude: 0 off, 1 default, 1.5 expressive. Cascades, so scope it to a subtree." },
  { token: "--cl-highlight · --cl-shade", role: "The inset top highlight and the shadow color behind every raised and recessed surface." },
];

export const Route = createFileRoute("/_docs/docs/theming")({
  head: () =>
    seo({
      title: "Theming and motion: shadcn theme editor",
      description: page.description,
      path: page.path,
      type: "article",
      keywords: ["shadcn theme generator", "shadcn theme editor", "tailwind v4 theme", "oklch color theme", "css variables theme"],
      jsonLd: [
        ld.article("Theming", page.description, page.path),
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Theming", path: page.path },
        ]),
      ],
    }),
  component: Theming,
});

function Theming() {
  return (
    <article>
      <div className="max-w-3xl">
        <DocHeader label="Getting started" title="Theming" description={page.description} />
        <div className="prose-cue">
          <p>
            Everything is a CSS variable. Components never hard-code colors, heights or timings, so a few variables restyle the whole library, in light and dark mode. Use the editor
            below, then paste the snippet into your global stylesheet after the Cuelark theme.
          </p>
        </div>
      </div>

      <section aria-labelledby="presets" className="mt-10">
        <h2 id="presets" className="mb-5 text-xl font-semibold tracking-tight">
          Themes
        </h2>
        <ThemePresets />
      </section>

      <section aria-labelledby="editor" className="mt-14">
        <h2 id="editor" className="mb-5 text-xl font-semibold tracking-tight">
          Theme editor
        </h2>
        <ThemeEditor />
      </section>

      <div className="max-w-3xl">
        <div className="prose-cue">
          <h2 id="knobs">The knobs</h2>
        </div>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>What it controls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {KNOBS.map((k) => (
                <TableRow key={k.token}>
                  <TableCell className="font-mono text-xs text-primary">{k.token}</TableCell>
                  <TableCell className="text-sm whitespace-normal text-muted-foreground">{k.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="prose-cue">
          <h2 id="tokens">All tokens</h2>
          <p>
            The full set the <code>theme</code> registry item writes into your CSS. Values are OKLCH, so lightness steps look even across hues.
          </p>
        </div>
        <div className="mt-4">
          <Table stickyHeader>
            <TableHeader>
              <TableRow>
                <TableHead>Variable</TableHead>
                <TableHead>Light</TableHead>
                <TableHead>Dark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(cssVars.light).map(([name, light]) => (
                <TableRow key={name}>
                  <TableCell className="font-mono text-xs">--{name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <Swatch value={light} />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{cssVars.dark[name] ? <Swatch value={cssVars.dark[name]} /> : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="prose-cue">
          <h2 id="dark-mode">Dark mode</h2>
          <p>
            Dark values live under <code>.dark</code>, the shadcn convention. Toggle the class on <code>&lt;html&gt;</code> with your theme switcher; no component needs a{" "}
            <code>dark:</code> variant.
          </p>
          <h2 id="utilities">Utilities</h2>
          <ul>
            <li>
              <code>cue-marks</code>: crop marks around any positioned element.
            </li>
            <li>
              <code>cue-dash-t</code> / <code>cue-dash-b</code>: dashed hairline on the top or bottom edge.
            </li>
            <li>
              <code>cue-label</code>: the mono micro-label.
            </li>
            <li>
              <code>cue-kbd</code>: the keycap used for every shortcut hint.
            </li>
            <li>
              <code>h-ctl-sm · h-ctl-md · h-ctl-lg</code> and <code>p-card</code>: density-aware sizes.
            </li>
            <li>
              <code>shadow-control · shadow-raised · shadow-overlay · shadow-well · shadow-pressed</code> and <code>ease-cue</code>.
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}

function Swatch({ value }: { value: string }) {
  const color = value.startsWith("oklch") ? value : null;
  return (
    <span className="inline-flex items-center gap-2">
      {color && <span className="size-3 shrink-0 rounded-sm ring-1 ring-black/10" style={{ background: color }} />}
      {value}
    </span>
  );
}

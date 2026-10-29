/**
 * Pure builders for everything derived from the content + token sources. Used by scripts/registry.ts
 * (writes the files) and test/registry.test.ts (checks the committed files are in sync).
 */
import { existsSync, readFileSync } from "node:fs";
import { setSlug } from "../src/lib/icon-slugs.ts";
import { POPULAR_SEARCHES } from "../src/lib/icon-seo.ts";
import { join } from "node:path";
import { components } from "../src/content/components.ts";
import { SCENARIOS, ZONES } from "../src/content/agent-guide.ts";
import { THEMES, themeItem } from "../src/content/themes.ts";
import { themeTokens, themeVars } from "../src/lib/site-theme.ts";
import { DOC_PAGES, SITE, registryUrl } from "../src/content/site.ts";
import { css, cssVars, type CssRules } from "../src/registry/cuelark/theme.ts";

export const ROOT = join(import.meta.dirname, "..");
export const uiPath = (slug: string) => `src/registry/cuelark/ui/${slug}.tsx`;
export const examplePath = (name: string) => `src/registry/cuelark/examples/${name}.tsx`;
export const MOTION_PATH = "src/lib/motion.ts";

/** npm packages and sibling Cuelark components a source file imports. */
export function scanImports(file: string) {
  const source = readFileSync(join(ROOT, file), "utf8");
  const specifiers = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
  const dependencies = new Set<string>();
  const siblings = new Set<string>();
  for (const s of specifiers) {
    const sibling = /^@\/registry\/cuelark\/ui\/([\w-]+)$/.exec(s);
    if (sibling) siblings.add(sibling[1]!);
    else if (s === "@/lib/motion") siblings.add("motion");
    else if (!s.startsWith("@/") && !s.startsWith(".") && s !== "react") dependencies.add(s.startsWith("@") ? s.split("/").slice(0, 2).join("/") : s.split("/")[0]!);
  }
  return { dependencies: [...dependencies].sort(), siblings: [...siblings].sort() };
}

export function buildRegistry() {
  const theme = {
    name: "theme",
    type: "registry:theme",
    title: "Cuelark theme",
    description: "Design tokens and utilities every Cuelark component uses: colors, density, shadows, crop marks, dashed rules, labels and kbd.",
    devDependencies: ["tw-animate-css"],
    cssVars,
    css,
    files: [],
  };

  // One installable item per gallery theme: its palette and shape over the base tokens (which it pulls in).
  const themes = THEMES.map((t) => {
    const tokens = themeTokens(t.theme);
    const { "cl-font-sans": _font, "cl-text-size": _size, "cl-tracking": _tracking, ...shape } = themeVars(t.theme);
    return {
      name: themeItem(t.slug),
      type: "registry:theme",
      title: `${t.name} theme`,
      description: `${t.summary} Light and dark mode. Font: ${t.font}`,
      registryDependencies: [registryUrl("theme")],
      cssVars: { light: { ...tokens.light, ...shape }, dark: tokens.dark },
      files: [],
    };
  });

  const motion = {
    name: "motion",
    type: "registry:lib",
    title: "Cuelark motion",
    description: "The GSAP layer behind every animated component: the cue easing curves, the --cl-motion amplitude knob, reduced-motion handling, the press ping and overlay entrances.",
    dependencies: scanImports(MOTION_PATH).dependencies,
    files: [{ path: MOTION_PATH, type: "registry:lib" }],
  };

  const ui = components.map((c) => {
    const { dependencies, siblings } = scanImports(uiPath(c.slug));
    return {
      name: c.slug,
      type: "registry:ui",
      title: c.name,
      description: c.description,
      dependencies,
      registryDependencies: ["utils", registryUrl("theme"), ...siblings.map(registryUrl)],
      files: [{ path: uiPath(c.slug), type: "registry:ui" }],
      categories: [c.section.toLowerCase()],
      docs: `Docs and examples: ${SITE.url}/components/${c.slug}`,
    };
  });

  const examples = components.flatMap((c) =>
    c.examples.map((e) => {
      const { dependencies, siblings } = scanImports(examplePath(e.name));
      return {
        name: e.name,
        type: "registry:component",
        title: `${c.name}: ${e.title}`,
        description: e.description,
        dependencies,
        registryDependencies: siblings.map(registryUrl),
        files: [{ path: examplePath(e.name), type: "registry:component" }],
        categories: [c.slug, "example"],
      };
    }),
  );

  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "cuelark",
    homepage: SITE.url,
    items: [theme, ...themes, motion, ...ui, ...examples],
  };
}

function serialize(rules: CssRules, indent = ""): string {
  return Object.entries(rules)
    .map(([key, value]) => (typeof value === "string" ? `${indent}${key}: ${value};` : `${indent}${key} {\n${serialize(value, indent + "  ")}\n${indent}}`))
    .join("\n");
}

const vars = (record: Record<string, string>) => Object.fromEntries(Object.entries(record).map(([k, v]) => [`--${k}`, v]));

/** The docs site's copy of the theme, identical to what `shadcn add theme` writes into a project. */
export function buildThemeCss() {
  return [
    "/* Generated by scripts/registry.ts from src/registry/cuelark/theme.ts. Do not edit by hand. */",
    serialize({ ":root": vars(cssVars.light), ".dark": vars(cssVars.dark), "@theme inline": vars(cssVars.theme) }),
    serialize(css),
    "",
  ].join("\n\n");
}

export function sitePaths() {
  return ["/", "/components", "/agents", ...SCENARIOS.slice(1).map((s) => `/agents/${s.slug}`), "/themes", ...THEMES.map((t) => `/themes/${t.slug}`), "/icons", ...DOC_PAGES.map((p) => p.path), ...components.map((c) => `/components/${c.slug}`)];
}

const urlset = (paths: string[], lastmod: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE.url}${p === "/" ? "" : p}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}\n</urlset>\n`;

/**
 * Sitemaps: /sitemap.xml is an index of the docs pages plus one file per icon set (every icon has its own page),
 * keeping each file well under the 50,000-URL limit. Icon names come from public/icons/index.json (icons:build).
 */
export function buildSitemaps(lastmod: string): Record<string, string> {
  const iconIndexPath = join(ROOT, "public", "icons", "index.json");
  const icons = existsSync(iconIndexPath) ? (JSON.parse(readFileSync(iconIndexPath, "utf8")) as { sets: { id: string }[]; slugs: Record<string, string[]> }) : { sets: [], slugs: {} };
  const files: Record<string, string> = {
    "public/sitemap-pages.xml": urlset([...sitePaths(), ...icons.sets.map((s) => `/icons/${setSlug(s.id)}`), ...POPULAR_SEARCHES.map((t) => `/icons/search/${t}`)], lastmod),
  };
  for (const s of icons.sets) files[`public/sitemap-icons-${setSlug(s.id)}.xml`] = urlset(icons.slugs[s.id]!.map((slug) => `/icons/${setSlug(s.id)}/${slug}`), lastmod);
  const entries = Object.keys(files).map((f) => `  <sitemap><loc>${SITE.url}/${f.replace("public/", "")}</loc><lastmod>${lastmod}</lastmod></sitemap>`);
  files["public/sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>\n`;
  return files;
}

/**
 * robots.txt: everything is open to crawlers (search engines and AI assistants alike) except endpoints that run code
 * per request and have no page worth indexing: arbitrary icon searches (the popular ones are prerendered and allowed),
 * per-icon registry files, server functions and standalone previews. Keeps crawlers off the Worker request budget.
 */
export function buildRobots() {
  return [
    "User-agent: *",
    "Allow: /",
    ...POPULAR_SEARCHES.map((t) => `Allow: /icons/search/${t}$`),
    "Disallow: /icons/search/",
    "Disallow: /r/icons/",
    "Disallow: /_serverFn/",
    "Disallow: /preview/",
    "",
    `Sitemap: ${SITE.url}/sitemap.xml`,
    "",
  ].join("\n");
}

export function buildLlms() {
  const docs = DOC_PAGES.map((p) => `- [${p.title}](${SITE.url}${p.path}): ${p.description}`).join("\n");
  const items = components.map((c) => `- [${c.name}](${SITE.url}/components/${c.slug}): ${c.description} Registry item: ${registryUrl(c.slug)}`).join("\n");
  return `# ${SITE.name}

> ${SITE.description}

Install any component with the shadcn CLI, e.g. \`npx shadcn@latest add ${registryUrl("button")}\`. Components depend on the
\`theme\` item (${registryUrl("theme")}), which the CLI installs automatically. The full index is ${SITE.url}/r/registry.json.

## Docs

${docs}

## Components

${items}

## Themes

Light and dark shadcn/ui themes. Install one with \`npx shadcn@latest add ${registryUrl("theme-linear")}\` (swap the name), or copy its CSS from the page.

${THEMES.map((t) => `- [${t.name} theme](${SITE.url}/themes/${t.slug}): ${t.summary} Font: ${t.font} Registry item: ${registryUrl(themeItem(t.slug))}`).join("\n")}

## Agent UI: where each component goes

Live, inspectable demos: ${SCENARIOS.map((s, i) => `[${s.title}](${SITE.url}/agents${i ? `/${s.slug}` : ""})`).join(", ")}.

${ZONES.map((z) => `### ${z.name}\n\n${z.summary}\n\n${z.items.map((it) => `- ${components.find((c) => c.slug === it.slug)?.name ?? it.slug}: ${it.when}${it.avoid ? ` Avoid: ${it.avoid}` : ""}`).join("\n")}`).join("\n\n")}

## Optional

- [Full text for LLMs](${SITE.url}/llms-full.txt): every component's description, usage, props and accessibility notes in one file.
- [Source code](${SITE.github}): MIT licensed.
`;
}

export function buildLlmsFull() {
  const sections = components.map((c) => {
    const props = c.api
      .flatMap((a) => a.props.map((p) => `- \`${a.part}.${p.prop}\` (\`${p.type}\`${p.default ? `, default \`${p.default}\`` : ""}): ${p.description}`))
      .join("\n");
    return `## ${c.name}

${c.intro}

Install: \`npx shadcn@latest add ${registryUrl(c.slug)}\` · Docs: ${SITE.url}/components/${c.slug}

\`\`\`tsx
${c.usage.imports}

${c.usage.code}
\`\`\`

${props ? `### Props\n\n${props}\n\n` : ""}### Accessibility

${c.accessibility.map((a) => `- ${a}`).join("\n")}`;
  });
  return `# ${SITE.name}: full reference\n\n> ${SITE.description}\n\n${sections.join("\n\n")}\n`;
}

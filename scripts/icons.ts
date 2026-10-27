/**
 * Pre-renders every react-icons icon to SVG once, at build time:
 *
 *   public/icons/index.json   sets (name, license, count) + every icon name, for instant client search
 *   public/icons/<set>.json   one file per set: name → [svg attributes, inner markup], fetched lazily
 *
 * Nothing here ships in the Worker bundle; the files are static assets. Skips work when react-icons' version is
 * unchanged since the last run.
 */
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

import { iconWords } from "../src/lib/icons.ts";
import { kebab } from "../src/lib/icon-slugs.ts";

const require = createRequire(import.meta.url);
const OUT = join(import.meta.dirname, "..", "public", "icons");
const { version } = JSON.parse(readFileSync(join(import.meta.dirname, "..", "node_modules", "react-icons", "package.json"), "utf8")) as { version: string };
const { IconsManifest } = require("react-icons/lib") as { IconsManifest: { id: string; name: string; projectUrl: string; license: string; licenseUrl: string }[] };

const stamp = join(OUT, ".version");
const BUILD = `${version}+slugs1`;
if (existsSync(stamp) && readFileSync(stamp, "utf8") === BUILD && !process.argv.includes("--force")) {
  console.log(`[icons] react-icons ${version} already built`);
  process.exit(0);
}
mkdirSync(OUT, { recursive: true });

// Attributes every react-icons SVG shares; dropped from storage and restored on the client.
const COMMON = [/\s?stroke="currentColor"/, /\s?fill="currentColor"/, /\s?height="1em"/, /\s?width="1em"/, /\s?xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, /\s?stroke-width="0"/];

const index: {
  sets: { id: string; name: string; count: number; license: string; licenseUrl: string; projectUrl: string }[];
  names: Record<string, string[]>;
  /** URL slug per icon, aligned with names: "arrow-right" (unique within its set). */
  slugs: Record<string, string[]>;
} = { sets: [], names: {}, slugs: {} };
let total = 0;

for (const set of IconsManifest) {
  const mod = (await import(`react-icons/${set.id}`)) as Record<string, ComponentType>;
  const icons: Record<string, [string, string]> = {};
  for (const [name, Icon] of Object.entries(mod)) {
    if (typeof Icon !== "function") continue;
    const svg = renderToStaticMarkup(createElement(Icon));
    const open = svg.slice(0, svg.indexOf(">") + 1);
    const inner = svg.slice(open.length, -"</svg>".length);
    // Keep only what differs from the shared defaults (viewBox, fill="none", stroke widths, …).
    let attrs = open.slice(4, -1);
    const hadStrokeWidth0 = /stroke-width="0"/.test(attrs);
    for (const re of COMMON) attrs = attrs.replace(re, "");
    attrs = attrs.replace(/\s?style="[^"]*"/, "").trim();
    icons[name] = [hadStrokeWidth0 ? attrs : `${attrs} data-sw="1"`.trim(), inner];
  }
  const names = Object.keys(icons);
  writeFileSync(join(OUT, `${set.id}.json`), JSON.stringify({ id: set.id, name: set.name, icons }));
  index.sets.push({ id: set.id, name: set.name, count: names.length, license: set.license, licenseUrl: set.licenseUrl, projectUrl: set.projectUrl });
  index.names[set.id] = names;
  const seen = new Map<string, number>();
  index.slugs[set.id] = names.map((n) => {
    const base = kebab(iconWords(n, set.id)) || kebab(n);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
  total += names.length;
}

writeFileSync(join(OUT, "index.json"), JSON.stringify(index));
writeFileSync(stamp, BUILD);
console.log(`[icons] wrote ${total} icons in ${index.sets.length} sets (react-icons ${version})`);

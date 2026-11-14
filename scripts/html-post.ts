/**
 * Post-prerender pass over dist/client/**\/*.html.
 *
 * Drops the <link rel="modulepreload"> hints Start emits for every route chunk (38 on an icon set page).
 * Pages are fully prerendered, so the text paints from the HTML alone; those high-priority preloads only competed
 * with it for bandwidth and pushed mobile first paint to ~3 s. The entry script still loads (async module) and
 * pulls its chunks itself, so hydration is one round trip later and nothing else changes.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../dist/client", import.meta.url).pathname;
const PRELOAD = /<link rel="modulepreload" href="[^"]+"\/>/g;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (n === "assets") return [];
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

let files = 0;
let removed = 0;
for (const f of walk(ROOT)) {
  const html = readFileSync(f, "utf8");
  const n = html.match(PRELOAD)?.length ?? 0;
  if (!n) continue;
  writeFileSync(f, html.replace(PRELOAD, ""));
  files++;
  removed += n;
}
console.log(`[html-post] removed ${removed} modulepreload hints from ${files} pages`);

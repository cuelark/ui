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
  // The entry script hydrates an already-painted page, so fetch it at low priority behind the HTML, CSS and fonts.
  let next = html.replace(PRELOAD, "");
  // Hydration waits for the load event: the page is fully prerendered, so text, links and CSS-only UI work at once,
  // and the 290 KB entry no longer competes with the HTML and fonts for the first paint (mobile LCP). The original tag
  // stays in place without src (an empty module, so React hydrates the same node), and the existing head script
  // appends the real one to <head>, where React tolerates third-party tags.
  const entry = /<script type="module" async="" src="([^"]+)"><\/script>/.exec(next);
  if (entry && next.includes("<script>(function(){try{")) {
    const loader = `(function(){var u=${JSON.stringify(entry[1])};function go(){var s=document.createElement("script");s.type="module";s.src=u;document.head.appendChild(s)}if(document.readyState==="complete")go();else addEventListener("load",go,{once:true})})();`;
    next = next.replace(entry[0], `<script type="module" async="" data-src="${entry[1]}"></script>`).replace("<script>(function(){try{", `<script>${loader}(function(){try{`);
  }
  if (next === html) continue;
  writeFileSync(f, next);
  files++;
  removed += n;
}
console.log(`[html-post] removed ${removed} modulepreload hints from ${files} pages`);

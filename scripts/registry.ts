/**
 * `pnpm registry:build` step 1: regenerate every derived file, then `shadcn build` turns registry.json
 * into the flat /r/*.json files the CLI downloads.
 *
 *   registry.json            committed (GitHub registry consumers read it directly)
 *   src/styles/cuelark.css   committed (the docs site's copy of the theme item)
 *   public/sitemap.xml, public/llms.txt, public/llms-full.txt   build output
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, buildLlms, buildLlmsFull, buildRegistry, buildRobots, buildSitemaps, buildThemeCss } from "./registry-data.ts";

const files: Record<string, string> = {
  "registry.json": `${JSON.stringify(buildRegistry(), null, 2)}\n`,
  "src/styles/cuelark.css": buildThemeCss(),
  ...buildSitemaps(new Date().toISOString().slice(0, 10)),
  "public/llms.txt": buildLlms(),
  "public/llms-full.txt": buildLlmsFull(),
  "public/robots.txt": buildRobots(),
};

for (const [path, content] of Object.entries(files)) writeFileSync(join(ROOT, path), content);
console.log(`[registry] wrote ${Object.keys(files).length} files (registry.json, theme CSS, sitemaps, llms.txt)`);

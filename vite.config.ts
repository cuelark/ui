import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { POPULAR_SEARCHES } from "./src/lib/icon-seo";
import { SET_SLUGS, setSlug } from "./src/lib/icon-slugs";
import { readFileSync } from "node:fs";

/** Set by Alchemy during deploys: it injects its own Cloudflare plugin, so ours (wrangler.jsonc, local dev) stands down. */
const ALCHEMY = process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1";

/**
 * ICON_BUILD=1 (scripts/deploy-icons.ts) prerenders only the ~51k individual icon pages, which ship separately as
 * static files. ICON_SETS=lu,fi limits it to some sets (by react-icons id) for quick checks.
 */
const ICON_BUILD = process.env.ICON_BUILD === "1";
function iconPages() {
  const index = JSON.parse(readFileSync(new URL("./public/icons/index.json", import.meta.url), "utf8")) as { slugs: Record<string, string[]> };
  const only = process.env.ICON_SETS?.split(",");
  return Object.entries(index.slugs)
    .filter(([id]) => !only || only.includes(id))
    .flatMap(([id, slugs]) => slugs.map((slug) => ({ path: `/icons/${setSlug(id)}/${slug}` })));
}

export default defineConfig({
  server: { port: 3300 },
  resolve: { tsconfigPaths: true },
  plugins: [
    ALCHEMY ? null : cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      // Local builds prerender every page to static HTML. Alchemy's injected Cloudflare plugin emits the server bundle
      // where TanStack's prerender preview can't load it, so deploys skip it: the Worker server-renders each page on
      // request instead (still complete HTML for crawlers), and sitemap.xml / llms.txt ship as static files in public/.
      prerender: {
        enabled: !ALCHEMY,
        crawlLinks: !ICON_BUILD,
        autoSubfolderIndex: false,
        failOnError: true,
        // Tens of thousands of renders: retry a transient failure instead of losing the whole run.
        retryCount: 3,
        retryDelay: 500,
        concurrency: 16,
        // Real site routes only (never links inside code samples). Icon hub, set and search pages are static; the
        // 51k individual icon pages are server-rendered once and then cached at the edge (see src/worker.ts).
        filter: ({ path }) =>
          ICON_BUILD ? /^\/icons\/[a-z0-9-]+\/[a-z0-9-]+$/.test(path) :
          path === "/" ||
          /^\/(components|docs|agents|themes)(\/|$)/.test(path) ||
          /^\/icons(\/search\/[a-z0-9-]+|\/[a-z0-9-]+)?$/.test(path) ||
          path === "/sitemap.xml" ||
          path === "/llms.txt",
      },
      pages: ICON_BUILD ? iconPages() : [
        { path: "/sitemap.xml" },
        { path: "/llms.txt" },
        { path: "/icons" },
        ...Object.values(SET_SLUGS).map((slug) => ({ path: `/icons/${slug}` })),
        ...POPULAR_SEARCHES.map((term) => ({ path: `/icons/search/${term}` })),
      ],
    }),
    viteReact(),
    tailwindcss(),
  ],
});

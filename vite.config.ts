import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { POPULAR_SEARCHES } from "./src/lib/icon-seo";
import { SET_SLUGS } from "./src/lib/icon-slugs";

/** Set by Alchemy during deploys: it injects its own Cloudflare plugin, so ours (wrangler.jsonc, local dev) stands down. */
const ALCHEMY = process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1";

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
        crawlLinks: true,
        autoSubfolderIndex: false,
        failOnError: true,
        concurrency: 16,
        // Real site routes only (never links inside code samples). Icon hub, set and search pages are static; the
        // 51k individual icon pages are server-rendered once and then cached at the edge (see src/worker.ts).
        filter: ({ path }) =>
          path === "/" ||
          /^\/(components|docs|agents)(\/|$)/.test(path) ||
          /^\/icons(\/search\/[a-z0-9-]+|\/[a-z0-9-]+)?$/.test(path) ||
          path === "/sitemap.xml" ||
          path === "/llms.txt",
      },
      pages: [
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

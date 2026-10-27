import serverEntry from "@tanstack/react-start/server-entry";

/** Long-lived, data-only pages: one icon page or icon registry file never changes between deploys. */
const EDGE_CACHED = /^\/(icons\/[a-z0-9-]+\/[a-z0-9-]+|r\/icons\/[a-z0-9-]+\/[a-zA-Z0-9-]+\.(json|svg))$/;
const TTL = 60 * 60 * 24 * 7;

type Ctx = { waitUntil(p: Promise<unknown>): void };

export default {
  async fetch(request, env, ctx) {
    const render = () => (serverEntry.fetch as (r: Request, ...rest: unknown[]) => Promise<Response>)(request, env, ctx);
    const url = new URL(request.url);
    if (request.method !== "GET" || url.search || !EDGE_CACHED.test(url.pathname)) return render();

    // Render once per edge location, then serve it like a static file until the next deploy purges or it expires.
    const cache = (caches as unknown as { default: Cache }).default;
    const key = new Request(url.toString(), { method: "GET" });
    const hit = await cache.match(key);
    if (hit) return hit;
    const res = await render();
    if (res.status !== 200) return res;
    const cached = new Response(res.body, res);
    cached.headers.set("cache-control", `public, max-age=3600, s-maxage=${TTL}, stale-while-revalidate=86400`);
    (ctx as Ctx).waitUntil(cache.put(key, cached.clone()));
    return cached;
  },
} satisfies ExportedHandler;

import { getRequestUrl } from "@tanstack/react-start/server";

const cache = new Map<string, Promise<unknown>>();

/**
 * Reads a pre-rendered icon file. On Cloudflare it comes straight from the static-assets binding (no network hop);
 * in local dev it is fetched from the dev server, which serves public/.
 */
export function readIconAsset<T>(path: string): Promise<T> {
  if (!cache.has(path)) {
    cache.set(
      path,
      (async () => {
        try {
          const { env } = (await import(/* @vite-ignore */ "cloudflare:workers")) as { env: { ASSETS?: { fetch: (r: Request) => Promise<Response> } } };
          if (env.ASSETS) {
            const res = await env.ASSETS.fetch(new Request(new URL(path, "https://assets.local")));
            if (res.ok) return res.json();
          }
        } catch {
          /* not on Workers */
        }
        const res = await fetch(new URL(path, getRequestUrl()));
        if (!res.ok) throw new Error(`Icon asset ${path} → ${res.status}`);
        return res.json();
      })().catch((e) => {
        cache.delete(path);
        throw e;
      }),
    );
  }
  return cache.get(path) as Promise<T>;
}

import { SET_SLUGS } from "./icon-slugs.ts";

const SLUGS = new Set(Object.values(SET_SLUGS));

/** A readable set slug ("lucide") or a react-icons id ("lu") → the canonical slug. Unknown segments return null. */
export function canonicalSetSlug(segment: string): string | null {
  if (segment in SET_SLUGS) return SET_SLUGS[segment]!;
  if (SLUGS.has(segment)) return segment;
  return null;
}

/** Lowercase search slugs the /icons/search/$query route can render. Anything else is retired. */
const SEARCH_TERM = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type IconRedirect = { location: string };

const withoutPage = (searchParams: URLSearchParams) => {
  const next = new URLSearchParams(searchParams);
  next.delete("page");
  const q = next.toString();
  return q ? `?${q}` : "";
};

/**
 * Permanent target for a retired or non-canonical icon URL, or null when this request should be served.
 *
 * Served: the hub (/icons), a set page (/icons/<set>), a search page (/icons/search/<term>),
 * icon JSON (/icons/index.json, /icons/<id>.json) and SVGs (/icons/<set>/<icon>.svg).
 *
 * /icons/<set>/<icon> (including old react-icons ids and names, trailing slashes and .html files) goes to the set.
 * Every other removed icon URL goes to the hub.
 */
export function iconRedirect(pathname: string, searchParams: URLSearchParams): IconRedirect | null {
  if (pathname !== "/icons" && !pathname.startsWith("/icons/")) return null;
  const raw = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const parts = raw.split("/").filter(Boolean);
  if (parts[0] !== "icons") return null;

  if (parts.length === 1) {
    if (searchParams.has("page") || pathname !== "/icons") return { location: "/icons" };
    return null;
  }

  // Static icon data. These are not pages.
  if (parts.length === 2 && parts[1]!.includes(".")) return null;

  if (parts[1] === "search") {
    if (parts.length === 3 && SEARCH_TERM.test(parts[2]!)) return null;
    return { location: "/icons" };
  }

  const canon = canonicalSetSlug(parts[1]!);
  if (!canon) return { location: "/icons" };
  const setPath = `/icons/${canon}`;

  if (parts.length === 2) {
    if (canon !== parts[1] || pathname !== raw || searchParams.has("page")) return { location: `${setPath}${withoutPage(searchParams)}` };
    return null;
  }

  // SVG downloads stay on this path; the worker rewrites them to the registry route.
  if (parts.length === 3 && parts[2]!.toLowerCase().endsWith(".svg")) return null;

  // The old per-icon page, a PascalCase name, or the static .html file the icon Workers served.
  if (parts.length === 3 && (!parts[2]!.includes(".") || parts[2]!.toLowerCase().endsWith(".html"))) return { location: setPath };

  return { location: "/icons" };
}

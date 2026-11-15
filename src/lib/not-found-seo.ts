/**
 * Technical SEO for responses that must not be indexed:
 * - HTML 404s previously reused the homepage title, description and "index, follow".
 * - Retired /sitemap-icons-*.xml files (removed 7 Nov 2026 with the per-icon pages) previously 404ed as that same HTML.
 */

export const NOT_FOUND_TITLE = "Page not found · Cuelark";
export const NOT_FOUND_DESCRIPTION =
  "This page does not exist on Cuelark UI. Open the component index, the icon explorer, or the homepage.";
export const NOT_FOUND_ROBOTS = "noindex, follow";

/** True when TanStack Router is rendering the not-found boundary. */
export function isNotFoundMatches(matches: Array<{ status: string; globalNotFound?: boolean }>): boolean {
  return matches.some((m) => m.status === "notFound" || m.globalNotFound === true);
}

/**
 * Permanent target for a retired per-set icon sitemap, or null when this path is not one of those files.
 * The sitemap index at /sitemap.xml now lists only sitemap-pages.xml (hubs, docs, components, one URL per icon set).
 */
export function retiredSitemapRedirect(pathname: string): { location: string } | null {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (/^\/sitemap-icons-[a-z0-9-]+\.xml$/i.test(path)) return { location: "/sitemap.xml" };
  return null;
}

/** Replace homepage (or any) title, description and robots tags on an HTML 404 so it is not a soft duplicate. */
export function rewriteNotFoundHead(html: string): string {
  let out = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${NOT_FOUND_TITLE}</title>`);
  out = replaceMetaContent(out, "description", NOT_FOUND_DESCRIPTION);
  out = replaceMetaContent(out, "robots", NOT_FOUND_ROBOTS);
  return out;
}

function replaceMetaContent(html: string, name: string, content: string): string {
  const safe = content.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const named = new RegExp(`(<meta\\s+name=["']${name}["']\\s+content=["'])[^"']*(["']\\s*\\/?>)`, "i");
  const valued = new RegExp(`(<meta\\s+content=["'])[^"']*(["']\\s+name=["']${name}["']\\s*\\/?>)`, "i");
  if (named.test(html)) return html.replace(named, `$1${safe}$2`);
  if (valued.test(html)) return html.replace(valued, `$1${safe}$2`);
  return html;
}

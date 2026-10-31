/**
 * One 1200×630 share card for every page of ui.cuelark.com, rendered by `pnpm og` in content/video
 * and hosted on the assets CDN. `ogPaths()` is what that script renders.
 */
export const OG_IMAGE = "https://assets.cuelark.com/og/ui/index.png";

export function ogPaths(): string[] {
  return ["/"];
}

export function ogImage(_path: string) {
  return OG_IMAGE;
}

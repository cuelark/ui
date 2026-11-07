import { createServerFn } from "@tanstack/react-start";

import { expandQuery } from "./icon-seo";
import { setIdFromSlug, setSlug } from "./icon-slugs";
import { iconWords, type IconIndex, type IconSet, type IconSetMeta } from "./icons";

/** Accepts a readable slug ("lucide") or a react-icons id ("lu"), so old links keep working. */
function resolveSet(index: IconIndex, param: string): IconSetMeta | undefined {
  const id = setIdFromSlug(param) ?? param;
  return index.sets.find((s) => s.id === id);
}

/** Set metadata for /icons/<set>. Icon SVGs load in the browser from /icons/<id>.json. */
export const getIconSet = createServerFn({ method: "GET" })
  .validator((d: { set: string }) => ({ set: String(d.set ?? "").slice(0, 80) }))
  .handler(async ({ data }) => {
    const { readIconAsset } = await import("./icons-asset.server");
    const index = await readIconAsset<IconIndex>("/icons/index.json");
    const meta = resolveSet(index, data.set);
    if (!meta) return null;
    return { meta, setSlug: setSlug(meta.id) };
  });

/** Every set's metadata (no icon data), for the icons hub. */
export const getIconSets = createServerFn({ method: "GET" }).handler(async () => {
  const { readIconAsset } = await import("./icons-asset.server");
  const index = await readIconAsset<IconIndex>("/icons/index.json");
  return index.sets.map((s) => ({ ...s, slug: setSlug(s.id) }));
});

export const SEARCH_PAGE = 240;

/** Server-side icon search for the indexable /icons/search/<term> pages. Ranks whole-word matches first. */
export const searchIcons = createServerFn({ method: "GET" })
  // Bound the work per request: short queries, a few terms, a sane page number.
  .validator((d: { q: string; page: number; set?: string }) => ({
    q: String(d.q ?? "").slice(0, 64),
    page: Math.min(Math.max(1, Math.floor(Number(d.page) || 1)), 500),
    set: d.set ? String(d.set).slice(0, 40) : undefined,
  }))
  .handler(async ({ data }) => {
    const { readIconAsset } = await import("./icons-asset.server");
    const index = await readIconAsset<IconIndex>("/icons/index.json");
    const terms = data.q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6);
    // Each query word may also match its synonyms ("agent" → bot, robot, ai…), as whole words.
    const groups = expandQuery(data.q);
    const onlySet = data.set ? resolveSet(index, data.set)?.id : undefined;
    const hits: { setId: string; at: number; score: number }[] = [];
    const perSet: Record<string, number> = {};
    for (const s of index.sets) {
      const names = index.names[s.id]!;
      for (let at = 0; at < names.length; at++) {
        const words = iconWords(names[at]!, s.id);
        const list = words.split(" ");
        const direct = terms.every((t) => words.includes(t));
        if (!direct && !groups.every((g) => g.some((t) => list.includes(t)))) continue;
        perSet[s.id] = (perSet[s.id] ?? 0) + 1;
        if (onlySet && s.id !== onlySet) continue;
        // Exact name, then whole-word name match, then partial, then synonym-only matches.
        const exact = words === terms.join(" ") ? 0 : terms.every((t) => list.includes(t)) ? 1 : direct ? 2 : 3;
        hits.push({ setId: s.id, at, score: exact * 1000 + list.length });
      }
    }
    hits.sort((a, b) => a.score - b.score);
    const pages = Math.max(1, Math.ceil(hits.length / SEARCH_PAGE));
    const page = Math.min(Math.max(1, data.page), pages);
    const slice = hits.slice((page - 1) * SEARCH_PAGE, page * SEARCH_PAGE);
    const sets = new Map<string, IconSet>();
    for (const id of new Set(slice.map((h) => h.setId))) sets.set(id, await readIconAsset<IconSet>(`/icons/${id}.json`));
    return {
      total: hits.length,
      page,
      pages,
      set: onlySet ? setSlug(onlySet) : undefined,
      bySet: index.sets.filter((s) => perSet[s.id]).map((s) => ({ slug: setSlug(s.id), name: s.name, count: perSet[s.id]! })),
      results: slice.map((h) => {
        const name = index.names[h.setId]![h.at]!;
        return { setId: h.setId, setSlug: setSlug(h.setId), setName: index.sets.find((s) => s.id === h.setId)!.name, name, slug: index.slugs[h.setId]![h.at]!, data: sets.get(h.setId)!.icons[name]! };
      }),
    };
  });

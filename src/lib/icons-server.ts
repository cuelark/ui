import { createServerFn } from "@tanstack/react-start";

import { expandQuery, iconTokens, tokenMatch } from "./icon-seo";
import { representativeIndexes } from "./icon-set-seo";
import { setIdFromSlug, setSlug } from "./icon-slugs";
import { iconWords, type IconData, type IconIndex, type IconSet, type IconSetMeta } from "./icons";

/** Accepts a readable slug ("lucide") or a react-icons id ("lu"), so old links keep working. */
function resolveSet(index: IconIndex, param: string): IconSetMeta | undefined {
  const id = setIdFromSlug(param) ?? param;
  return index.sets.find((s) => s.id === id);
}

export type IconSample = { name: string; slug: string; data: IconData };

/** Set metadata plus a representative grid, so the set page HTML already contains real icons. */
export const getIconSet = createServerFn({ method: "GET" })
  .validator((d: { set: string }) => ({ set: String(d.set ?? "").slice(0, 80) }))
  .handler(async ({ data }) => {
    const { readIconAsset } = await import("./icons-asset.server");
    const index = await readIconAsset<IconIndex>("/icons/index.json");
    const meta = resolveSet(index, data.set);
    if (!meta) return null;
    const set = await readIconAsset<IconSet>(`/icons/${meta.id}.json`);
    const names = index.names[meta.id] ?? [];
    const slugs = index.slugs[meta.id] ?? [];
    const sample: IconSample[] = representativeIndexes(names.map((name) => iconWords(name, meta.id))).flatMap((i) => {
      const name = names[i];
      const data = name ? set.icons[name] : undefined;
      if (!name || !data) return [];
      return [{ name, slug: slugs[i] ?? name, data }];
    });
    return { meta, setSlug: setSlug(meta.id), sample };
  });

/** Every set's metadata (no icon data), for the icons hub. */
export const getIconSets = createServerFn({ method: "GET" }).handler(async () => {
  const { readIconAsset } = await import("./icons-asset.server");
  const index = await readIconAsset<IconIndex>("/icons/index.json");
  return index.sets.map((s) => ({ ...s, slug: setSlug(s.id) }));
});

export const SEARCH_PAGE = 240;

/** Server-side icon search for /icons/search/<term>. Matches whole tokens, then ranks exact names first. */
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
    // Each query word may also match its synonyms ("agent" → bot, robot, ai…), as whole tokens.
    const groups = expandQuery(terms.join(" "));
    const queryTokens = iconTokens(terms.join(" "));
    const onlySet = data.set ? resolveSet(index, data.set)?.id : undefined;
    const hits: { setId: string; at: number; score: number }[] = [];
    const perSet: Record<string, number> = {};
    for (const s of index.sets) {
      const names = index.names[s.id]!;
      for (let at = 0; at < names.length; at++) {
        const list = iconTokens(iconWords(names[at]!, s.id));
        if (groups.length && !groups.every((g) => g.some((t) => tokenMatch(list, t)))) continue;
        perSet[s.id] = (perSet[s.id] ?? 0) + 1;
        if (onlySet && s.id !== onlySet) continue;
        // Exact token sequence, then every query token present, then synonym-only matches.
        const exact = queryTokens.length > 0 && queryTokens.length === list.length && queryTokens.every((t, i) => list[i] === t);
        const whole = queryTokens.length > 0 && queryTokens.every((t) => list.includes(t));
        hits.push({ setId: s.id, at, score: (exact ? 0 : whole ? 1 : 2) * 1000 + list.length });
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

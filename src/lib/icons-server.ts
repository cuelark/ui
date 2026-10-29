import { createServerFn } from "@tanstack/react-start";

import { expandQuery, relatedTerms } from "./icon-seo";
import { setIdFromSlug, setSlug } from "./icon-slugs";
import { iconWords, type IconData, type IconIndex, type IconSet, type IconSetMeta } from "./icons";

export const SET_PAGE = 240;

/** Accepts a readable slug ("lucide") or a react-icons id ("lu"), so old links keep working. */
function resolveSet(index: IconIndex, param: string): IconSetMeta | undefined {
  const id = setIdFromSlug(param) ?? param;
  return index.sets.find((s) => s.id === id);
}

/** Accepts an icon slug ("arrow-right") or a react-icons name ("LuArrowRight"). */
function resolveIcon(index: IconIndex, setId: string, param: string) {
  const names = index.names[setId]!;
  const slugs = index.slugs[setId]!;
  let at = slugs.indexOf(param);
  if (at < 0) at = names.indexOf(param);
  return at < 0 ? null : { name: names[at]!, slug: slugs[at]!, at };
}

/** One page of a set, for the set pages. */
export const getIconSetPage = createServerFn({ method: "GET" })
  .validator((d: { set: string; page: number }) => d)
  .handler(async ({ data }) => {
    const { readIconAsset } = await import("./icons-asset.server");
    const index = await readIconAsset<IconIndex>("/icons/index.json");
    const meta = resolveSet(index, data.set);
    if (!meta) return null;
    const set = await readIconAsset<IconSet>(`/icons/${meta.id}.json`);
    const names = index.names[meta.id]!;
    const slugs = index.slugs[meta.id]!;
    const pages = Math.max(1, Math.ceil(names.length / SET_PAGE));
    const page = Math.min(Math.max(1, data.page), pages);
    const from = (page - 1) * SET_PAGE;
    const icons = names.slice(from, from + SET_PAGE).map((n, i) => ({ name: n, slug: slugs[from + i]!, data: set.icons[n]! }));
    return { meta, setSlug: setSlug(meta.id), page, pages, icons };
  });

/** One icon plus neighbours and the same concept in other sets, for the icon page. */
export const getIconPage = createServerFn({ method: "GET" })
  .validator((d: { set: string; icon: string }) => d)
  .handler(async ({ data }) => {
    const { readIconAsset } = await import("./icons-asset.server");
    const index = await readIconAsset<IconIndex>("/icons/index.json");
    const meta = resolveSet(index, data.set);
    if (!meta) return null;
    const hit = resolveIcon(index, meta.id, data.icon);
    if (!hit) return null;
    const set = await readIconAsset<IconSet>(`/icons/${meta.id}.json`);
    const names = index.names[meta.id]!;
    const slugs = index.slugs[meta.id]!;
    const related = names
      .slice(Math.max(0, hit.at - 8), hit.at + 9)
      .map((n, i) => ({ name: n, slug: slugs[Math.max(0, hit.at - 8) + i]! }))
      .filter((r) => r.name !== hit.name);
    const words = iconWords(hit.name, meta.id);
    const alsoIn = words
      ? index.sets
          .filter((s) => s.id !== meta.id)
          .flatMap((s) => {
            const at = index.names[s.id]!.findIndex((n) => iconWords(n, s.id) === words);
            return at < 0 ? [] : [{ setSlug: setSlug(s.id), setName: s.name, name: index.names[s.id]![at]!, slug: index.slugs[s.id]![at]! }];
          })
          .slice(0, 18)
      : [];
    // Same idea, different name, in this set: a "bot" page also shows robot, ai, brain and sparkle icons.
    // Tier 0: same word (bot-off), tier 1: direct synonyms, tier 2: synonyms of synonyms (ai → sparkles, brain).
    const base = words.split(" ").filter((w) => w.length > 2);
    const aka = relatedTerms(words, 8).filter((t) => !t.includes(" "));
    const second = aka.slice(0, 4).flatMap((t) => relatedTerms(t, 20)).filter((t) => !t.includes(" ") && !aka.includes(t) && !base.includes(t));
    const tier = (list: string[]) => (base.some((t) => list.includes(t)) ? 0 : aka.some((t) => list.includes(t)) ? 1 : second.some((t) => list.includes(t)) ? 2 : 9);
    const alike = names
      .map((n, i) => ({ n, i, t: tier(iconWords(n, meta.id).split(" ")) }))
      // Neighbours in the set are already shown below; prefer icons the visitor would not otherwise see.
      .filter((x) => x.n !== hit.name && x.t < 9 && !related.some((r) => r.name === x.n))
      .sort((x, y) => x.t - y.t)
      .slice(0, 16)
      .map((x) => ({ name: x.n, slug: slugs[x.i]! }));
    return { meta, setSlug: setSlug(meta.id), name: hit.name, slug: hit.slug, words, aka: relatedTerms(words, 8), icon: set.icons[hit.name]! as IconData, related, alsoIn, alike };
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
        return { setSlug: setSlug(h.setId), setName: index.sets.find((s) => s.id === h.setId)!.name, name, slug: index.slugs[h.setId]![h.at]!, data: sets.get(h.setId)!.icons[name]! };
      }),
    };
  });

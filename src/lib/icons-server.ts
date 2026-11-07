import { createServerFn } from "@tanstack/react-start";

import { describeSet, exampleIconName, previewIndexes, setUsageSource, whenToPick } from "./icon-set-facts";
import { iconQueryParts, rankIconWords } from "./icon-seo";
import { setIdFromSlug, setSlug } from "./icon-slugs";
import { iconTitle, iconWords, type IconIndex, type IconSet, type IconSetMeta } from "./icons";

/** Accepts a readable slug ("lucide") or a react-icons id ("lu"), so old links keep working. */
function resolveSet(index: IconIndex, param: string): IconSetMeta | undefined {
  const id = setIdFromSlug(param) ?? param;
  return index.sets.find((s) => s.id === id);
}

/** Set metadata, a server-rendered sample, and the install example for /icons/<set>. */
export const getIconSet = createServerFn({ method: "GET" })
  .validator((d: { set: string }) => ({ set: String(d.set ?? "").slice(0, 80) }))
  .handler(async ({ data }) => {
    const { readIconAsset } = await import("./icons-asset.server");
    const index = await readIconAsset<IconIndex>("/icons/index.json");
    const meta = resolveSet(index, data.set);
    if (!meta) return null;
    const names = index.names[meta.id] ?? [];
    const slugs = index.slugs[meta.id] ?? [];
    const file = await readIconAsset<IconSet>(`/icons/${meta.id}.json`);
    const order = names.map((name, i) => ({ name, slug: slugs[i] ?? "", title: iconTitle(name, meta.id) }));
    order.sort((a, b) => a.title.localeCompare(b.title, "en"));
    const preview = previewIndexes(order.length).flatMap((i) => {
      const item = order[i];
      const icon = item ? file.icons[item.name] : undefined;
      return item && icon ? [{ name: item.name, slug: item.slug, data: icon }] : [];
    });
    const example = exampleIconName(names, meta.id);
    return {
      meta,
      setSlug: setSlug(meta.id),
      preview,
      about: describeSet(meta),
      choice: whenToPick(meta, index.sets),
      install: "npm install react-icons",
      usage: example ? setUsageSource(meta.id, example) : "",
    };
  });

/** Every set's metadata (no icon data), for the icons hub. */
export const getIconSets = createServerFn({ method: "GET" }).handler(async () => {
  const { readIconAsset } = await import("./icons-asset.server");
  const index = await readIconAsset<IconIndex>("/icons/index.json");
  return index.sets.map((s) => ({ ...s, slug: setSlug(s.id) }));
});

export const SEARCH_PAGE = 240;

/** Server-side icon search for /icons/search/<term>. Matches whole tokens in the name, including synonym tokens. */
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
    const parts = iconQueryParts(data.q);
    const terms = parts.terms.slice(0, 6);
    const groups = parts.groups.slice(0, 6);
    const onlySet = data.set ? resolveSet(index, data.set)?.id : undefined;
    const hits: { setId: string; at: number; score: number }[] = [];
    const perSet: Record<string, number> = {};
    for (const s of index.sets) {
      const names = index.names[s.id]!;
      for (let at = 0; at < names.length; at++) {
        const score = rankIconWords(iconWords(names[at]!, s.id), terms, groups);
        if (score === null) continue;
        perSet[s.id] = (perSet[s.id] ?? 0) + 1;
        if (onlySet && s.id !== onlySet) continue;
        hits.push({ setId: s.id, at, score });
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

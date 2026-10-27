import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon, SearchIcon, XIcon } from "lucide-react";

import { SITE } from "@/content/site";
import { IconLicense } from "./icon-license";
import { expandQuery, relatedTerms } from "@/lib/icon-seo";
import { kebab, setSlug } from "@/lib/icon-slugs";
import { animatedIconComponentSource, formatMarkup, iconComponentSource, iconTitle, iconWords, loadIconIndex, loadIconSet, svgMarkup, type IconData, type IconIndex, type IconSet, type IconSetMeta } from "@/lib/icons";
import { AnimatedIcon, ANIMATIONS, animationFor, type IconAnimation } from "@/registry/cuelark/ui/animated-icon";
import { CopyButton } from "@/registry/cuelark/ui/copy-button";
import { Input } from "@/registry/cuelark/ui/input";
import { cn } from "@/lib/utils";

type Selected = { set: IconSetMeta; name: string; slug: string; data: IconData };
const GROUP_LIMIT = 96;
const PAGE = 240;

/** Every icon from every react-icons set, searchable, animatable and installable. */
export function IconExplorer({ initialSet }: { initialSet?: string }) {
  const [index, setIndex] = React.useState<IconIndex | null>(null);
  const [query, setQuery] = React.useState("");
  const [setFilter, setSetFilter] = React.useState(initialSet ?? "all");
  const [animation, setAnimation] = React.useState<IconAnimation | "off">("off");
  const [selected, setSelected] = React.useState<Selected | null>(null);
  const deferred = React.useDeferredValue(query);

  React.useEffect(() => {
    void loadIconIndex().then(setIndex);
  }, []);

  // Pre-split names into words once: "FaArrowRight" → "arrow right".
  const words = React.useMemo(() => {
    if (!index) return null;
    return Object.fromEntries(index.sets.map((s) => [s.id, index.names[s.id]!.map((n) => `${iconWords(n, s.id)} ${n.toLowerCase()}`)]));
  }, [index]);

  const results = React.useMemo(() => {
    if (!index || !words) return [];
    const terms = deferred.toLowerCase().split(/\s+/).filter(Boolean);
    const groups = expandQuery(deferred);
    const hit = (w: string) => terms.every((t) => w.includes(t)) || groups.every((g) => g.some((t) => ` ${w} `.includes(` ${t} `)));
    return index.sets
      .filter((s) => setFilter === "all" || s.id === setFilter)
      .map((s) => {
        const all = index.names[s.id]!;
        const keep = terms.length ? all.flatMap((_, i) => (hit(words[s.id]![i]!) ? [i] : [])) : all.map((_, i) => i);
        return { set: s, names: keep.map((i) => all[i]!), slugs: keep.map((i) => index.slugs[s.id]![i]!) };
      })
      .filter((g) => g.names.length);
  }, [index, words, deferred, setFilter]);
  const total = results.reduce((n, g) => n + g.names.length, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="grid min-w-0 content-start gap-5">
        <div className="sticky top-14 z-20 -mx-1 grid gap-3 border-b border-border bg-background/90 px-1 pt-3 pb-3 backdrop-blur-md">
          <Input
            size="lg"
            aria-label="Search icons"
            placeholder={index ? `Search ${index.sets.reduce((n, s) => n + s.count, 0).toLocaleString()} icons: arrow, user, github, chart…` : "Loading icons…"}
            leading={<SearchIcon />}
            trailing={deferred ? <span className="font-mono text-xs tabular-nums">{total.toLocaleString()}</span> : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Set</span>
              <select
                value={setFilter}
                onChange={(e) => setSetFilter(e.target.value)}
                className="h-8 rounded-lg border border-input bg-card px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <option value="all">All sets ({index?.sets.length ?? 31})</option>
                {index?.sets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.count.toLocaleString()}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="shrink-0 text-sm text-muted-foreground">Hover</span>
              <div role="radiogroup" aria-label="Hover animation" className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
                {(["off", ...ANIMATIONS] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    role="radio"
                    aria-checked={animation === a}
                    onClick={() => setAnimation(a)}
                    className="h-7 rounded-full border border-transparent px-2.5 text-xs whitespace-nowrap text-muted-foreground capitalize hover:bg-muted aria-checked:border-border aria-checked:bg-card aria-checked:text-foreground aria-checked:shadow-control"
                  >
                    {a === "off" ? "Off" : a === "auto" ? "✦ Smart" : a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {deferred.trim() && relatedTerms(deferred, 6).length > 0 && (
          <p className="text-xs text-muted-foreground">
            Also matching: {relatedTerms(deferred, 6).join(", ")}
          </p>
        )}
        {deferred.trim() && total > 0 && (
          <Link
            to="/icons/search/$query"
            params={{ query: kebab(deferred) }}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium shadow-control hover:bg-muted"
          >
            Open all {total.toLocaleString()} “{deferred.trim()}” icons <ArrowUpRightIcon className="size-3.5" />
          </Link>
        )}
        {!index && <IconGridSkeleton />}
        {index && !results.length && <p className="py-16 text-center text-muted-foreground">No icons match “{deferred}”. Try a broader word.</p>}
        {results.map((g) => (
          <IconGroup
            key={`${g.set.id}-${setFilter}-${deferred}`}
            set={g.set}
            names={g.names}
            slugs={g.slugs}
            limit={setFilter === "all" ? GROUP_LIMIT : PAGE}
            paged={setFilter !== "all"}
            animation={animation}
            selected={selected}
            onSelect={setSelected}
            onShowAll={() => setSetFilter(g.set.id)}
          />
        ))}
      </div>
      <IconDetail selected={selected} animation={animation} onClose={() => setSelected(null)} />
    </div>
  );
}

function IconGroup({
  set,
  names,
  slugs,
  limit,
  paged,
  animation,
  selected,
  onSelect,
  onShowAll,
}: {
  set: IconSetMeta;
  names: string[];
  slugs: string[];
  limit: number;
  paged: boolean;
  animation: IconAnimation | "off";
  selected: Selected | null;
  onSelect: (s: Selected) => void;
  onShowAll: () => void;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [data, setData] = React.useState<IconSet | null>(null);
  const [shown, setShown] = React.useState(limit);

  // Load the set's SVGs only when the group nears the viewport.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        void loadIconSet(set.id).then(setData);
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [set.id]);

  const visible = names.slice(0, shown);
  return (
    <section ref={ref} aria-labelledby={`set-${set.id}`} className="grid gap-3">
      <div className="flex items-baseline gap-3">
        <h2 id={`set-${set.id}`} className="font-semibold tracking-tight">
          <Link to="/icons/$set" params={{ set: setSlug(set.id) }} className="hover:underline">
            {set.name}
          </Link>
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{names.length.toLocaleString()}</span>
        <IconLicense set={set} compact className="hidden sm:inline-flex" />
        {!paged && names.length > limit && (
          <button type="button" onClick={onShowAll} className="ms-auto text-xs font-medium text-muted-foreground hover:text-foreground">
            Show all →
          </button>
        )}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-1.5">
        {visible.map((name, idx) => {
          const icon = data?.icons[name];
          const active = selected?.set.id === set.id && selected.name === name;
          return (
            <li key={name}>
              <button
                type="button"
                title={name}
                aria-label={`${iconWords(name, set.id)} (${name})`}
                aria-pressed={active}
                onClick={() => icon && onSelect({ set, name, slug: slugs[idx]!, data: icon })}
                className={cn(
                  "grid aspect-square w-full place-items-center rounded-xl border border-transparent text-[1.375rem] text-foreground/85 outline-none transition-colors hover:border-border hover:bg-card hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                  active && "border-primary/40 bg-primary/10 text-primary",
                )}
              >
                {icon ? (
                  animation === "off" ? (
                    <span className="inline-flex" dangerouslySetInnerHTML={{ __html: svgMarkup(icon) }} />
                  ) : (
                    <AnimatedIcon animation={animation} name={name} trigger="hover">
                      <span className="contents" dangerouslySetInnerHTML={{ __html: svgMarkup(icon) }} />
                    </AnimatedIcon>
                  )
                ) : (
                  <span className="size-5 animate-pulse rounded-md bg-muted" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {paged && names.length > shown && (
        <button type="button" onClick={() => setShown((n) => n + PAGE)} className="mx-auto h-9 rounded-full border border-border bg-card px-4 text-sm font-medium shadow-control hover:bg-muted">
          Load {Math.min(PAGE, names.length - shown)} more
        </button>
      )}
    </section>
  );
}

function IconGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-1.5">
      {Array.from({ length: 64 }, (_, i) => (
        <span key={i} className="aspect-square animate-pulse rounded-xl bg-muted/60" />
      ))}
    </div>
  );
}

/** Selected icon: a clean side panel with a preview, one-click copies and install commands. */
function IconDetail({ selected, animation: picked, onClose }: { selected: Selected | null; animation: IconAnimation | "off"; onClose: () => void }) {
  const animation: IconAnimation = picked === "off" ? "auto" : picked;
  return (
    <aside aria-label="Icon details" className={cn("min-w-0 lg:sticky lg:top-20 lg:self-start", !selected && "hidden lg:block")}>
      <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-raised max-lg:fixed max-lg:inset-x-3 max-lg:bottom-3 max-lg:z-40 max-lg:max-h-[75dvh] lg:max-h-[calc(100dvh-6rem)]">
        {selected ? (
          <Detail key={`${selected.set.id}/${selected.name}`} selected={selected} animation={animation} onClose={onClose} />
        ) : (
          <div className="grid place-items-center gap-2 px-6 py-16 text-center">
            <SearchIcon className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Select an icon to preview and copy it.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function Detail({ selected, animation, onClose }: { selected: Selected; animation: IconAnimation; onClose: () => void }) {
  const { set, name, slug, data } = selected;
  const resolved = animation === "auto" ? animationFor(name) : animation;
  const base = `${SITE.url}/r/icons/${setSlug(set.id)}/${slug}`;
  const jsx = `import { ${name} } from "react-icons/${set.id}";\n\n<${name} className="size-5" />`;
  const [tab, setTab] = React.useState<"static" | "animated">("static");
  const install = tab === "static" ? `npx shadcn@latest add ${base}.json` : `npx shadcn@latest add ${base}-animated.json`;
  const code = tab === "static" ? iconComponentSource(name, set, data) : animatedIconComponentSource(name, set, data, resolved);

  return (
    <>
      {/* Header */}
      <div className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-3">
        <div className="grid min-w-0 flex-1 gap-0.5">
          <Link to="/icons/$set/$icon" params={{ set: setSlug(set.id), icon: slug }} className="truncate text-sm font-semibold hover:underline">
            {iconTitle(name, set.id)}
          </Link>
          <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">
            {name} · {set.name}
          </span>
        </div>
        <Link
          to="/icons/$set/$icon"
          params={{ set: setSlug(set.id), icon: slug }}
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-border px-2.5 text-xs font-medium hover:bg-muted"
        >
          Page <ArrowUpRightIcon className="size-3" />
        </Link>
        <button type="button" onClick={onClose} aria-label="Close" className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden">
          <XIcon className="size-4" />
        </button>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain p-4">
        {/* Preview: still until hovered */}
        <div className="relative grid h-36 shrink-0 place-items-center rounded-xl border border-border bg-background text-6xl">
          <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" />
          <AnimatedIcon animation={animation} name={name} trigger="hover" className="relative cursor-pointer">
            <span className="contents" dangerouslySetInnerHTML={{ __html: svgMarkup(data) }} />
          </AnimatedIcon>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[0.625rem] text-muted-foreground">Hover · {resolved}</span>
        </div>

        {/* One-click actions */}
        <div className="grid shrink-0 grid-cols-3 gap-2">
          <QuickCopy label="Copy JSX" value={jsx} />
          <QuickCopy label="Copy SVG" value={formatMarkup(svgMarkup(data))} />
          <a
            href={`/r/icons/${setSlug(set.id)}/${slug}.svg`}
            download={`${slug}.svg`}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background text-xs font-medium transition-colors hover:bg-muted"
          >
            Download
          </a>
        </div>

        {/* Static / animated component */}
        <div className="grid min-w-0 shrink-0 grid-cols-1 gap-2">
          <div role="tablist" aria-label="Version" className="grid grid-cols-2 rounded-lg bg-muted p-0.5 text-xs font-medium">
            {(["static", "animated"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className="h-7 rounded-md capitalize text-muted-foreground transition-colors aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-control"
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background py-1 ps-3 pe-1">
            <code className="min-w-0 flex-1 truncate font-mono text-[0.6875rem] text-muted-foreground" title={install}>
              {install}
            </code>
            <CopyButton value={install} aria-label="Copy install command" />
          </div>
          <div className="relative min-w-0">
            <div className="absolute end-1.5 top-1.5 z-10">
              <CopyButton value={code} aria-label="Copy component" className="bg-background/80 backdrop-blur" />
            </div>
            <pre className="max-h-56 w-full overflow-auto rounded-lg border border-border bg-background p-3 pe-10 font-mono text-[0.6875rem] leading-relaxed">{code}</pre>
          </div>
        </div>

        <IconLicense set={set} compact className="shrink-0" />
      </div>
    </>
  );
}

function QuickCopy({ label, value }: { label: string; value: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background text-xs font-medium transition-colors hover:bg-muted"
    >
      {done ? "Copied" : label}
    </button>
  );
}


import * as React from "react";
import { CheckIcon, ChevronDownIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { PRESETS, scopedThemeStyle, themeTokens, type SiteTheme } from "@/lib/site-theme";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/registry/cuelark/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type ScopeMode = "site" | "light" | "dark";

/**
 * Themes one subtree only: its palette, face, weights, radius and density as inline custom properties, plus the
 * `light` / `dark` class so `dark:` styles follow it even inside a page in the other mode. `theme` null = the site's.
 */
export function ThemeScope({ theme, mode = "site", className, style, children, ...props }: React.ComponentProps<"div"> & { theme: SiteTheme | null; mode?: ScopeMode }) {
  const siteDark = useSiteDark();
  const resolved = mode === "site" ? (siteDark ? "dark" : "light") : mode;
  return (
    <div
      data-theme-scope={theme ? "preset" : "site"}
      className={cn(mode !== "site" && mode, theme && "bg-background font-sans text-foreground", className)}
      style={{ ...(theme ? { ...scopedThemeStyle(theme, resolved), fontFamily: "var(--cl-font-sans)", letterSpacing: "var(--cl-tracking)" } : {}), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

/** Whether the site is currently in dark mode (the `dark` class on <html>), kept in sync. */
export function useSiteDark() {
  return React.useSyncExternalStore(
    (cb) => {
      const o = new MutationObserver(cb);
      o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => o.disconnect();
    },
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
}

/* ---------- The preview theme: one choice shared by every preview on the site, remembered per browser. ---------- */

type PreviewTheme = { preset: string | null; mode: ScopeMode };
const KEY = "cuelark-preview-theme";
let state: PreviewTheme = { preset: null, mode: "site" };
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as PreviewTheme | null;
    if (saved && (saved.preset === null || PRESETS.some((p) => p.name === saved.preset))) state = saved;
  } catch {
    /* ignore corrupt storage */
  }
}

export function setPreviewTheme(patch: Partial<PreviewTheme>) {
  load();
  state = { ...state, ...patch };
  localStorage.setItem(KEY, JSON.stringify(state));
  subs.forEach((s) => s());
}

const SSR_STATE: PreviewTheme = { preset: null, mode: "site" };
export function usePreviewTheme() {
  const value = React.useSyncExternalStore(
    (cb) => {
      load();
      subs.add(cb);
      queueMicrotask(cb);
      return () => subs.delete(cb);
    },
    () => (load(), state),
    () => SSR_STATE,
  );
  return { ...value, theme: value.preset ? (PRESETS.find((p) => p.name === value.preset)?.theme ?? null) : null };
}

/** A palette swatch: background, primary and signal of a theme. */
export function Swatch({ theme, className }: { theme: SiteTheme; className?: string }) {
  const t = themeTokens(theme).light;
  return (
    <span aria-hidden="true" className={cn("inline-flex size-4 shrink-0 overflow-hidden rounded-full ring-1 ring-border", className)}>
      <span className="flex-1" style={{ background: t.background }} />
      <span className="flex-1" style={{ background: t.primary }} />
      <span className="flex-1" style={{ background: t.signal }} />
    </span>
  );
}

/** Theme + mode picker for previews: a compact menu of every preset and a three-way light / dark / site switch. */
export function PreviewThemePicker({ className }: { className?: string }) {
  const { preset, mode, theme } = usePreviewTheme();
  const modes = [
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
    { value: "site", label: "Match site", icon: MonitorIcon },
  ] as const;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-ctl-xs max-w-40 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted">
          {theme ? <Swatch theme={theme} className="size-3.5" /> : <span aria-hidden="true" className="size-3.5 rounded-full border border-dashed border-muted-foreground/50" />}
          <span className="truncate">{preset ?? "Site theme"}</span>
          <ChevronDownIcon className="size-3 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-80 w-56 overflow-y-auto">
          <DropdownMenuLabel>Preview theme</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setPreviewTheme({ preset: null })}>
            <span aria-hidden="true" className="size-4 rounded-full border border-dashed border-muted-foreground/50" />
            Site theme
            {preset === null && <CheckIcon className="ms-auto" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {PRESETS.map((p) => (
            <DropdownMenuItem key={p.name} onSelect={() => setPreviewTheme({ preset: p.name })}>
              <Swatch theme={p.theme} />
              {p.name}
              {preset === p.name && <CheckIcon className="ms-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div role="radiogroup" aria-label="Preview mode" className="flex items-center rounded-md bg-muted/60 p-0.5">
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={mode === m.value}
            aria-label={m.label}
            title={m.label}
            onClick={() => setPreviewTheme({ mode: m.value })}
            className="relative grid size-6 place-items-center rounded-[5px] text-muted-foreground outline-none after:absolute after:-inset-1 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-checked:bg-background aria-checked:text-foreground aria-checked:shadow-control [&_svg]:size-3.5"
          >
            <m.icon />
          </button>
        ))}
      </div>
    </div>
  );
}

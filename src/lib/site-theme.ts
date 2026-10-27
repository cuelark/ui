/**
 * The docs site's live theme: one tiny store shared by the header customizer and the theme editor page.
 * Changes apply instantly site-wide (a <style id="cue-theme"> override) and persist in localStorage;
 * the boot script in <head> re-applies the saved CSS before first paint, so there is no flash.
 */
import * as React from "react";

export type SiteTheme = { base: string; signal: string; hue: number; radius: number; density: number; marks: boolean; motion: number; font: string; textSize: number; tracking: number;
  /** "signal": primary buttons wear the accent color. "ink": primary stays monochrome and the accent is reserved for feedback. */
  fill: "signal" | "ink";
};

/** Open-source faces. Geist is Vercel's typeface; Inter is what Linear builds on; Stripe's Söhne is commercial, so the closest open alternatives are offered instead. */
export const FONTS = [
  { name: "Inter", family: '"Inter Variable"', note: "Linear, Figma" },
  { name: "Geist", family: '"Geist Variable"', note: "Vercel" },
  { name: "Inter Tight", family: '"Inter Tight Variable"', note: "Dense UI" },
  { name: "Instrument Sans", family: '"Instrument Sans Variable"', note: "Editorial, Söhne-like" },
  { name: "IBM Plex Sans", family: '"IBM Plex Sans Variable"', note: "Technical" },
  { name: "DM Sans", family: '"DM Sans Variable"', note: "Friendly" },
  { name: "Manrope", family: '"Manrope Variable"', note: "Geometric" },
  { name: "Plus Jakarta Sans", family: '"Plus Jakarta Sans Variable"', note: "Soft SaaS" },
  { name: "Space Grotesk", family: '"Space Grotesk Variable"', note: "Techy" },
  { name: "Bricolage Grotesque", family: '"Bricolage Grotesque Variable"', note: "Expressive" },
];
export const fontStack = (name: string) => `${(FONTS.find((f) => f.name === name) ?? FONTS[0]!).family}, ui-sans-serif, system-ui, sans-serif`;

export const BASES = [
  { name: "Mist", hue: 255, chroma: 0.014 },
  { name: "Paper", hue: 80, chroma: 0.008 },
  { name: "Neutral", hue: 0, chroma: 0 },
  { name: "Zinc", hue: 286, chroma: 0.006 },
  { name: "Slate", hue: 257, chroma: 0.014 },
];

export const SIGNALS = [
  { name: "Cobalt", l: 0.55, c: 0.23, hue: 264 },
  { name: "Chartreuse", l: 0.88, c: 0.2, hue: 127 },
  { name: "Electric", l: 0.66, c: 0.21, hue: 258 },
  { name: "Violet", l: 0.64, c: 0.22, hue: 295 },
  { name: "Coral", l: 0.7, c: 0.18, hue: 32 },
  { name: "Mint", l: 0.84, c: 0.14, hue: 168 },
  { name: "Ink", l: 0, c: 0, hue: 0 },
];

export const DEFAULT_THEME: SiteTheme = { base: "Mist", signal: "Cobalt", hue: 264, radius: 0.75, density: 1, marks: true, motion: 1, font: "Inter", textSize: 1, tracking: 0, fill: "signal" };
const INK = { fill: "ink" as const };

/** Curated, copy-ready themes. */
export const PRESETS: { name: string; description: string; theme: SiteTheme }[] = [
  { name: "Cobalt", description: "Cool mist, vivid cobalt buttons, Inter. The default.", theme: DEFAULT_THEME },
  { name: "Paper", description: "Warm paper, ink buttons and a chartreuse signal.", theme: { ...DEFAULT_THEME, ...INK, base: "Paper", signal: "Chartreuse", hue: 127, radius: 0.625 } },
  { name: "Mono", description: "Pure neutral, ink accents, Geist. Quiet and exact.", theme: { ...DEFAULT_THEME, ...INK, base: "Neutral", signal: "Ink", hue: 0, radius: 0.5, font: "Geist", marks: false } },
  { name: "Atelier", description: "Paper with violet, editorial type, generous corners.", theme: { ...DEFAULT_THEME, base: "Paper", signal: "Violet", hue: 295, radius: 1, font: "Instrument Sans" } },
  { name: "Terminal", description: "Square corners, compact, mint signal, Space Grotesk.", theme: { ...DEFAULT_THEME, ...INK, base: "Zinc", signal: "Mint", hue: 168, radius: 0, density: 0.875, font: "Space Grotesk", textSize: 0.9375 } },
  { name: "Studio", description: "Zinc, coral buttons, soft SaaS type, roomy.", theme: { ...DEFAULT_THEME, base: "Zinc", signal: "Coral", hue: 32, radius: 0.875, density: 1.125, font: "Plus Jakarta Sans", textSize: 1.0625 } },
];

/** A random but coherent theme: any base, a vivid signal hue, a radius and a face that suit each other. */
export function randomTheme(): SiteTheme {
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]!;
  const signal = pick(SIGNALS.filter((x) => x.c > 0));
  return {
    ...DEFAULT_THEME,
    base: pick(BASES).name,
    signal: signal.name,
    hue: Math.random() < 0.5 ? signal.hue : Math.round(Math.random() * 360),
    radius: pick([0, 0.375, 0.625, 0.875, 1.25]),
    density: pick([0.875, 1, 1, 1.125]),
    font: pick(FONTS).name,
    fill: Math.random() > 0.4 ? "signal" : "ink",
    marks: Math.random() > 0.3,
    tracking: pick([-0.015, 0, 0, 0.015]),
  };
}

const fmt = (n: number) => Number(n.toFixed(3));

export function themeTokens(theme: SiteTheme) {
  const b = BASES.find((x) => x.name === theme.base) ?? BASES[0]!;
  const g = (l: number, k = 1) => `oklch(${l} ${fmt(b.chroma * k)} ${b.hue})`;
  const preset = SIGNALS.find((x) => x.name === theme.signal);
  const ink = preset?.c === 0;
  const sl = preset?.l ?? 0.7;
  const sc = preset?.c ?? 0.19;
  const signal = ink ? g(0.2, 1.5) : `oklch(${sl} ${sc} ${theme.hue})`;
  const onSignal = ink ? g(0.985, 0.5) : sl > 0.75 ? `oklch(0.22 0.05 ${theme.hue})` : "oklch(0.99 0 0)";
  // On dark surfaces a deep accent loses contrast, so lift it.
  const darkSignal = ink ? g(0.955, 0.8) : `oklch(${fmt(Math.max(sl, 0.64))} ${sc} ${theme.hue})`;
  const onDarkSignal = ink ? g(0.18, 1.5) : Math.max(sl, 0.64) > 0.75 ? `oklch(0.2 0.05 ${theme.hue})` : "oklch(0.99 0 0)";
  const filled = theme.fill === "signal" && !ink;
  return {
    light: {
      background: g(0.985, 0.5),
      foreground: g(0.18, 1.5),
      card: g(0.997, 0.25),
      "card-foreground": g(0.18, 1.5),
      popover: g(0.997, 0.25),
      "popover-foreground": g(0.18, 1.5),
      primary: filled ? signal : g(0.2, 1.5),
      "primary-foreground": filled ? onSignal : g(0.985, 0.5),
      secondary: g(0.955, 0.75),
      "secondary-foreground": g(0.2, 1.5),
      muted: g(0.955, 0.75),
      "muted-foreground": g(0.52, 1.5),
      accent: g(0.945),
      "accent-foreground": g(0.2, 1.5),
      border: g(0.905),
      input: g(0.885),
      ring: ink ? g(0.55, 1.5) : `oklch(${fmt(Math.min(sl, 0.65))} ${sc} ${theme.hue})`,
      signal,
      "signal-foreground": onSignal,
      "cl-mark": g(0.68),
    },
    dark: {
      background: g(0.155),
      foreground: g(0.965, 0.75),
      card: g(0.185),
      "card-foreground": g(0.965, 0.75),
      popover: g(0.205),
      "popover-foreground": g(0.965, 0.75),
      primary: filled ? darkSignal : g(0.955, 0.75),
      "primary-foreground": filled ? onDarkSignal : g(0.18, 1.5),
      secondary: g(0.25),
      "secondary-foreground": g(0.965, 0.75),
      muted: g(0.25),
      "muted-foreground": g(0.7, 1.25),
      accent: g(0.265),
      "accent-foreground": g(0.965, 0.75),
      border: "oklch(1 0 0 / 0.09)",
      input: "oklch(1 0 0 / 0.14)",
      ring: darkSignal,
      signal: darkSignal,
      "signal-foreground": onDarkSignal,
      "cl-mark": g(0.55),
    },
  };
}

/** `boost` raises specificity (html:root / html.dark) so a live override wins regardless of stylesheet order. */
export function themeCss(theme: SiteTheme, boost = false) {
  const { light, dark } = themeTokens(theme);
  const block = (sel: string, vars: Record<string, string | number>) => `${sel} {\n${Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`).join("\n")}\n}`;
  return [block(boost ? "html:root" : ":root", { ...light, "cl-font-sans": fontStack(theme.font), "cl-text-size": theme.textSize, "cl-tracking": `${theme.tracking}em`, radius: `${theme.radius}rem`, "cl-density": theme.density, "cl-marks": theme.marks ? 1 : 0, "cl-motion": theme.motion }), block(boost ? "html.dark" : ".dark", dark)].join("\n\n");
}

const KEY = "cuelark-theme";
const CSS_KEY = "cuelark-theme-css";
let current = DEFAULT_THEME;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) current = { ...DEFAULT_THEME, ...JSON.parse(saved) };
  } catch {
    /* ignore corrupt storage */
  }
}

/**
 * The override lives in a constructed stylesheet (document.adoptedStyleSheets): React never owns it, so hydration
 * and client navigation cannot remove it, and adopted sheets cascade after the page's own CSS.
 */
function sheet() {
  const w = window as unknown as { __cueSheet?: CSSStyleSheet };
  if (!w.__cueSheet) {
    w.__cueSheet = new CSSStyleSheet();
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, w.__cueSheet];
  }
  return w.__cueSheet;
}

function apply() {
  const isDefault = JSON.stringify(current) === JSON.stringify(DEFAULT_THEME);
  if (isDefault) {
    sheet().replaceSync("");
    localStorage.removeItem(KEY);
    localStorage.removeItem(CSS_KEY);
    return;
  }
  const css = themeCss(current, true);
  sheet().replaceSync(css);
  localStorage.setItem(KEY, JSON.stringify(current));
  localStorage.setItem(CSS_KEY, css);
}

export function setSiteTheme(patch: Partial<SiteTheme>) {
  load();
  current = { ...current, ...patch };
  apply();
  listeners.forEach((l) => l());
}

export function applyPreset(theme: SiteTheme) {
  setSiteTheme(theme);
}

export function resetSiteTheme() {
  setSiteTheme(DEFAULT_THEME);
}

export function useSiteTheme() {
  return React.useSyncExternalStore(
    (l) => {
      load();
      listeners.add(l);
      queueMicrotask(l);
      return () => listeners.delete(l);
    },
    () => (load(), current),
    () => DEFAULT_THEME,
  );
}

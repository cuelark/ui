/**
 * The docs site's live theme: one tiny store shared by the header customizer and the theme editor page.
 * Changes apply instantly site-wide (a <style id="cue-theme"> override) and persist in localStorage;
 * the boot script in <head> re-applies the saved CSS before first paint, so there is no flash.
 */
import * as React from "react";

export type SiteTheme = { base: string; signal: string; hue: number; radius: number; density: number; marks: boolean; motion: number; font: string; textSize: number; tracking: number;
  /** "signal": primary buttons wear the accent color. "ink": primary stays monochrome and the accent is reserved for feedback. */
  fill: "signal" | "ink";
  /** A brand palette from BRANDS: exact colors that replace the generated ones. Cleared when you edit base or signal. */
  brand?: string;
};

type Tokens = Record<string, string>;
/**
 * Brand palettes, measured from each product's own stylesheet (Linear's tokens, Stripe's navy and blurple, Vercel's
 * Geist greys…). The generator gets close; these are exact. `vars` holds extras such as Linear's 510/590 weights.
 */
export const BRANDS: Record<string, { light: Tokens; dark: Tokens; vars?: Tokens }> = {
  linear: {
    light: { background: "#f9f8f9", foreground: "#282a30", card: "#ffffff", "card-foreground": "#282a30", popover: "#ffffff", "popover-foreground": "#282a30", primary: "#5e6ad2", "primary-foreground": "#ffffff", secondary: "#f1f0f2", "secondary-foreground": "#282a30", muted: "#f1f0f2", "muted-foreground": "#6f6e77", accent: "#eeedef", "accent-foreground": "#282a30", border: "#e9e8ea", input: "#dcdbdd", ring: "#7170ff", signal: "#5e6ad2", "signal-foreground": "#ffffff", "cl-mark": "#d4d4d6", "cl-shade": "rgb(0 0 0 / 0.07)" },
    dark: { background: "#08090a", foreground: "#f7f8f8", card: "#0f1011", "card-foreground": "#f7f8f8", popover: "#141516", "popover-foreground": "#f7f8f8", primary: "#5e6ad2", "primary-foreground": "#ffffff", secondary: "#1c1c1f", "secondary-foreground": "#f7f8f8", muted: "#1c1c1f", "muted-foreground": "#8a8f98", accent: "#232326", "accent-foreground": "#f7f8f8", border: "#23252a", input: "#34343a", ring: "#7170ff", signal: "#7170ff", "signal-foreground": "#ffffff", "cl-mark": "#3e3e44", "cl-shade": "rgb(0 0 0 / 0.5)" },
    vars: { "font-weight-medium": "510", "font-weight-semibold": "590" },
  },
  stripe: {
    light: { background: "#f6f9fc", foreground: "#0a2540", card: "#ffffff", "card-foreground": "#0a2540", popover: "#ffffff", "popover-foreground": "#0a2540", primary: "#635bff", "primary-foreground": "#ffffff", secondary: "#eef2f7", "secondary-foreground": "#0a2540", muted: "#eef2f7", "muted-foreground": "#425466", accent: "#e6ebf1", "accent-foreground": "#0a2540", border: "#e3e8ee", input: "#d5dbe4", ring: "#635bff", signal: "#635bff", "signal-foreground": "#ffffff", "cl-mark": "#c1c9d2", "cl-shade": "rgb(50 50 93 / 0.12)" },
    dark: { background: "#0a1628", foreground: "#f6f9fc", card: "#10213a", "card-foreground": "#f6f9fc", popover: "#142847", "popover-foreground": "#f6f9fc", primary: "#7a73ff", "primary-foreground": "#ffffff", secondary: "#1a2f4d", "secondary-foreground": "#f6f9fc", muted: "#1a2f4d", "muted-foreground": "#a3b1c6", accent: "#1f3657", "accent-foreground": "#f6f9fc", border: "#24395a", input: "#2c4468", ring: "#7a73ff", signal: "#7a73ff", "signal-foreground": "#ffffff", "cl-mark": "#3a5175", "cl-shade": "rgb(0 0 0 / 0.45)" },
  },
  vercel: {
    light: { background: "#fafafa", foreground: "#171717", card: "#ffffff", "card-foreground": "#171717", popover: "#ffffff", "popover-foreground": "#171717", primary: "#171717", "primary-foreground": "#ffffff", secondary: "#f2f2f2", "secondary-foreground": "#171717", muted: "#f2f2f2", "muted-foreground": "#666666", accent: "#ebebeb", "accent-foreground": "#171717", border: "#ebebeb", input: "#e0e0e0", ring: "#006bff", signal: "#006bff", "signal-foreground": "#ffffff", "cl-mark": "#c9c9c9", "cl-shade": "rgb(0 0 0 / 0.08)" },
    dark: { background: "#0a0a0a", foreground: "#ededed", card: "#111111", "card-foreground": "#ededed", popover: "#1a1a1a", "popover-foreground": "#ededed", primary: "#ededed", "primary-foreground": "#0a0a0a", secondary: "#1f1f1f", "secondary-foreground": "#ededed", muted: "#1a1a1a", "muted-foreground": "#a1a1a1", accent: "#232323", "accent-foreground": "#ededed", border: "#2e2e2e", input: "#3d3d3d", ring: "#47a8ff", signal: "#47a8ff", "signal-foreground": "#0a0a0a", "cl-mark": "#454545", "cl-shade": "rgb(0 0 0 / 0.5)" },
  },
  supabase: {
    light: { background: "#fcfcfc", foreground: "#171717", card: "#ffffff", "card-foreground": "#171717", popover: "#ffffff", "popover-foreground": "#171717", primary: "#3ecf8e", "primary-foreground": "#0b2a1d", secondary: "#f3f3f3", "secondary-foreground": "#171717", muted: "#f3f3f3", "muted-foreground": "#707070", accent: "#ededed", "accent-foreground": "#171717", border: "#e6e6e6", input: "#dfdfdf", ring: "#3ecf8e", signal: "#1f9d62", "signal-foreground": "#ffffff", "cl-mark": "#d0d0d0", "cl-shade": "rgb(0 0 0 / 0.07)" },
    dark: { background: "#121212", foreground: "#ededed", card: "#171717", "card-foreground": "#ededed", popover: "#1c1c1c", "popover-foreground": "#ededed", primary: "#3ecf8e", "primary-foreground": "#08251a", secondary: "#242424", "secondary-foreground": "#ededed", muted: "#1f1f1f", "muted-foreground": "#a0a0a0", accent: "#2a2a2a", "accent-foreground": "#ededed", border: "#2e2e2e", input: "#363636", ring: "#3ecf8e", signal: "#3ecf8e", "signal-foreground": "#08251a", "cl-mark": "#3e3e3e", "cl-shade": "rgb(0 0 0 / 0.5)" },
  },
  notion: {
    light: { background: "#ffffff", foreground: "#37352f", card: "#ffffff", "card-foreground": "#37352f", popover: "#ffffff", "popover-foreground": "#37352f", primary: "#2383e2", "primary-foreground": "#ffffff", secondary: "#f1f1ef", "secondary-foreground": "#37352f", muted: "#f7f6f3", "muted-foreground": "#787774", accent: "#efeeec", "accent-foreground": "#37352f", border: "#e9e9e7", input: "#dfdfdc", ring: "#2383e2", signal: "#2383e2", "signal-foreground": "#ffffff", "cl-mark": "#d3d1cb", "cl-shade": "rgb(15 15 15 / 0.08)" },
    dark: { background: "#191919", foreground: "#e6e6e5", card: "#202020", "card-foreground": "#e6e6e5", popover: "#252525", "popover-foreground": "#e6e6e5", primary: "#2383e2", "primary-foreground": "#ffffff", secondary: "#2c2c2c", "secondary-foreground": "#e6e6e5", muted: "#252525", "muted-foreground": "#9b9b9b", accent: "#2f2f2f", "accent-foreground": "#e6e6e5", border: "#2f2f2f", input: "#3a3a3a", ring: "#529cca", signal: "#529cca", "signal-foreground": "#ffffff", "cl-mark": "#474747", "cl-shade": "rgb(0 0 0 / 0.5)" },
  },
  claude: {
    light: { background: "#faf9f5", foreground: "#141413", card: "#fdfcf8", "card-foreground": "#141413", popover: "#ffffff", "popover-foreground": "#141413", primary: "#c96442", "primary-foreground": "#ffffff", secondary: "#f0eee6", "secondary-foreground": "#141413", muted: "#f0eee6", "muted-foreground": "#73726c", accent: "#e8e6dc", "accent-foreground": "#141413", border: "#e5e2d9", input: "#dad7cc", ring: "#d97757", signal: "#c96442", "signal-foreground": "#ffffff", "cl-mark": "#cfcbbf", "cl-shade": "rgb(70 50 20 / 0.08)" },
    dark: { background: "#262624", foreground: "#faf9f5", card: "#30302e", "card-foreground": "#faf9f5", popover: "#363633", "popover-foreground": "#faf9f5", primary: "#d97757", "primary-foreground": "#ffffff", secondary: "#3a3a37", "secondary-foreground": "#faf9f5", muted: "#30302e", "muted-foreground": "#b7b5a9", accent: "#3d3d3a", "accent-foreground": "#faf9f5", border: "#3e3e3a", input: "#4a4a45", ring: "#d97757", signal: "#d97757", "signal-foreground": "#ffffff", "cl-mark": "#55554f", "cl-shade": "rgb(0 0 0 / 0.45)" },
  },
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
  { name: "Indigo", l: 0.56, c: 0.15, hue: 277 },
  { name: "Cobalt", l: 0.55, c: 0.23, hue: 264 },
  { name: "Chartreuse", l: 0.88, c: 0.2, hue: 127 },
  { name: "Electric", l: 0.66, c: 0.21, hue: 258 },
  { name: "Violet", l: 0.64, c: 0.22, hue: 295 },
  { name: "Coral", l: 0.7, c: 0.18, hue: 32 },
  { name: "Mint", l: 0.84, c: 0.14, hue: 168 },
  { name: "Ink", l: 0, c: 0, hue: 0 },
];

/** Linear: hairline borders, quiet greys, one indigo accent, Inter at 510/590, 8px corners, no crop marks. */
export const DEFAULT_THEME: SiteTheme = { base: "Zinc", signal: "Indigo", hue: 277, radius: 0.5, density: 1, marks: false, motion: 1, font: "Inter", textSize: 1, tracking: -0.006, fill: "signal", brand: "linear" };
const CUELARK: SiteTheme = { base: "Mist", signal: "Cobalt", hue: 264, radius: 0.75, density: 1, marks: true, motion: 1, font: "Inter", textSize: 1, tracking: 0, fill: "signal" };
const INK = { fill: "ink" as const };

/** Curated, copy-ready themes: brand palettes first, then Cuelark's own. */
export const PRESETS: { name: string; description: string; theme: SiteTheme }[] = [
  { name: "Linear", description: "Hairline borders, quiet greys, one indigo accent. The default.", theme: DEFAULT_THEME },
  { name: "Stripe", description: "Navy ink on cool white, blurple buttons, soft blue shadows.", theme: { ...CUELARK, base: "Slate", signal: "Violet", hue: 277, radius: 0.5, marks: false, font: "Instrument Sans", tracking: -0.005, brand: "stripe" } },
  { name: "Vercel", description: "Black and white, Geist, tight corners, blue only for focus.", theme: { ...CUELARK, ...INK, base: "Neutral", signal: "Ink", hue: 0, radius: 0.375, marks: false, font: "Geist", tracking: -0.01, brand: "vercel" } },
  { name: "Supabase", description: "Neutral greys with Supabase green buttons.", theme: { ...CUELARK, base: "Neutral", signal: "Mint", hue: 160, radius: 0.375, marks: false, brand: "supabase" } },
  { name: "Notion", description: "Warm ink on white, Notion blue, calm and readable.", theme: { ...CUELARK, base: "Paper", signal: "Cobalt", hue: 250, radius: 0.375, marks: false, font: "IBM Plex Sans", brand: "notion" } },
  { name: "Claude", description: "Warm paper, clay buttons, generous corners.", theme: { ...CUELARK, base: "Paper", signal: "Coral", hue: 40, radius: 0.75, marks: false, font: "Instrument Sans", brand: "claude" } },
  { name: "Cuelark", description: "Cool mist, vivid cobalt buttons, crop marks.", theme: CUELARK },
  { name: "Paper", description: "Warm paper, ink buttons and a chartreuse signal.", theme: { ...CUELARK, ...INK, base: "Paper", signal: "Chartreuse", hue: 127, radius: 0.625 } },
  { name: "Mono", description: "Pure neutral, ink accents, Geist. Quiet and exact.", theme: { ...CUELARK, ...INK, base: "Neutral", signal: "Ink", hue: 0, radius: 0.5, font: "Geist", marks: false } },
  { name: "Atelier", description: "Paper with violet, editorial type, generous corners.", theme: { ...CUELARK, base: "Paper", signal: "Violet", hue: 295, radius: 1, font: "Instrument Sans" } },
  { name: "Terminal", description: "Square corners, compact, mint signal, Space Grotesk.", theme: { ...CUELARK, ...INK, base: "Zinc", signal: "Mint", hue: 168, radius: 0, density: 0.875, font: "Space Grotesk", textSize: 0.9375 } },
  { name: "Studio", description: "Zinc, coral buttons, soft SaaS type, roomy.", theme: { ...CUELARK, base: "Zinc", signal: "Coral", hue: 32, radius: 0.875, density: 1.125, font: "Plus Jakarta Sans", textSize: 1.0625 } },
];

export const presetSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
export const presetBySlug = (slug: string) => PRESETS.find((p) => presetSlug(p.name) === slug);

/** A random but coherent theme: any base, a vivid signal hue, a radius and a face that suit each other. */
export function randomTheme(): SiteTheme {
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]!;
  const signal = pick(SIGNALS.filter((x) => x.c > 0));
  return {
    ...CUELARK,
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
  const brand = theme.brand ? BRANDS[theme.brand] : undefined;
  const generated = {
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
    } as Tokens,
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
    } as Tokens,
  };
  return brand ? { light: { ...generated.light, ...brand.light }, dark: { ...generated.dark, ...brand.dark }, vars: brand.vars ?? {} } : { ...generated, vars: {} as Tokens };
}

/** Everything outside the palette that a theme sets (type, shape, density, marks, motion, brand extras). */
export function themeVars(theme: SiteTheme): Tokens {
  return { "cl-font-sans": fontStack(theme.font), "cl-text-size": String(theme.textSize), "cl-tracking": `${theme.tracking}em`, radius: `${theme.radius}rem`, "cl-density": String(theme.density), "cl-marks": theme.marks ? "1" : "0", "cl-motion": String(theme.motion), ...themeTokens(theme).vars };
}

/** The theme as inline custom properties for one element, e.g. a single preview stage. */
export function scopedThemeStyle(theme: SiteTheme, mode: "light" | "dark") {
  const t = themeTokens(theme);
  return Object.fromEntries(Object.entries({ ...t[mode], ...themeVars(theme) }).map(([k, v]) => [`--${k}`, v])) as React.CSSProperties;
}

/** `boost` raises specificity (html:root / html.dark) so a live override wins regardless of stylesheet order. */
export function themeCss(theme: SiteTheme, boost = false) {
  const { light, dark } = themeTokens(theme);
  const block = (sel: string, vars: Record<string, string | number>) => `${sel} {\n${Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`).join("\n")}\n}`;
  return [block(boost ? "html:root" : ":root", { ...light, ...themeVars(theme) }), block(boost ? "html.dark" : ".dark", dark)].join("\n\n");
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
    if (saved) current = { ...CUELARK, brand: undefined, ...JSON.parse(saved) };
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

/** Same theme regardless of key order or unset optional keys. */
export const sameTheme = (a: SiteTheme, b: SiteTheme) => (Object.keys({ ...a, ...b }) as (keyof SiteTheme)[]).every((k) => a[k] === b[k]);

function apply() {
  const isDefault = sameTheme(current, DEFAULT_THEME);
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
  const recolor = ["base", "signal", "hue", "fill"].some((k) => k in patch) && !("brand" in patch);
  current = { ...current, ...(recolor ? { brand: undefined } : {}), ...patch };
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

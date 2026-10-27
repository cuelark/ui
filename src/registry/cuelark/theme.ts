/**
 * Cuelark design tokens: the single source for the `theme` registry item (registry.json → /r/theme.json)
 * and the docs site stylesheet (src/styles/cuelark.css). Regenerate both with `pnpm registry:build`.
 *
 * Knobs a project can turn without touching component code:
 *   --signal / --ring               the one vivid "cue" color (focus, ping, checked, highlights)
 *   --primary                       ink: buttons and strong surfaces stay monochrome
 *   --radius                        corner rounding (shadcn's radius scale derives from it)
 *   --cl-density                    control heights and card padding (0.875 compact · 1 · 1.125 comfortable)
 *   --cl-marks                      crop-mark visibility (0 hides every cue mark)
 *   --cl-motion                     GSAP motion amplitude (0 off · 1 · 1.5 expressive), see lib/motion.ts
 */
import { DEFAULT_THEME, themeTokens } from "../../lib/site-theme";

export type CssVars = Record<string, string>;

/** Colors come from the same generator as the live theme editor, so the registry default and the site never drift. */
const palette = themeTokens(DEFAULT_THEME);
export type CssRules = { [selector: string]: string | CssRules };

export const cssVars: { theme: CssVars; light: CssVars; dark: CssVars } = {
  theme: {
    "color-success": "var(--success)",
    "color-success-foreground": "var(--success-foreground)",
    "color-warning": "var(--warning)",
    "color-warning-foreground": "var(--warning-foreground)",
    "color-mark": "var(--cl-mark)",
    "color-signal": "var(--signal)",
    "color-signal-foreground": "var(--signal-foreground)",
    "spacing-ctl-xs": "calc(var(--cl-density) * 1.5rem)",
    "spacing-ctl-sm": "calc(var(--cl-density) * 1.75rem)",
    "spacing-ctl-md": "calc(var(--cl-density) * 2rem)",
    "spacing-ctl-lg": "calc(var(--cl-density) * 2.5rem)",
    "spacing-card": "calc(var(--cl-density) * 1.5rem)",
    "shadow-control": "0 1px 2px var(--cl-shade)",
    "shadow-raised": "0 1px 2px var(--cl-shade), 0 8px 24px -12px var(--cl-shade)",
    "shadow-overlay": "0 1px 2px var(--cl-shade), 0 16px 40px -12px var(--cl-shade), 0 32px 64px -24px var(--cl-shade)",
    "shadow-pressed": "inset 0 1px 2px var(--cl-shade)",
    "shadow-well": "inset 0 1px 1px var(--cl-shade)",
    "ease-cue": "cubic-bezier(0.23, 1, 0.32, 1)",
  },
  light: {
    ...palette.light,
    radius: "0.75rem",
    "cl-density": "1",
    "cl-marks": "1",
    "cl-motion": "1",
    destructive: "oklch(0.577 0.215 27)",
    success: "oklch(0.56 0.14 150)",
    "success-foreground": "oklch(0.985 0.004 85)",
    warning: "oklch(0.66 0.15 65)",
    "warning-foreground": "oklch(0.2 0.012 75)",
    "cl-highlight": "oklch(1 0 0 / 0.16)",
    "cl-shade": "oklch(0.3 0.06 262 / 0.09)",
  },
  dark: {
    ...palette.dark,
    destructive: "oklch(0.7 0.19 22)",
    success: "oklch(0.74 0.15 150)",
    "success-foreground": "oklch(0.18 0.03 150)",
    warning: "oklch(0.8 0.14 80)",
    "warning-foreground": "oklch(0.2 0.04 70)",
    "cl-highlight": "oklch(1 0 0 / 0.1)",
    "cl-shade": "oklch(0 0 0 / 0.5)",
  },
};

const MARK = "linear-gradient(var(--cl-mark), var(--cl-mark))";
const OFFSET = "calc(var(--cl-mark-len, 7px) + var(--cl-mark-gap, 4px))";
const LEN = "var(--cl-mark-len, 7px)";
/** The pseudo-element is placed against the padding box, so the 1px border line sits 1px further in. */
const POS = "calc(var(--cl-mark-len, 7px) + var(--cl-mark-gap, 4px) - 1px)";

/** Utilities every Cuelark component leans on (shadcn writes these into the project's CSS file). */
export const css: CssRules = {
  "@utility cue-marks": {
    "&::before": {
      content: '""',
      position: "absolute",
      inset: `calc(${OFFSET} * -1)`,
      "pointer-events": "none",
      opacity: "var(--cl-marks)",
      "background-image": Array(8).fill(MARK).join(", "),
      "background-repeat": "no-repeat",
      "background-size": `${LEN} 1px, 1px ${LEN}, ${LEN} 1px, 1px ${LEN}, ${LEN} 1px, 1px ${LEN}, ${LEN} 1px, 1px ${LEN}`,
      "background-position": [
        `left 0 top ${POS}`,
        `left ${POS} top 0`,
        `right 0 top ${POS}`,
        `right ${POS} top 0`,
        `left 0 bottom ${POS}`,
        `left ${POS} bottom 0`,
        `right 0 bottom ${POS}`,
        `right ${POS} bottom 0`,
      ].join(", "),
    },
  },
  "@utility cue-dash-t": {
    "background-image": "linear-gradient(to right, var(--border) 55%, transparent 0)",
    "background-size": "7px 1px",
    "background-repeat": "repeat-x",
    "background-position": "top",
  },
  "@utility cue-dash-b": {
    "background-image": "linear-gradient(to right, var(--border) 55%, transparent 0)",
    "background-size": "7px 1px",
    "background-repeat": "repeat-x",
    "background-position": "bottom",
  },
  "@utility cue-label": {
    "font-family": "var(--font-mono)",
    "font-size": "0.6875rem",
    "line-height": "1rem",
    "font-weight": "500",
    "letter-spacing": "0.08em",
    "text-transform": "uppercase",
    color: "var(--muted-foreground)",
  },
  "@utility cue-digits": {
    "&::before": {
      content: '"0\\A 1\\A 2\\A 3\\A 4\\A 5\\A 6\\A 7\\A 8\\A 9"',
      "white-space": "pre",
    },
  },
  "@keyframes cue-text-shimmer": {
    "0%": { "background-position": "100% 0" },
    "100%": { "background-position": "-100% 0" },
  },
  "@keyframes cue-indeterminate": {
    "0%": { transform: "translateX(-100%) scaleX(0.4)" },
    "50%": { transform: "translateX(30%) scaleX(0.6)" },
    "100%": { transform: "translateX(100%) scaleX(0.4)" },
  },
  "@keyframes cue-shimmer": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },
  "@utility cue-kbd": {
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    gap: "0.125rem",
    "min-width": "1.25rem",
    height: "1.25rem",
    padding: "0 0.3125rem",
    "border-radius": "calc(var(--radius) * 0.5)",
    border: "1px solid var(--border)",
    "box-shadow": "inset 0 -1px 0 var(--border)",
    background: "var(--background)",
    color: "var(--muted-foreground)",
    "font-family": "var(--font-mono)",
    "font-size": "0.6875rem",
    "font-weight": "500",
    "line-height": "1",
    "white-space": "nowrap",
  },
};

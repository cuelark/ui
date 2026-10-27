import { kebab, setSlug } from "./icon-slugs";

/** Icon data produced by scripts/icons.ts (all of react-icons, pre-rendered to SVG). */
export type IconData = [attrs: string, inner: string];
export type IconSetMeta = { id: string; name: string; count: number; license: string; licenseUrl: string; projectUrl: string };
export type IconIndex = { sets: IconSetMeta[]; names: Record<string, string[]>; slugs: Record<string, string[]> };
export type IconSet = { id: string; name: string; icons: Record<string, IconData> };

/** A complete <svg> string for an icon, sized in em so it follows font-size and colored by currentColor. */
export function svgMarkup([attrs, inner]: IconData, extra = "") {
  const sw = attrs.includes('data-sw="1"') ? "" : ' stroke-width="0"';
  const clean = attrs.replace(' data-sw="1"', "").replace('data-sw="1"', "");
  // Icon-specific attributes come first: in HTML the first duplicate wins, so fill="none" beats the default.
  return `<svg ${clean} stroke="currentColor" fill="currentColor"${sw} width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"${extra}>${inner}</svg>`;
}

/** Splits "FaReact" / "LuArrowUpRight" into searchable words: "react", "arrow up right". */
export function iconWords(name: string, set: string) {
  const prefix = name.slice(0, set.length).toLowerCase() === set.toLowerCase() ? name.slice(set.length) : name.replace(/^[A-Z][a-z]*/, "");
  return prefix
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .toLowerCase()
    .trim();
}

/** Human title for an icon page: "React", "Arrow Up Right". */
export const iconTitle = (name: string, set: string) =>
  iconWords(name, set)
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

let indexPromise: Promise<IconIndex> | null = null;
const setPromises = new Map<string, Promise<IconSet>>();

/** Client-side loaders, cached for the session; the browser caches the files themselves. */
export function loadIconIndex() {
  indexPromise ??= fetch("/icons/index.json").then((r) => r.json() as Promise<IconIndex>);
  return indexPromise;
}
export function loadIconSet(id: string) {
  if (!setPromises.has(id)) setPromises.set(id, fetch(`/icons/${id}.json`).then((r) => r.json() as Promise<IconSet>));
  return setPromises.get(id)!;
}

/** PascalCase file-safe component name for an installed icon, e.g. FaReact → FaReactIcon. */
export const componentName = (name: string) => `${name}Icon`;

/** A standalone React component for one icon, as written into a project by `shadcn add`. */
/**
 * Pretty-prints SVG/JSX markup: one element per line, nested by depth; long opening tags put each attribute on its
 * own line. Purely cosmetic: the markup is unchanged otherwise.
 */
export function formatMarkup(markup: string, indent = "") {
  const tokens = markup.match(/<[^>]+>|[^<]+/g) ?? [];
  const out: string[] = [];
  let depth = 0;
  for (const tok of tokens) {
    if (!tok.trim()) continue;
    if (tok.startsWith("</")) {
      depth = Math.max(0, depth - 1);
      // Collapse <path ...></path> into one line.
      const prev = out[out.length - 1];
      if (prev && !prev.trimEnd().endsWith("/>") && prev.trim().startsWith("<") && !prev.includes("</") && prev.trim().split(/[\s>]/)[0] === `<${tok.slice(2, -1)}` && !prev.endsWith("{")) {
        out[out.length - 1] = prev.includes("\n") ? prev.replace(/\n\s*>$/, `\n${indent}${"  ".repeat(depth)}/>`) : prev.replace(/>$/, " />");
        continue;
      }
      out.push(indent + "  ".repeat(depth) + tok);
      continue;
    }
    const pad = indent + "  ".repeat(depth);
    let line = tok;
    if (tok.length > 90 && tok.startsWith("<")) {
      const name = tok.match(/^<([^\s>/]+)/)?.[1] ?? "";
      const attrs = tok.slice(name.length + 1).replace(/\/?>$/, "").match(/[^\s=]+(?:=(?:"[^"]*"|\{[^}]*\}(?:\})?))?/g) ?? [];
      const close = tok.endsWith("/>") ? "/>" : ">";
      line = `<${name}\n${attrs.map((a) => `${pad}  ${a}`).join("\n")}\n${pad}${close}`;
    }
    out.push(pad + line);
    if (tok.startsWith("<") && !tok.endsWith("/>") && !tok.startsWith("<!")) depth++;
  }
  return out.join("\n");
}

/** HTML/SVG markup → JSX: camelCase dashed attributes, class → className, drop inline styles and xmlns:xlink. */
function toJsx(markup: string) {
  return markup
    .replace(/ style="[^"]*"/g, "")
    .replace(/ xmlns:xlink="[^"]*"/g, "")
    .replace(/ xlink:href=/g, " href=")
    .replace(/ xml:space=/g, " xmlSpace=")
    .replace(/ class=/g, " className=")
    .replace(/ ([a-z]+(?:-[a-z]+)+)=/g, (m, attr: string) => (attr.startsWith("data-") || attr.startsWith("aria-") ? m : ` ${attr.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())}=`));
}

/** A standalone React component for one icon, as written into a project by `shadcn add`. Props spread last, so callers can override anything. */
export function iconComponentSource(name: string, set: IconSetMeta | { id: string; name: string; license?: string; projectUrl?: string }, data: IconData) {
  const svg = formatMarkup(toJsx(svgMarkup(data)).replace(/^<svg ([^>]*)>/, (_, attrs: string) => `<svg aria-hidden="true" ${attrs} {...props}>`), "    ").trimStart();
  const comp = componentName(name);
  return `import * as React from "react";

/**
 * ${iconTitle(name, set.id)} from ${set.name}${"projectUrl" in set && set.projectUrl ? ` (${set.projectUrl})` : ""}${"license" in set && set.license ? `, ${set.license}` : ""}.
 * Via Cuelark UI: ui.cuelark.com/icons/${setSlug(set.id)}/${kebab(iconWords(name, set.id)) || kebab(name)}. Sized in em, colored by currentColor.
 */
export function ${comp}(props: React.SVGProps<SVGSVGElement>) {
  return (
    ${svg}
  );
}
`;
}

/**
 * Web Animations API recipes for the dependency-free animated components people copy or install. They mirror the
 * GSAP motions used on the site ("ring", "nudge-right"…), expressed as plain keyframes.
 */
type Recipe = { keyframes: Keyframe[]; duration: number; easing: string; origin?: string };
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const t = (v: string) => ({ transform: v });
export const WAAPI: Record<string, Recipe> = {
  pop: { keyframes: [t("scale(1)"), t("scale(1.16)"), t("scale(0.96)"), t("scale(1)")], duration: 500, easing: OUT },
  ring: { keyframes: [0, 18, -16, 12, -8, 4, 0].map((r) => t(`rotate(${r}deg)`)), duration: 800, easing: "ease-out", origin: "50% 8%" },
  beat: { keyframes: [1, 1.22, 1, 1.12, 1].map((s) => t(`scale(${s})`)), duration: 700, easing: "ease-in-out" },
  "nudge-right": { keyframes: [0, 4, 0, 2.5, 0].map((x) => t(`translateX(${x}px)`)), duration: 600, easing: OUT },
  "nudge-left": { keyframes: [0, -4, 0, -2.5, 0].map((x) => t(`translateX(${x}px)`)), duration: 600, easing: OUT },
  "nudge-up": { keyframes: [0, -4, 0, -2.5, 0].map((y) => t(`translateY(${y}px)`)), duration: 600, easing: OUT },
  "nudge-down": { keyframes: [0, 4, 0, 2.5, 0].map((y) => t(`translateY(${y}px)`)), duration: 600, easing: OUT },
  fly: {
    keyframes: [
      { transform: "translate(0,0)", opacity: 1, offset: 0 },
      { transform: "translate(14px,-14px)", opacity: 0, offset: 0.4 },
      { transform: "translate(-14px,14px)", opacity: 0, offset: 0.41 },
      { transform: "translate(0,0)", opacity: 1, offset: 1 },
    ],
    duration: 700,
    easing: OUT,
  },
  launch: {
    keyframes: [
      { transform: "translateY(0)", opacity: 1, offset: 0 },
      { transform: "translateY(3px)", offset: 0.15 },
      { transform: "translateY(-16px)", opacity: 0, offset: 0.5 },
      { transform: "translateY(12px)", opacity: 0, offset: 0.51 },
      { transform: "translateY(0)", opacity: 1, offset: 1 },
    ],
    duration: 800,
    easing: OUT,
  },
  turn: { keyframes: [t("rotate(0deg)"), t("rotate(90deg)")], duration: 550, easing: SPRING },
  spin: { keyframes: [t("rotate(0deg)"), t("rotate(360deg)")], duration: 750, easing: "ease-in-out" },
  "spin-back": { keyframes: [t("rotate(0deg)"), t("rotate(-360deg)")], duration: 750, easing: "ease-in-out" },
  twinkle: { keyframes: [t("scale(1) rotate(0deg)"), t("scale(1.18) rotate(16deg)"), t("scale(1) rotate(0deg)")], duration: 700, easing: SPRING },
  zoom: { keyframes: [t("scale(1) rotate(0deg)"), t("scale(1.18) rotate(-12deg)"), t("scale(1) rotate(0deg)")], duration: 650, easing: SPRING },
  blink: { keyframes: [t("scaleY(1)"), t("scaleY(0.1)"), t("scaleY(1)")], duration: 250, easing: "ease-in-out" },
  wave: { keyframes: [0, -12, 10, -6, 0].map((k) => t(`skewX(${k}deg)`)), duration: 800, easing: "ease-in-out", origin: "0% 100%" },
  flicker: { keyframes: [1, 0.35, 1, 0.6, 1].map((o) => ({ opacity: o })), duration: 500, easing: "linear" },
  grow: { keyframes: [t("scaleY(0.4)"), t("scaleY(1.08)"), t("scaleY(1)")], duration: 550, easing: SPRING, origin: "50% 100%" },
  drive: {
    keyframes: [
      { transform: "translateX(0)", opacity: 1, offset: 0 },
      { transform: "translateX(18px)", opacity: 0, offset: 0.4 },
      { transform: "translateX(-18px)", opacity: 0, offset: 0.41 },
      { transform: "translateX(0)", opacity: 1, offset: 1 },
    ],
    duration: 750,
    easing: OUT,
  },
  drop: { keyframes: [t("translateY(-10px)"), t("translateY(0)"), t("translateY(-3px)"), t("translateY(0)")], duration: 600, easing: "ease-out" },
  nod: { keyframes: [t("translateY(0) rotate(0)"), t("translateY(-2.5px) rotate(-5deg)"), t("translateY(0) rotate(0)"), t("translateY(-1.5px) rotate(3deg)"), t("translateY(0) rotate(0)")], duration: 600, easing: "ease-in-out" },
  write: { keyframes: [0, -14, -6, -14, 0].map((r, i) => t(`translateX(${[0, 2, 4, 6, 0][i]}px) rotate(${r}deg)`)), duration: 700, easing: "ease-in-out", origin: "10% 90%" },
  rock: { keyframes: [0, -18, 12, -6, 0].map((r) => t(`rotate(${r}deg)`)), duration: 800, easing: "ease-in-out" },
  wiggle: { keyframes: [0, -14, 12, -8, 5, 0].map((r) => t(`rotate(${r}deg)`)), duration: 600, easing: "ease-in-out" },
  shake: { keyframes: [0, -3, 3, -2, 2, 0].map((x) => t(`translateX(${x}px)`)), duration: 400, easing: "linear" },
  bounce: { keyframes: [t("translateY(0)"), t("translateY(-6px)"), t("translateY(0)"), t("translateY(-2px)"), t("translateY(0)")], duration: 650, easing: "ease-out" },
  float: { keyframes: [t("translateY(0)"), t("translateY(-4px)"), t("translateY(0)")], duration: 1600, easing: "ease-in-out" },
  flip: { keyframes: [t("perspective(200px) rotateY(0deg)"), t("perspective(200px) rotateY(360deg)")], duration: 700, easing: OUT },
  tada: { keyframes: [t("scale(1) rotate(0)"), t("scale(0.9) rotate(-6deg)"), t("scale(1.15) rotate(6deg)"), t("scale(1.15) rotate(-6deg)"), t("scale(1.15) rotate(6deg)"), t("scale(1) rotate(0)")], duration: 800, easing: "ease-in-out" },
  pulse: { keyframes: [t("scale(1)"), t("scale(1.15)"), t("scale(1)")], duration: 550, easing: "ease-in-out" },
};

/**
 * A self-contained animated React component for one icon: no dependencies, plays on hover (or via ref
 * `startAnimation()` / `stopAnimation()` so a parent button can drive it), and respects prefers-reduced-motion.
 */
export function animatedIconComponentSource(name: string, set: IconSetMeta | { id: string; name: string; license?: string; projectUrl?: string }, data: IconData, animation: string) {
  const recipe = WAAPI[animation] ?? WAAPI.pop!;
  let svg = toJsx(svgMarkup(data));
  svg = formatMarkup(
    svg.replace(/^<svg ([^>]*)>/, (_, attrs: string) => `<svg aria-hidden="true" ref={svgRef} ${attrs} style={{ transformOrigin: "${recipe.origin ?? "50% 50%"}", ...style }} onMouseEnter={handleEnter} {...props}>`),
    "    ",
  ).trimStart();
  const comp = componentName(name).replace(/Icon$/, "AnimatedIcon");
  const play = `    svg.animate(${JSON.stringify(recipe.keyframes)}, { duration: ${recipe.duration}, easing: "${recipe.easing}" });`;
  return `"use client";

import * as React from "react";

/**
 * ${iconTitle(name, set.id)} from ${set.name}${"projectUrl" in set && set.projectUrl ? ` (${set.projectUrl})` : ""}${"license" in set && set.license ? `, ${set.license}` : ""}, animated ("${animation}").
 * Via Cuelark UI: ui.cuelark.com/icons/${setSlug(set.id)}/${kebab(iconWords(name, set.id)) || kebab(name)}. No dependencies: Web Animations API, skipped for prefers-reduced-motion.
 */
export interface ${comp}Handle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type ${comp}Props = React.SVGProps<SVGSVGElement> & {
  /** Play on hover of the icon itself (default). Turn off and use the ref to play from a parent. */
  animateOnHover?: boolean;
};

export const ${comp} = React.forwardRef<${comp}Handle, ${comp}Props>(function ${comp}({ animateOnHover = true, onMouseEnter, style, ...props }, ref) {
  const svgRef = React.useRef<SVGSVGElement>(null);

  const stop = React.useCallback(() => {
    svgRef.current?.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  }, []);

  const start = React.useCallback(() => {
    const svg = svgRef.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stop();
${play}
  }, [stop]);

  React.useImperativeHandle(ref, () => ({ startAnimation: start, stopAnimation: stop }), [start, stop]);

  const handleEnter = (e: React.MouseEvent<SVGSVGElement>) => {
    onMouseEnter?.(e);
    if (animateOnHover) start();
  };

  return (
    ${svg}
  );
});
`;
}

/**
 * Facts for one icon-set page. Style numbers are measured from the rendered SVGs and from the icon names.
 * License notes are the terms of the license string stored in the react-icons registry. An unknown license
 * stays neutral instead of guessing.
 */
import { licenseLabel } from "./icon-set-seo.ts";
import { iconWords, type IconDrawing, type IconSetMeta } from "./icons.ts";

export const PREVIEW_COUNT = 48;

const VARIANT_WORDS = new Set(["outline", "outlined", "twotone", "duotone", "fill", "filled", "solid", "bold", "thin", "light", "sharp", "mini", "line"]);

/** Evenly spaced indexes, including the first and last, with no duplicates. */
export function previewIndexes(length: number, count = PREVIEW_COUNT) {
  if (length <= count) return Array.from({ length }, (_, i) => i);
  const used = new Set<number>();
  const chosen: number[] = [];
  for (let i = 0; i < count; i++) {
    let idx = Math.round((i * (length - 1)) / (count - 1));
    while (used.has(idx) && idx < length - 1) idx++;
    if (used.has(idx)) {
      idx = 0;
      while (used.has(idx)) idx++;
    }
    used.add(idx);
    chosen.push(idx);
  }
  chosen.sort((a, b) => a - b);
  return chosen;
}

/** A real export from the set, preferring a short familiar name when one exists. */
export function exampleIconName(names: string[], setId: string) {
  const prefer = ["house", "home", "star", "heart", "user", "search", "check"];
  const ranked = names
    .map((name) => ({ name, tokens: iconWords(name, setId).split(/\s+/).filter(Boolean) }))
    .sort((a, b) => a.tokens.length - b.tokens.length || a.name.localeCompare(b.name));
  return ranked.find((item) => prefer.some((word) => item.tokens.includes(word)))?.name ?? ranked[0]?.name ?? "";
}

/** Install snippet for one set. `iconName` is an export that exists in `react-icons/<setId>`. */
export function setUsageSource(setId: string, iconName: string) {
  return `import { ${iconName} } from "react-icons/${setId}";\n\nexport function Example() {\n  return <${iconName} />;\n}`;
}

export function classifyRenderedIcon(name: string, setId: string, svg: string) {
  const open = svg.slice(0, svg.indexOf(">") + 1);
  const strokeWidth = /stroke-width="([^"]+)"/.exec(open);
  const paint = /fill="none"/.test(open) || (strokeWidth !== null && strokeWidth[1] !== "0" && /stroke="/.test(open)) ? "stroke" : "fill";
  const colored = /fill="#[0-9A-Fa-f]{3,8}"/.test(svg) || /fill="rgb/i.test(svg);
  const tokens = iconWords(name, setId).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const ends = [...new Set([tokens[0], tokens[tokens.length - 1]].filter((token): token is string => Boolean(token)))];
  return {
    paint,
    colored,
    duotone: ends.some((token) => token === "duotone" || token === "twotone"),
    variants: ends.filter((token) => VARIANT_WORDS.has(token)),
  } as const;
}

export function finalizeDrawing(partial: { stroke: number; fill: number; duotone: number; colored: number; variantHits: Record<string, number>; total: number }): IconDrawing {
  const variants = Object.fromEntries(
    Object.entries(partial.variantHits)
      .filter(([key, n]) => key !== "duotone" && key !== "twotone" && n >= 100 && partial.total > 0 && n / partial.total >= 0.15)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  );
  return { stroke: partial.stroke, fill: partial.fill, duotone: partial.duotone, colored: partial.colored, variants };
}

const countOf = (count: number) => count.toLocaleString("en-US");

/**
 * Attribution and reuse, keyed by the exact `license` string in react-icons' manifest.
 * Anything else falls back to a neutral line.
 */
export const LICENSE_NOTES: Record<string, string> = {
  MIT: "The MIT license requires the copyright and license notice to stay with the code. It does not require a public credit line.",
  ISC: "The ISC license requires the copyright and permission notice to stay with the code. It does not require a public credit line.",
  "Apache License Version 2.0": "The Apache 2.0 license requires you to keep the copyright, license, and any NOTICE file, and to state changes you make.",
  "CC BY 4.0 License": "CC BY 4.0 requires attribution: credit the creator, link the license, and note changes.",
  "CC BY 4.0": "CC BY 4.0 requires attribution: credit the creator, link the license, and note changes.",
  "CC BY 3.0": "CC BY 3.0 requires attribution: credit the creator and link the license.",
  "CC BY-SA 3.0": "CC BY-SA 3.0 requires attribution and share-alike: credit the creator, link the license, and license adaptations under the same terms.",
  "CC0 1.0 Universal": "CC0 waives copyright. Attribution is not required.",
  "MPL-2.0 license": "MPL-2.0 is a weak copyleft: keep this license on the files it covers and provide their source if you distribute them.",
  "SIL OFL 1.1": "SIL OFL 1.1 is a font license. You may use and embed the icons; you may not sell the font by itself. A credit line is not required.",
};

export function attributionNote(license: string) {
  return LICENSE_NOTES[license] ?? "See the license for attribution and reuse terms.";
}

function drawingReady(set: IconSetMeta): set is IconSetMeta & { drawing: IconDrawing } {
  return Boolean(set.drawing && set.drawing.stroke + set.drawing.fill === set.count);
}

function paintKind(set: IconSetMeta): "stroke" | "fill" | "mixed" | "unknown" {
  if (!drawingReady(set)) return "unknown";
  if (set.count > 0 && set.drawing.stroke / set.count >= 0.9) return "stroke";
  if (set.count > 0 && set.drawing.fill / set.count >= 0.9) return "fill";
  return "mixed";
}

function variantSentence(variants: Record<string, number>) {
  const entries = Object.entries(variants).filter(([, n]) => n > 0);
  if (!entries.length) return "";
  const parts = entries.map(([word, n]) => `${word} (${countOf(n)})`);
  const list = parts.length === 1 ? parts[0]! : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
  return `Names include ${list}.`;
}

function colorSentence(drawing: IconDrawing, count: number) {
  if (count > 0 && drawing.colored === count) return "Every icon uses its own colors rather than currentColor.";
  if (count > 0 && drawing.colored >= 100 && drawing.colored / count >= 0.15) return `${countOf(drawing.colored)} icons use their own colors rather than currentColor.`;
  return "";
}

/** Style, count, and license. Style is omitted when the registry entry has no measured split. */
export function describeSet(set: IconSetMeta) {
  const name = set.name;
  const license = `It is under the ${licenseLabel(set.license)}. ${attributionNote(set.license)}`;
  if (!drawingReady(set)) {
    return `The registry lists ${countOf(set.count)} ${name} icons. It does not include a stroke, fill, or duotone split. ${license}`;
  }
  const { drawing } = set;
  const style =
    drawing.stroke === set.count
      ? `All ${countOf(set.count)} icons in ${name} are stroke icons.`
      : drawing.fill === set.count
        ? `All ${countOf(set.count)} icons in ${name} are filled shapes.`
        : `${name} mixes ${countOf(drawing.stroke)} stroke icons and ${countOf(drawing.fill)} filled icons.`;
  const duotone = drawing.duotone > 0 ? `${countOf(drawing.duotone)} icon names include duotone or twotone.` : "";
  return [style, duotone, variantSentence(drawing.variants), colorSentence(drawing, set.count), license].filter(Boolean).join(" ");
}

function pickPeers(set: IconSetMeta, peers: IconSetMeta[]) {
  const byCount = (a: IconSetMeta, b: IconSetMeta) => a.count - b.count || a.name.localeCompare(b.name);
  const sorted = [...peers].sort(byCount);
  if (sorted.length <= 3) return sorted;
  const closest = [...peers].sort((a, b) => Math.abs(a.count - set.count) - Math.abs(b.count - set.count) || a.name.localeCompare(b.name));
  const different = closest.filter((peer) => peer.license !== set.license);
  const picked: IconSetMeta[] = [];
  const add = (peer: IconSetMeta | undefined) => {
    if (peer && !picked.some((item) => item.id === peer.id)) picked.push(peer);
  };
  add(different[0]);
  for (const peer of closest) {
    if (picked.length >= 2) break;
    add(peer);
  }
  return picked.sort(byCount);
}

function peerList(peers: IconSetMeta[]) {
  return peers.map((peer) => `${peer.name} (${countOf(peer.count)} icons, ${licenseLabel(peer.license)})`).join("; ");
}

/** When to choose this set, using only measured style, count, and license. */
export function whenToPick(set: IconSetMeta, all: IconSetMeta[]) {
  const kind = paintKind(set);
  if (kind === "unknown") return "Compare this set with the others by icon count and license. This page does not guess a style.";
  const phrase = kind === "stroke" ? "a stroke set" : kind === "fill" ? "a filled set" : "a mixed stroke and filled set";
  const noun = kind === "stroke" ? "stroke sets" : kind === "fill" ? "filled sets" : "mixed stroke and filled sets";
  const peers = pickPeers(
    set,
    all.filter((other) => other.id !== set.id && paintKind(other) === kind),
  );
  const lead = `Choose ${set.name} for ${phrase} of ${countOf(set.count)} icons under the ${licenseLabel(set.license)}.`;
  const comparison = peers.length ? `Other ${noun}: ${peerList(peers)}.` : `No other set in this registry is ${phrase}.`;
  const extras: string[] = [];
  if (drawingReady(set) && set.drawing.duotone > 0) {
    const without = peers.filter((peer) => drawingReady(peer) && peer.drawing.duotone === 0);
    if (without.length) extras.push(`This set includes ${countOf(set.drawing.duotone)} duotone or twotone names. ${without.map((peer) => peer.name).join(" and ")} ${without.length === 1 ? "does" : "do"} not.`);
  }
  if (drawingReady(set) && set.count > 0 && set.drawing.colored / set.count >= 0.8) {
    const plain = peers.filter((peer) => drawingReady(peer) && peer.drawing.colored === 0);
    if (plain.length) extras.push(`This set uses its own colors on the icons. ${plain.map((peer) => peer.name).join(" and ")} ${plain.length === 1 ? "does" : "do"} not.`);
  }
  return [lead, comparison, ...extras].join(" ");
}

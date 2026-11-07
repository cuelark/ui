/** Titles, descriptions and intros for the icon hub and one page per icon set. */

/** "Font Awesome 6" stays; "Phosphor Icons" → "Phosphor"; "Grommet-Icons" → "Grommet". */
export function setLabel(name: string) {
  return name.replace(/\s+icons$/i, "").replace(/-icons$/i, "").replace(/\s+icon$/i, "").trim();
}

/** "MIT" → "MIT license"; a label that already says license only normalizes a trailing "License". */
export function licenseLabel(license: string) {
  return /licen[sc]e/i.test(license) ? license.replace(/ License$/, " license") : `${license} license`;
}

const countOf = (count: number) => count.toLocaleString("en-US");

/**
 * The `<title>` `seo()` will emit. The brand suffix is kept only when the whole title stays under 60 characters.
 * Mirrors `emittedTitle` behavior in src/lib/seo.ts (` · Cuelark UI`).
 */
export function titleUnder60(title: string) {
  const suffixed = `${title} · Cuelark UI`;
  const full = suffixed.length > 60 ? title : suffixed;
  if (full.length >= 60) throw new Error(`Title is ${full.length} characters: ${full}`);
  return full;
}

export const HUB_TITLE = "50,000+ Free React Icons: Search and Copy";
export const HUB_DESCRIPTION =
  "Search 50,000+ free icons from Lucide, Heroicons, Phosphor, Font Awesome and more. Copy SVG or JSX here, or open one page for each icon set.";

/** Unique, length-bounded copy for one icon set. */
export function setPageCopy(meta: { name: string; count: number }, license: string) {
  const label = setLabel(meta.name);
  const count = countOf(meta.count);
  const title = `${label} Icons: Free SVG & React`;
  titleUnder60(title);
  const candidates = [
    `Search ${count} free ${label} icons (${license}). Copy any icon as SVG or JSX for React, and filter the set in the browser.`,
    `Search ${count} free ${label} icons (${license}). Copy any icon as SVG or JSX for React. Filter the set in your browser.`,
    `Search ${count} free ${label} icons (${license}). Copy SVG or JSX for React, then filter the set in the browser.`,
    `Browse ${count} free ${label} icons (${license}). Copy any icon as SVG or JSX and filter the set in the browser.`,
    `Search ${count} free ${label} icons. Copy any icon as SVG or JSX for React. ${license}.`,
    `Search ${count} ${label} icons (${license}). Copy SVG or JSX for React and filter the set in the browser.`,
  ];
  // Short set names land a few characters under 120; a closing clause brings them into range without pushing long names over 160.
  const description = candidates.map((d) => (d.length >= 120 ? d : `${d} Icons use currentColor.`)).find((d) => d.length >= 120 && d.length <= 160);
  if (!description) {
    const lengths = candidates.map((d) => `${d.length}:${d}`).join("\n");
    throw new Error(`No description in range for ${meta.name}\n${lengths}`);
  }
  const intro = `All ${count} ${label} icons in one place, under the ${license}. Search and filter the set, then copy the SVG or a React JSX snippet.`;
  return { label, title, description, intro };
}

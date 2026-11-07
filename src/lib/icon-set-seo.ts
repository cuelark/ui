/** Titles, descriptions and intros for the icon hub and one page per icon set. */
import { iconTokens } from "./icon-seo.ts";

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
 * Mirrors the suffix rule in src/lib/seo.ts.
 */
export function titleUnder60(title: string) {
  const suffixed = `${title} · Cuelark`;
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

/** How many icons a set page draws into the first HTML response. */
export const SAMPLE_SIZE = 48;

/**
 * Icons people compare across sets, matched as whole tokens. The rest of the sample is an even spread of the set,
 * so a brand library still shows its own range.
 */
const SAMPLE_TOKENS = [
  "home", "house", "user", "search", "settings", "heart", "star", "mail", "bell", "check", "plus", "arrow", "menu",
  "calendar", "lock", "file", "folder", "image", "camera", "play", "download", "share", "link", "trash", "edit", "eye",
  "sun", "moon", "cloud", "code", "terminal", "github", "globe", "chart", "warning", "info", "key", "bookmark", "phone",
  "message",
];

/** Indexes of a representative sample. Stable for a given name list. */
export function representativeIndexes(wordsList: readonly string[], limit = SAMPLE_SIZE) {
  const picked: number[] = [];
  const used = new Set<number>();
  const tokens = wordsList.map((words) => iconTokens(words));
  for (const token of SAMPLE_TOKENS) {
    if (picked.length >= limit) break;
    const at = tokens.findIndex((parts, i) => !used.has(i) && parts.includes(token));
    if (at >= 0) {
      used.add(at);
      picked.push(at);
    }
  }
  const rest = wordsList.map((_, i) => i).filter((i) => !used.has(i));
  const need = limit - picked.length;
  if (need >= rest.length) picked.push(...rest);
  else if (need > 0) {
    for (let k = 0; k < need; k++) {
      const at = rest[Math.floor((k * rest.length) / need)]!;
      if (!used.has(at)) {
        used.add(at);
        picked.push(at);
      }
    }
  }
  return picked.slice(0, limit);
}

/** Install and import for one real export. The path is the react-icons package id. */
export function setImportExample(setId: string, iconName: string) {
  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(setId) || !/^[A-Za-z][A-Za-z0-9]*$/.test(iconName)) throw new Error(`Cannot build an import example for ${setId}/${iconName}`);
  return {
    install: "npm install react-icons",
    code: `import { ${iconName} } from "react-icons/${setId}";\n\nexport function Example() {\n  return <${iconName} aria-hidden="true" />;\n`,
  };
}

/** Credit line built only from registry fields: name, project URL, license name, license URL. */
export function setAttribution(set: { name: string; license: string; licenseUrl: string; projectUrl: string }) {
  return `${set.name} (${set.projectUrl}). License: ${set.license}. ${set.licenseUrl}`;
}

/**
 * One paragraph per react-icons id. Facts come from that set's registry entry, from the component names and SVGs
 * in the package, or from the upstream project's own README. Counts stay in the page header so this text does not
 * go stale when the package updates.
 */
const SET_GUIDES: Record<string, string> = {
  ci: "Circum Icons is a single family of filled 24×24 interface icons. The project says it was drawn for a consistent visual weight, following Material and Carbon principles. Material Design icons split each symbol into filled and outline names; Circum keeps one drawing. The registry lists the set under the MPL-2.0 license.",
  fa: "Font Awesome 5 is the long-term support release of Font Awesome, which the project describes as an icon library and toolkit. The icons in react-icons/fa are filled glyphs, and the exports include brand marks such as FaGithub alongside interface symbols. Font Awesome 6 is the later release of the same project; each page header shows that package's icon count. The registry lists both under CC BY 4.0, so attribution follows the license URL.",
  fa6: "Font Awesome 6 is the current major version of Font Awesome. The project marks version 5 as long-term support and points new work at version 6. These icons are filled glyphs, including brand marks, in the same style as the Font Awesome 5 package. The registry lists the license as CC BY 4.0.",
  io: "Ionicons 4 is the icon set built for the Ionic Framework, for web, iOS, Android and desktop apps. This package keeps the v4 split: IoIos names, IoMd (Material Design) names, and IoLogo brand marks, drawn as filled glyphs. Ionicons 5 replaces that split with a default name, an Outline name and a Sharp name for each glyph. The registry lists the license as MIT.",
  io5: "Ionicons 5 is the later Ionicons set, still the icon set of the Ionic Framework. Each glyph is exported three times: an unsuffixed name, an Outline name and a Sharp name, plus IoLogo brand marks. The Outline icons are stroked (the home outline uses fill=\"none\" and a stroke). Ionicons 4 instead uses IoIos and IoMd prefixes for its iOS and Material drawings. The registry lists the license as MIT.",
  md: "Material Design icons are Google's classic Material Icons, the set the upstream repository distinguishes from the newer Material Symbols variable font. Names are filled (Md) or outline (MdOutline), with a handful of MdRound icons. Ant Design icons are the other design-system set with outline and filled prefixes, and they add a two-tone prefix. The registry lists the license as Apache License Version 2.0.",
  ti: "Typicons is a general-purpose icon font. In this package the default names are filled glyphs, and the names that end in Outline are the outline form of the same symbol. Themify Icons is the other small general-purpose icon font here; the registry lists Typicons as CC BY-SA 3.0 and Themify Icons as MIT.",
  go: "Github Octicons are the SVG icons GitHub builds for GitHub. Most names are one filled 24×24 drawing; a few end in Fill. They suit repository, diff and developer-tool chrome. Radix Icons are the compact 15×15 stroke alternative in this collection, and VS Code Icons are the editor glyphs, listed as CC BY 4.0. The registry lists Octicons as MIT.",
  fi: "Feather is a collection of open-source icons, each designed on a 24×24 grid with a 2px stroke. Every icon in this package is an outline: the SVG uses fill=\"none\" and stroke-width=\"2\". Lucide started as a fork of Feather and continues that stroke style with a larger set under the ISC license. Tabler Icons use the same 24×24, 2px stroke and also publish filled and brand names. The registry lists Feather as MIT.",
  lu: "Lucide is an open-source icon library and a fork of Feather Icons. The glyphs are outline strokes on a 24×24 grid with a 2px stroke, the same construction as Feather. Phosphor is the set to compare when an interface needs more than one weight: its component names add Bold, Light, Thin, Fill and Duotone families. The registry lists Lucide as ISC.",
  gi: "Game Icons are the filled pictorial SVGs published at game-icons.net, for games rather than product chrome. The paths are solid silhouettes colored with currentColor. Weather Icons is the other subject-specific filled set here, for weather and meteorological symbols instead of game objects. The registry lists Game Icons as CC BY 3.0.",
  wi: "Weather Icons is an icon font of weather, maritime and meteorological symbols, including wind directions and class names mapped to common forecast APIs. The glyphs are filled. Game Icons is the comparable subject-specific set, aimed at games and listed as CC BY 3.0. The registry lists Weather Icons as SIL OFL 1.1.",
  di: "Devicons is an iconic font made for developers: the exports are language, tool and platform marks such as DiReact and DiJavascript1. Simple Icons is the other brand set in this collection, described by its project as SVG icons for popular brands and listed as CC0. The registry lists Devicons as MIT.",
  ai: "Ant Design Icons are the SVG icons from the Ant Design project. The component names use three prefixes: AiOutline, AiFill and AiTwotone, so outline, filled and two-tone drawings are separate imports. Material Design icons also split filled and outline names, without a two-tone prefix, and are the larger classic Google set. The registry lists Ant Design Icons as MIT.",
  bs: "Bootstrap Icons is the official SVG icon library for Bootstrap. The project says the icons are built for Bootstrap and work in any project. They sit on a 16×16 viewBox, and the names come in a base form plus a filled form (the Fill suffix). IcoMoon Free is the other 16px-grid pack here, listed as CC BY 4.0. The registry lists Bootstrap Icons as MIT.",
  ri: "Remix Icon is a set of neutral-style system symbols. The project designs each icon in outlined and filled styles on a 24×24 grid, which this package exports as names ending in Line and names ending in Fill. Heroicons 2 also pairs an outline with a solid at 24×24, and adds a 20×20 mini solid under the MIT license. The registry lists Remix Icon as Apache License Version 2.0.",
  fc: "Flat Color Icons are Icons8's free multi-color set. The SVGs are filled with their own colors (the home icon uses #E8EAF6 and #C5CAE9, among others). Lucide, Heroicons and Simple Icons in this collection are monochrome and follow currentColor. The registry lists Flat Color Icons as MIT.",
  gr: "Grommet-Icons is the iconography for Grommet and React. The home icon is a 24×24 stroke with fill=\"none\" and stroke-width=\"2\", the same outline construction as Feather. This package is the set published for the Grommet design system. The registry lists the license as Apache License Version 2.0.",
  hi: "Heroicons are hand-crafted SVG icons by the makers of Tailwind CSS. In this first package the outline names (HiOutline) are 24×24 strokes with stroke-width=\"2\", and the unsuffixed names are 20×20 solid icons. Heroicons 2 keeps the outline and solid and moves both to 24×24, then adds a 20×20 HiMini solid. The registry lists the license as MIT.",
  hi2: "Heroicons 2 is the later Heroicons package from the makers of Tailwind CSS. It exports three families: Hi solid and HiOutline on a 24×24 grid (the outline uses a 1.5 stroke), and HiMini solid on a 20×20 grid. The first Heroicons package uses a 20×20 solid and a 24×24 outline only. Lucide is the stroke-only alternative, forked from Feather. The registry lists the license as MIT.",
  si: "Simple Icons is a set of SVG icons for popular brands. The marks are monochrome and use currentColor, as in the GitHub icon. Devicons is the smaller developer-tool font in this collection, under MIT. Font Awesome also ships brand marks, mixed into its filled UI set and listed as CC BY 4.0. The registry lists Simple Icons as CC0 1.0 Universal.",
  sl: "Simple Line Icons is a line-icon font shipped with CSS, Sass, LESS and web-font files. The glyphs are filled paths in a line style. Feather is the open-stroke comparison: 24×24, fill=\"none\", stroke-width=\"2\". The registry lists the license as MIT.",
  im: "IcoMoon Free is a free vector icon pack by Keyamoon. The project says the icons were designed on a 16px grid and look best at multiples of 16. The SVGs are filled. Bootstrap Icons use a 16×16 viewBox as well, with a base name and a Fill name, and are listed as MIT. The registry lists IcoMoon Free as CC BY 4.0 License.",
  bi: "Boxicons is an open-source set of web icons. Its own docs group them into regular (bx), solid (bxs) and logo (bxl) classes, which this package exports as Bi, BiSolid and BiLogo. Font Awesome also mixes interface icons and brand marks in one import, under the CC BY 4.0 license recorded for those packages. The registry lists Boxicons as MIT.",
  cg: "css.gg is an open-source library of CSS, SVG and Figma UI icons. This package is the SVG form: the root svg sets fill to none on a 24×24 viewBox, so the glyphs read as outlines. Feather is the other MIT outline set built as 24×24 strokes. The registry lists css.gg as MIT.",
  vsc: "VS Code Icons are the Visual Studio Code icon set, converted by the Codicons project into an icon font. The glyphs are filled and drawn on a 16×16 viewBox, for editor chrome and VS Code extension webviews. Github Octicons are the other product UI set here, built by GitHub for GitHub and listed as MIT. The registry lists VS Code Icons as CC BY 4.0.",
  tb: "Tabler Icons are MIT-licensed SVG icons, each designed on a 24×24 grid with a 2px stroke. The default names in this package are those outline strokes. Names ending in Filled and names starting with TbBrand are the filled and brand families in the same import. Lucide and Feather are the stroke-only sets to compare. The registry lists the license as MIT.",
  tfi: "Themify Icons is a set of icons for web design and apps. The project describes them as hand-crafted and inspired by iOS 7. The SVGs are filled. Typicons is the other small general-purpose icon font in this collection; the registry lists it as CC BY-SA 3.0 and lists Themify Icons as MIT.",
  rx: "Radix Icons is a crisp set of 15×15 icons designed by the WorkOS team. The home icon's viewBox is 0 0 15 15 and the SVG uses fill=\"none\", so they are small outline strokes for dense controls. Lucide and Feather are 24×24 strokes; Github Octicons are filled 24×24 product icons. The registry lists Radix Icons as MIT.",
  pi: "Phosphor Icons ships each glyph in six component-name families: an unsuffixed icon, plus Bold, Light, Thin, Fill and Duotone. That is the difference from Lucide and Feather, which are one stroke weight, and from Heroicons, which stops at outline, solid and mini. Use it when the same symbol has to match more than one text weight. The registry lists the license as MIT.",
  lia: "Icons8 Line Awesome is a set of line icons. The names follow Font Awesome (Lia beside Fa) and come in an unsuffixed form and a form ending in Solid. Font Awesome 5 and 6 in this collection are filled glyphs and are listed as CC BY 4.0. The registry lists Line Awesome as MIT.",
};

export function setGuide(id: string) {
  const text = SET_GUIDES[id];
  if (!text) throw new Error(`Missing icon set guide for ${id}`);
  return text;
}

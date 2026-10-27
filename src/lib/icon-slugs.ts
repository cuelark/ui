/** Readable URL slugs for icon sets: /icons/lucide, /icons/font-awesome-6 … (react-icons ids stay internal). */
export const SET_SLUGS: Record<string, string> = {
  ci: "circum",
  fa: "font-awesome-5",
  fa6: "font-awesome-6",
  io: "ionicons-4",
  io5: "ionicons-5",
  md: "material-design",
  ti: "typicons",
  go: "github-octicons",
  fi: "feather",
  lu: "lucide",
  gi: "game-icons",
  wi: "weather-icons",
  di: "devicons",
  ai: "ant-design",
  bs: "bootstrap",
  ri: "remix",
  fc: "flat-color",
  gr: "grommet",
  hi: "heroicons",
  hi2: "heroicons-2",
  si: "simple-icons",
  sl: "simple-line-icons",
  im: "icomoon",
  bi: "boxicons",
  cg: "css-gg",
  vsc: "vscode-codicons",
  tb: "tabler",
  tfi: "themify",
  rx: "radix",
  pi: "phosphor",
  lia: "line-awesome",
};

export const setSlug = (id: string) => SET_SLUGS[id] ?? id;
export const setIdFromSlug = (slug: string) => Object.entries(SET_SLUGS).find(([, s]) => s === slug)?.[0];

/** "arrow right" → "arrow-right"; non-alphanumerics collapse to single dashes. */
export const kebab = (words: string) =>
  words
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

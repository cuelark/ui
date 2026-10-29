/**
 * The theme gallery: one indexable page per preset (/themes/<slug>), with copy-ready CSS and a shadcn install
 * command. Plain data so the sitemap, llms.txt and the registry builder can share it.
 */
import { PRESETS, presetSlug, type SiteTheme } from "../lib/site-theme";

export type ThemePage = {
  slug: string;
  name: string;
  theme: SiteTheme;
  /** One line for cards and the meta description lead. */
  summary: string;
  /** The page's opening paragraph. */
  intro: string;
  /** The face it uses, and why when the original is not open source. */
  font: string;
  keywords: string[];
};

const COPY: Record<string, Omit<ThemePage, "slug" | "name" | "theme" | "summary">> = {
  Linear: {
    intro: "A theme in the style of Linear: near-white surfaces in light mode and near-black in dark, hairline borders, quiet grey text, and a single indigo accent for primary actions and focus. Inter at Linear's 510 and 590 weights, 8px corners, almost no shadow.",
    font: "Inter, the face Linear uses, at weights 510 and 590.",
    keywords: ["linear theme", "linear app theme shadcn", "linear style ui", "linear dark theme tailwind", "linear design system colors"],
  },
  Stripe: {
    intro: "A theme in the style of Stripe: navy text on cool white, blurple primary buttons, slate greys and soft blue-tinted shadows. Dark mode moves to a deep navy instead of grey.",
    font: "Instrument Sans. Stripe uses Söhne, a commercial face; Instrument Sans is the closest open alternative.",
    keywords: ["stripe theme", "stripe style ui", "stripe dashboard theme shadcn", "stripe colors tailwind", "blurple theme"],
  },
  Vercel: {
    intro: "A theme in the style of Vercel: black and white with neutral greys, Geist type, tight 6px corners, and blue reserved for focus and links. Primary buttons are solid black in light mode and white in dark.",
    font: "Geist, Vercel's own open-source face.",
    keywords: ["vercel theme", "geist theme shadcn", "vercel style ui", "black and white tailwind theme", "vercel dashboard colors"],
  },
  Supabase: {
    intro: "A theme in the style of Supabase: neutral greys, a near-black dark mode, and Supabase's green on primary buttons and focus rings.",
    font: "Inter. Supabase uses Circular, a commercial face; Inter is a close, neutral open alternative.",
    keywords: ["supabase theme", "supabase style ui", "green shadcn theme", "supabase dashboard colors tailwind"],
  },
  Notion: {
    intro: "A theme in the style of Notion: warm ink on white, soft beige-grey panels, small corners and Notion's blue for actions. Calm and built for long reading.",
    font: "IBM Plex Sans. Notion uses the system UI face; Plex keeps the same calm, readable feel everywhere.",
    keywords: ["notion theme", "notion style ui", "notion colors tailwind", "warm shadcn theme"],
  },
  Claude: {
    intro: "A theme in the style of Claude: warm paper backgrounds, clay-orange primary buttons, soft beige borders and generous corners, with a warm charcoal dark mode.",
    font: "Instrument Sans. Claude's interface uses a commercial face; Instrument Sans is the closest open alternative.",
    keywords: ["claude theme", "anthropic style ui", "claude colors tailwind", "warm orange shadcn theme", "ai chat theme"],
  },
  Cuelark: {
    intro: "Cuelark's own theme: cool mist surfaces, a vivid cobalt accent and crop marks that lock onto cards and previews.",
    font: "Inter.",
    keywords: ["cuelark theme", "cobalt theme shadcn", "blue tailwind theme"],
  },
  Paper: {
    intro: "Warm off-white paper, monochrome ink buttons and a chartreuse signal for focus and highlights.",
    font: "Inter.",
    keywords: ["paper theme shadcn", "warm minimal theme", "chartreuse accent theme"],
  },
  Mono: {
    intro: "Pure neutral greys, ink accents and Geist. Nothing competes with your content.",
    font: "Geist.",
    keywords: ["monochrome shadcn theme", "black and white theme", "minimal tailwind theme"],
  },
  Atelier: {
    intro: "Warm paper with a violet accent, editorial type and generous corners.",
    font: "Instrument Sans.",
    keywords: ["violet shadcn theme", "editorial theme", "purple tailwind theme"],
  },
  Terminal: {
    intro: "Square corners, compact controls, a mint signal and Space Grotesk, for developer tools and dashboards.",
    font: "Space Grotesk.",
    keywords: ["terminal theme shadcn", "developer tool theme", "square corners tailwind theme"],
  },
  Studio: {
    intro: "Zinc greys, coral primary buttons, soft SaaS type and roomy density.",
    font: "Plus Jakarta Sans.",
    keywords: ["coral shadcn theme", "saas theme tailwind", "friendly ui theme"],
  },
};

export const THEMES: ThemePage[] = PRESETS.map((p) => ({
  slug: presetSlug(p.name),
  name: p.name,
  theme: p.theme,
  summary: p.description,
  ...(COPY[p.name] ?? { intro: p.description, font: p.theme.font, keywords: [] }),
}));

export const themeBySlug = (slug: string) => THEMES.find((t) => t.slug === slug);
/** Registry item name for a theme, e.g. theme-linear. */
export const themeItem = (slug: string) => `theme-${slug}`;

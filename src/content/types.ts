export type Section = "Actions" | "Forms" | "Layout" | "Navigation" | "Overlays" | "Feedback" | "Display" | "Motion" | "Effects" | "Agents";
export type PropRow = { prop: string; type: string; default?: string; description: string };
export type ExampleDoc = { name: string; title: string; description: string };
export type ComponentDoc = {
  slug: string;
  name: string;
  section: Section;
  /** One line: registry description, cards and the meta description lead. */
  description: string;
  /** The opening paragraph of the docs page. */
  intro: string;
  /** What people search for; feeds the meta keywords and the page's "Also known as" line. */
  keywords: string[];
  /** The GSAP behaviour, shown in a "Motion" note on the page. Omit for static components. */
  motion?: string;
  usage: { imports: string; code: string };
  examples: ExampleDoc[];
  api: { part: string; description?: string; props: PropRow[] }[];
  accessibility: string[];
  faq: { q: string; a: string }[];
};

export const SECTIONS: Section[] = ["Agents", "Actions", "Forms", "Layout", "Navigation", "Overlays", "Feedback", "Display", "Motion", "Effects"];

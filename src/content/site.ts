export const SITE = {
  name: "Cuelark UI",
  url: "https://ui.cuelark.com",
  title: "Cuelark UI: animated shadcn/ui components and AI agent UI kit",
  description:
    "Open-source React components for shadcn/ui: an AI agent UI kit (chat, reasoning, tool calls, plans, citations, traces), GSAP-animated effects and accessible Radix primitives. Themeable with CSS variables, installed as source with the shadcn CLI.",
  github: "https://github.com/cuelark/ui",
  parent: { name: "Cuelark", url: "https://cuelark.com" },
  contact: "contact@cuelark.com",
} as const;

export type DocPage = { path: string; title: string; description: string };

/** Hand-written docs pages, in sidebar order. Component pages come from src/content/components.ts. */
export const DOC_PAGES: DocPage[] = [
  {
    path: "/docs",
    title: "Introduction",
    description: "What Cuelark UI is, how it relates to shadcn/ui, and the ideas behind its style.",
  },
  {
    path: "/docs/installation",
    title: "Installation",
    description: "Add Cuelark UI components to any shadcn/ui project with the shadcn CLI, by URL or by the @cuelark namespace.",
  },
  {
    path: "/docs/theming",
    title: "Theming",
    description: "Customize accent, radius, density and crop marks with CSS variables, and generate a theme with the live editor.",
  },
];

export const registryUrl = (name: string) => `${SITE.url}/r/${name}.json`;

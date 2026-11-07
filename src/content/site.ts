export const SITE = {
  name: "Cuelark",
  url: "https://ui.cuelark.com",
  title: "React components and AI agent UI kit · Cuelark",
  docsTitle: "React component documentation · Cuelark",
  description:
    "Open-source React components for shadcn/ui: an AI agent UI kit, GSAP-animated effects and accessible primitives, installed as source with the shadcn CLI.",
  github: "https://github.com/cuelark/ui",
  x: { handle: "@cuelark_", url: "https://x.com/cuelark_" },
  parent: { name: "Cuelark", url: "https://cuelark.com" },
  contact: "contact@cuelark.com",
} as const;

export type DocPage = { path: string; title: string; description: string };

/** Hand-written docs pages, in sidebar order. Component pages come from src/content/components.ts. */
export const DOC_PAGES: DocPage[] = [
  {
    path: "/docs",
    title: "Introduction",
    description: "What Cuelark is, how it relates to shadcn/ui, and the ideas behind its precise, tactile style. Free, open-source React components you install and own.",
  },
  {
    path: "/docs/installation",
    title: "Installation",
    description: "Add UI components to any shadcn/ui project with the shadcn CLI, by URL or by the @cuelark namespace, and connect the registry to your AI editor.",
  },
  {
    path: "/docs/theming",
    title: "Theming",
    description: "Customize accent, radius, density and crop marks with CSS variables, and generate a matching light and dark theme with the live editor.",
  },
];

export const registryUrl = (name: string) => `${SITE.url}/r/${name}.json`;

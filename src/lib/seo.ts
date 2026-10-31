import { SITE } from "@/content/site";
import { OG_IMAGE } from "@/lib/og";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  /** schema.org nodes, emitted together as one JSON-LD @graph. */
  jsonLd?: Record<string, unknown>[];
  /** Keep thin pages (e.g. empty search results) out of the index while still following their links. */
  noindex?: boolean;
  /** Absolute URL of a 1200×630 share image; defaults to the site card. */
  image?: string;
};

const absolute = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;

/** Head tags for a page: title, description, canonical, Open Graph, Twitter card and JSON-LD. */
export function seo({ title, description, path, keywords, type = "website", jsonLd = [], noindex = false, image: imageUrl }: SeoInput) {
  const url = absolute(path);
  const fullTitle = title === SITE.title ? title : `${title} · ${SITE.name}`;
  const image = imageUrl ?? OG_IMAGE;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
      ...(keywords?.length ? [{ name: "keywords", content: keywords.join(", ") }] : []),
      { property: "og:type", content: type },
      { property: "og:site_name", content: SITE.name },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${SITE.name}: ${title}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: SITE.x.handle },
      { name: "twitter:creator", content: SITE.x.handle },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: jsonLd.length ? [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLd }) }] : [],
  };
}

const ORG_ID = `${SITE.parent.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

export const ld = {
  organization: () => ({ "@type": "Organization", "@id": ORG_ID, name: SITE.parent.name, url: SITE.parent.url, email: SITE.contact, sameAs: [SITE.github, SITE.x.url] }),
  website: () => ({ "@type": "WebSite", "@id": SITE_ID, name: SITE.name, url: SITE.url, description: SITE.description, publisher: { "@id": ORG_ID } }),
  breadcrumbs: (items: { name: string; path: string }[]) => ({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absolute(item.path) })),
  }),
  faq: (items: { q: string; a: string }[]) => ({
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }),
  sourceCode: (name: string, description: string, path: string, keywords: string[]) => ({
    "@type": "SoftwareSourceCode",
    name,
    description,
    keywords: keywords.join(", "),
    url: absolute(path),
    codeRepository: SITE.github,
    programmingLanguage: ["TypeScript", "React"],
    runtimePlatform: "React 19, Tailwind CSS v4",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    author: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
  }),
  article: (title: string, description: string, path: string) => ({
    "@type": "TechArticle",
    headline: title,
    description,
    url: absolute(path),
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
  }),
  collection: (name: string, description: string, path: string, items: { name: string; path: string }[]) => ({
    "@type": "CollectionPage",
    name,
    description,
    url: absolute(path),
    isPartOf: { "@id": SITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, url: absolute(item.path) })),
    },
  }),
};

import { Link, createFileRoute } from "@tanstack/react-router";

import { ThemeGallery } from "@/components/site/themes/theme-gallery";
import { THEMES } from "@/content/themes";
import { SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";

const TITLE = "shadcn/ui themes: Linear, Stripe, Vercel and more";
const DESCRIPTION = `${THEMES.length} free themes for shadcn/ui and Tailwind CSS v4, each with light and dark mode: Linear, Stripe, Vercel, Supabase, Notion, Claude and Cuelark's own. Preview them live, copy the CSS or install with the shadcn CLI.`;
export const THEMES_FAQ = [
  { q: "How do I install a shadcn/ui theme?", a: "Open a theme and run its shadcn command, for example npx shadcn@latest add https://ui.cuelark.com/r/theme-linear.json. The CLI writes the light and dark CSS variables into your global stylesheet. Or copy the CSS and paste it after your Tailwind import." },
  { q: "Do these themes work with any shadcn/ui project?", a: "Yes. They set the standard shadcn/ui variables (background, foreground, primary, muted, border, ring and the rest), so every shadcn component picks them up. Cuelark components also read the signal, density and crop-mark variables." },
  { q: "Are these the official Linear or Stripe themes?", a: "No. They are independent themes inspired by each product's public look, with colors measured from their sites. They are not affiliated with or endorsed by those companies, and they use open-source fonts where the originals are commercial." },
  { q: "Can I preview components in a theme before installing it?", a: "Yes. Every theme page shows real components in light and dark mode, and every component page has a theme picker above its preview, plus a full-screen view." },
];

export const Route = createFileRoute("/themes/")({
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: "/themes",
      keywords: ["shadcn themes", "shadcn ui themes", "tailwind css themes", "shadcn theme generator", "linear theme", "stripe theme", "vercel theme", "dark mode theme tailwind", "shadcn color palette"],
      jsonLd: [
        ld.collection(TITLE, DESCRIPTION, "/themes", THEMES.map((t) => ({ name: `${t.name} theme`, path: `/themes/${t.slug}` }))),
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Themes", path: "/themes" },
        ]),
        ld.faq(THEMES_FAQ),
      ],
    }),
  component: ThemesPage,
});

function ThemesPage() {
  return (
    <main id="main" className="mx-auto grid max-w-7xl gap-12 px-4 pt-8 pb-24 sm:px-6">
      <header className="grid max-w-3xl gap-3">
        <span className="cue-label">Themes · {THEMES.length}</span>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Themes for shadcn/ui</h1>
        <p className="text-base text-pretty text-muted-foreground">
          Light and dark palettes in the style of products people love, tuned for the standard shadcn/ui variables. Search, flip to dark, apply one to this whole site, or open it to copy the CSS. Want your own?{" "}
          <Link to="/docs/theming" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
            Build one in the editor
          </Link>
          .
        </p>
      </header>
      <ThemeGallery />
      <section aria-labelledby="faq-title" className="grid gap-4">
        <h2 id="faq-title" className="text-lg font-semibold tracking-tight">
          Themes, answered
        </h2>
        <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
          {THEMES_FAQ.map((f) => (
            <div key={f.q} className="grid content-start gap-1.5 bg-card p-5">
              <dt className="text-sm font-medium">{f.q}</dt>
              <dd className="text-sm text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}

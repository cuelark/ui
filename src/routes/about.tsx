import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";

import { SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";

const DESCRIPTION =
  "Cuelark builds free browser tools, open-source React components and custom AI software. Questions or feedback? Email contact@cuelark.com.";

const LINKS = [
  { href: SITE.parent.url, label: "cuelark.com" },
  { href: "https://tools.cuelark.com", label: "tools.cuelark.com" },
  { href: "https://social.cuelark.com", label: "social.cuelark.com" },
  { href: SITE.github, label: "github.com/cuelark/ui" },
] as const;

export const Route = createFileRoute("/about")({
  head: () =>
    seo({
      title: "About",
      description: DESCRIPTION,
      path: "/about",
      jsonLd: [
        ld.organization(),
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "About", path: "/about" },
        ]),
      ],
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main id="main" className="mx-auto grid max-w-3xl gap-10 px-4 pt-10 pb-24 sm:px-6">
      <header className="grid gap-3">
        <span className="cue-label">About</span>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">About Cuelark</h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          Cuelark builds free browser tools, open-source React components and custom AI software. Questions or feedback? Email{" "}
          <a href={`mailto:${SITE.contact}`} className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
            {SITE.contact}
          </a>
          .
        </p>
      </header>
      <nav aria-label="Cuelark on the web" className="grid gap-3">
        <h2 className="cue-label">On the web</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                rel="noopener"
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium shadow-control transition-[border-color,box-shadow] hover:border-foreground/20 hover:shadow-raised"
              >
                {link.label}
                <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

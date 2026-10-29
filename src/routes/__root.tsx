import type { ReactNode } from "react";
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";

import { AssistantFab } from "@/components/site/assistant-fab";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { THEME_BOOT_SCRIPT } from "@/components/site/theme-toggle";
import { SITE } from "@/content/site";
import { Button } from "@/registry/cuelark/ui/button";
import { Empty, EmptyActions, EmptyDescription, EmptyIcon, EmptyTitle } from "@/registry/cuelark/ui/empty";
import { TooltipProvider } from "@/registry/cuelark/ui/tooltip";
import appCss from "@/styles/globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE.title },
      { name: "description", content: SITE.description },
      { name: "theme-color", content: "#fbfbfd", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#0f1014", media: "(prefers-color-scheme: dark)" },
      { name: "color-scheme", content: "light dark" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "alternate", type: "text/plain", href: "/llms.txt", title: "llms.txt" },
    ],
    scripts: [
      { children: THEME_BOOT_SCRIPT },
      ...(import.meta.env.PROD
        ? [{ src: "https://analytics.cuelark.com/js/script.js", defer: true, "data-website-id": "672g590k07053p5h" }]
        : []),
    ],
  }),
  component: Outlet,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <TooltipProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <AssistantFab />
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main id="main" className="mx-auto flex max-w-3xl px-4 py-24">
      <Empty>
        <EmptyIcon>
          <span className="font-mono text-sm font-semibold">404</span>
        </EmptyIcon>
        <EmptyTitle>This page is off the grid</EmptyTitle>
        <EmptyDescription>The page you are looking for does not exist or has moved. Try the component index or search with ⌘K.</EmptyDescription>
        <EmptyActions>
          <Button asChild>
            <Link to="/components">Browse components</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
        </EmptyActions>
      </Empty>
    </main>
  );
}

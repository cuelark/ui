import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import { SITE } from "@/content/site";
import { Badge } from "@/registry/cuelark/ui/badge";
import { Button } from "@/registry/cuelark/ui/button";
import { GithubMark, Logo } from "./logo";
import { Search } from "./search";
import { ThemeCustomizer } from "./theme-controls";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/docs", label: "Docs" },
  { to: "/components", label: "Components" },
  { to: "/agents", label: "Agents" },
  { to: "/icons", label: "Icons" },
  { to: "/docs/theming", label: "Theming" },
] as const;

export function SiteHeader() {
  const home = useRouterState({ select: (s) => s.location.pathname === "/" });
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    if (!home) return;
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);
  // On the landing page the nav floats inside the hero card, then turns into a glass bar once you scroll.
  const floating = home && !scrolled;
  return (
    <header
      data-floating={floating || undefined}
      className={cn(
        "top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        home ? "fixed inset-x-0" : "cue-dash-b sticky bg-background/80 backdrop-blur-md",
        home && !floating && "bg-background/80 shadow-[0_1px_0_var(--border)] backdrop-blur-md",
      )}
    >
      <div className={cn("mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6", floating && "mt-2 h-18 sm:px-10")}>
        <Link to="/" className="flex shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label={`${SITE.name} home`}>
          <Logo />
          <Badge mono size="sm" variant="outline" className="hidden sm:inline-flex">
            v1.0
          </Badge>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/docs" }}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[status=active]:text-foreground"
            >
              {item.label}
              {item.to === "/agents" && <span className="ms-1.5 inline-block size-1.5 translate-y-[-2px] rounded-full bg-signal" aria-label="new" />}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-1.5">
          <div className={cn("hidden sm:block", home && "lg:hidden")}>
            <Search />
          </div>
          <Button variant="ghost" size="icon-sm" asChild>
            <a href={SITE.github} aria-label="Cuelark UI on GitHub" rel="noopener">
              <GithubMark />
            </a>
          </Button>
          <ThemeCustomizer />
          <ThemeToggle />
          {home && (
            <div className="ms-1.5 hidden items-center gap-2 sm:flex">
              <Button size="sm" pill variant="outline" className="border-transparent bg-background/90 shadow-control backdrop-blur hover:bg-background" asChild>
                <Link to="/agents">Agent kit</Link>
              </Button>
              <Button size="sm" pill asChild>
                <Link to="/docs/installation">Get started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <nav aria-label="Main (mobile)" className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {NAV.map((item) => (
          <Link key={item.to} to={item.to} className="rounded-md px-2.5 py-1 text-sm whitespace-nowrap text-muted-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

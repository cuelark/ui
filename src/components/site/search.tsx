import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { BookOpenIcon, ComponentIcon, SearchIcon } from "lucide-react";

import { components, SECTIONS } from "@/content/components";
import { DOC_PAGES } from "@/content/site";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/cuelark/ui/command";

/** ⌘K / Ctrl K site search over docs pages and every component (name, section and search keywords). */
export function Search() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement))) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    void navigate({ to });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        className="flex size-ctl-sm items-center justify-center gap-2 rounded-lg border border-border bg-muted/60 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-60 sm:justify-start sm:ps-2.5 sm:pe-1"
      >
        <SearchIcon className="size-3.5 shrink-0" />
        <span className="flex-1 truncate text-left max-sm:sr-only">Search components…</span>
        <kbd className="cue-kbd max-sm:hidden">⌘K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search Cuelark UI" description="Jump to a component or docs page.">
        <CommandInput placeholder={`Search ${components.length} components and docs…`} />
        <CommandList>
          <CommandEmpty>Nothing matches. Try “menu” or “animation”.</CommandEmpty>
          <CommandGroup heading="Docs">
            {DOC_PAGES.map((p) => (
              <CommandItem key={p.path} value={p.title} keywords={[p.description]} onSelect={() => go(p.path)}>
                <BookOpenIcon />
                {p.title}
              </CommandItem>
            ))}
          </CommandGroup>
          {SECTIONS.map((section) => (
            <CommandGroup key={section} heading={section}>
              {components
                .filter((c) => c.section === section)
                .map((c) => (
                  <CommandItem key={c.slug} value={c.name} keywords={[...c.keywords, c.description]} onSelect={() => go(`/components/${c.slug}`)}>
                    <ComponentIcon />
                    {c.name}
                    <span className="ms-auto truncate ps-4 text-xs text-muted-foreground">{c.description}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

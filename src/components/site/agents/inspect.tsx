import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";

import { components } from "@/content/components";
import { cn } from "@/lib/utils";

const NAMES = new Map(components.map((c) => [c.slug, c.name]));
export const componentName = (slug: string) => NAMES.get(slug) ?? slug;

type InspectState = { on: boolean; setOn: (on: boolean) => void; hot: string | null; setHot: (slug: string | null) => void };
const InspectContext = React.createContext<InspectState>({ on: false, setOn: () => {}, hot: null, setHot: () => {} });
export const useInspect = () => React.useContext(InspectContext);

/** Inspect mode for a live demo: hovering (or focusing) any part outlines it and offers a tag to its docs page. */
export function InspectProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = React.useState(true);
  const [hot, setHot] = React.useState<string | null>(null);
  const value = React.useMemo(() => ({ on, setOn, hot: on ? hot : null, setHot }), [on, hot]);
  return <InspectContext.Provider value={value}>{children}</InspectContext.Provider>;
}

/** The area parts are inspected in: leaving it clears the highlight. */
export function InspectArea({ className, ...props }: React.ComponentProps<"div">) {
  const { setHot } = useInspect();
  return <div onMouseLeave={() => setHot(null)} className={className} {...props} />;
}

/**
 * Marks one component inside a demo. The innermost part under the pointer wins, so a Tool inside a Message
 * highlights the Tool. The outline and tag are drawn outside the component and never take pointer events, so the
 * demo stays fully usable while inspecting.
 */
export function Part({ slug, className, children }: { slug: string; className?: string; children: React.ReactNode }) {
  const { on, hot, setHot } = useInspect();
  const lit = hot === slug;
  const claim = (e: React.SyntheticEvent) => {
    if (!on) return;
    e.stopPropagation();
    if (hot !== slug) setHot(slug);
  };
  return (
    <div data-inspect={slug} data-lit={lit || undefined} className={cn("relative", className)} onMouseOver={claim} onFocus={claim}>
      {children}
      {on && (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -inset-1.5 z-20 rounded-2xl ring-2 ring-transparent transition-[box-shadow,background-color] duration-150 ease-out",
              lit && "bg-signal/[0.035] ring-signal/60",
            )}
          />
          <Link
            to="/components/$slug"
            params={{ slug }}
            tabIndex={lit ? 0 : -1}
            aria-hidden={!lit}
            className={cn(
              "absolute -top-3.5 right-2 z-30 inline-flex items-center gap-1 rounded-full bg-signal px-2 py-0.5 text-[0.6875rem] font-medium whitespace-nowrap text-signal-foreground shadow-raised outline-none",
              "translate-y-1 opacity-0 transition-[opacity,translate] duration-150 ease-out focus-visible:ring-3 focus-visible:ring-ring/50",
              lit ? "translate-y-0 opacity-100" : "pointer-events-none",
            )}
          >
            {componentName(slug)}
            <ArrowUpRightIcon className="size-3" />
          </Link>
        </>
      )}
    </div>
  );
}

/** The components a demo uses, as chips: hovering one lights it up in the demo, clicking opens its page. */
export function PartLegend({ slugs, className }: { slugs: string[]; className?: string }) {
  const { hot, setHot } = useInspect();
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Components in this demo">
      {slugs.map((slug) => (
        <li key={slug}>
          <Link
            to="/components/$slug"
            params={{ slug }}
            onMouseEnter={() => setHot(slug)}
            onMouseLeave={() => setHot(null)}
            onFocus={() => setHot(slug)}
            onBlur={() => setHot(null)}
            data-lit={hot === slug || undefined}
            className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-lit:border-signal/50 data-lit:bg-signal/10 data-lit:text-foreground"
          >
            {componentName(slug)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

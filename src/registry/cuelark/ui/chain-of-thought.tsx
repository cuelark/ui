"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { enterChildren, gsap, motionScale } from "@/lib/motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/cuelark/ui/collapsible";
import { TextShimmer } from "@/registry/cuelark/ui/text-shimmer";
import { cn } from "@/lib/utils";

type Status = "complete" | "active" | "pending";

/**
 * The steps an agent takes, on a rail that fills as it goes. Each finished step pops its marker and draws its
 * check, the active one breathes a signal ring, and the rail segment below a finished step fills top to bottom.
 * The header keeps a live count and a thin progress line.
 */
function ChainOfThought({ className, title = "Chain of thought", defaultOpen = true, children, ...props }: React.ComponentProps<typeof Collapsible> & { title?: React.ReactNode }) {
  const steps = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<StepProps>[];
  const done = steps.filter((s) => (s.props.status ?? "complete") === "complete").length;
  const running = steps.some((s) => s.props.status === "active");
  const bar = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = bar.current;
    if (!el) return;
    gsap.to(el, { scaleX: steps.length ? done / steps.length : 0, duration: motionScale(el) ? 0.6 : 0, ease: "cue" });
  }, [done, steps.length]);

  return (
    <Collapsible data-slot="chain-of-thought" defaultOpen={defaultOpen} className={cn("grid gap-3", className)} {...props}>
      <CollapsibleTrigger className="group/cot grid w-full gap-1.5 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="flex items-center gap-2 text-sm font-medium">
          {title}
          {running && <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-signal" />}
          <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
            {done}/{steps.length}
          </span>
          <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200 ease-cue group-data-[state=open]/cot:rotate-180" />
        </span>
        <span aria-hidden="true" className="relative block h-px w-full overflow-hidden bg-border">
          <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-signal" />
        </span>
      </CollapsibleTrigger>
      {/* Room for the active marker's ring, which the collapsible's overflow clip would otherwise cut. */}
      <CollapsibleContent className="-m-2 p-2">
        <ol className="grid">{children}</ol>
      </CollapsibleContent>
    </Collapsible>
  );
}

type StepProps = Omit<React.ComponentProps<"li">, "title"> & {
  status?: Status;
  label: React.ReactNode;
  icon?: React.ReactNode;
};

function ChainOfThoughtStep({ status = "complete", label, icon, className, children, ...props }: StepProps) {
  const ref = React.useRef<HTMLLIElement>(null);
  const prev = React.useRef<Status | null>(null);
  const breathe = React.useRef<gsap.core.Tween | null>(null);

  React.useLayoutEffect(() => {
    const li = ref.current;
    if (!li) return;
    const s = motionScale(li);
    const marker = li.querySelector<HTMLElement>('[data-part="marker"]');
    const check = li.querySelector<SVGPathElement>('[data-part="check"]');
    const fill = li.querySelector<HTMLElement>('[data-part="fill"]');
    const first = prev.current === null;
    const was = prev.current;
    prev.current = status;

    // Rail below this step: filled once the step is complete.
    if (fill) gsap.to(fill, { scaleY: status === "complete" ? 1 : 0, duration: s && !first ? 0.5 : 0, ease: "cue", delay: s && !first ? 0.15 : 0 });

    // The active marker breathes a signal ring drawn as its own box-shadow, so it can never drift off-center.
    breathe.current?.kill();
    if (marker) {
      if (status === "active" && s)
        breathe.current = gsap.fromTo(
          marker,
          { boxShadow: "0 0 0 0px color-mix(in oklch, var(--signal) 45%, transparent)" },
          { boxShadow: "0 0 0 7px color-mix(in oklch, var(--signal) 0%, transparent)", duration: 1.4, ease: "power1.out", repeat: -1 },
        );
      else gsap.set(marker, { clearProps: "boxShadow" });
    }

    if (!s) return;
    if (first) {
      gsap.fromTo(li, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "cue", clearProps: "opacity" });
    }
    if (status === "complete" && (was === "active" || was === "pending")) {
      if (marker) gsap.fromTo(marker, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.5)", clearProps: "transform" });
      if (check) gsap.fromTo(check, { strokeDashoffset: 14 }, { strokeDashoffset: 0, duration: 0.35, ease: "cue", delay: 0.08 });
    }
    if (status === "complete" && first && check) gsap.set(check, { strokeDashoffset: 0 });
  }, [status]);

  // Detail (search results, files) can arrive after the step: stagger it in the first time it appears.
  React.useLayoutEffect(() => {
    const detail = ref.current?.querySelector<HTMLElement>('[data-part="detail"]');
    const inner = detail?.firstElementChild;
    if (!detail || !inner || detail.dataset.shown !== undefined || !motionScale(detail)) return;
    detail.dataset.shown = "";
    // Grow the space smoothly so the steps below glide down instead of jumping, then stagger the content in.
    gsap.fromTo(detail, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.35, ease: "cue", clearProps: "height,opacity" });
    enterChildren(inner.children.length ? inner.children : [inner], { opacity: 0, y: 4, scale: 0.96 }, { stagger: 0.05, duration: 0.3, delay: 0.1 });
  });

  React.useEffect(() => () => void breathe.current?.kill(), []);

  return (
    <li ref={ref} data-slot="chain-of-thought-step" data-status={status} className={cn("group/step relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 pb-5 last:pb-0", className)} {...props}>
      {/* Rail: a quiet track, with a signal fill that grows when the step completes. */}
      <span aria-hidden="true" className="absolute top-3 -bottom-3 left-[0.5625rem] w-px bg-border group-last/step:hidden">
        <span data-part="fill" className="absolute inset-0 origin-top scale-y-0 bg-signal" />
      </span>
      <span className="relative z-10 mt-0.5 grid size-5 place-items-center">
        <span
          data-part="marker"
          className={cn(
            "relative grid size-5 place-items-center rounded-full border text-[0.625rem] transition-colors duration-200 [&_svg]:size-3",
            status === "complete" && "border-foreground bg-foreground text-background",
            status === "active" && "border-signal bg-background text-foreground",
            status === "pending" && "border-dashed border-input bg-background text-muted-foreground",
          )}
        >
          {status === "complete" ? (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path data-part="check" d="M3.5 8.5l3 3 6-7" strokeDasharray={14} strokeDashoffset={14} />
            </svg>
          ) : status === "active" ? (
            <span className="size-1.5 rounded-full bg-signal" />
          ) : (
            icon
          )}
        </span>
      </span>
      <div className="grid min-w-0 gap-2">
        <span className={cn("text-sm transition-colors duration-300", status === "pending" && "text-muted-foreground")}>
          {status === "active" ? <TextShimmer>{label}</TextShimmer> : label}
          <span className="sr-only">{status === "complete" ? " (done)" : status === "active" ? " (in progress)" : " (pending)"}</span>
        </span>
        {children && (
          <div data-part="detail" className="text-sm text-muted-foreground">
            {children}
          </div>
        )}
      </div>
    </li>
  );
}

export { ChainOfThought, ChainOfThoughtStep };

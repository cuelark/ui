"use client";

import * as React from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * A vertical timeline (changelogs, histories, order tracking). With `animate`, the rail draws itself
 * as you scroll and each entry's marker lights up when the line reaches it (GSAP ScrollTrigger).
 */
function Timeline({ className, animate = false, children, ...props }: React.ComponentProps<"ol"> & { animate?: boolean }) {
  const ref = React.useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!animate || !root || !motionScale(root)) return;
      const rail = root.querySelector('[data-slot="timeline-rail-fill"]');
      gsap.fromTo(rail, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 60%", scrub: 0.4 } });
      root.querySelectorAll<HTMLElement>('[data-slot="timeline-item"]').forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          onEnter: () => item.setAttribute("data-reached", ""),
          onLeaveBack: () => item.removeAttribute("data-reached"),
        });
        gsap.fromTo(item.querySelector('[data-slot="timeline-body"]'), { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.5, ease: "cue", scrollTrigger: { trigger: item, start: "top 80%" } });
      });
    },
    { scope: ref, dependencies: [animate] },
  );

  return (
    <ol ref={ref} data-slot="timeline" data-animate={animate || undefined} className={cn("relative grid gap-8 ps-8", className)} {...props}>
      <span aria-hidden="true" className="absolute top-1.5 bottom-1.5 start-[0.6875rem] w-px bg-border">
        <span data-slot="timeline-rail-fill" className={cn("absolute inset-0 origin-top bg-primary", !animate && "hidden")} />
      </span>
      {children}
    </ol>
  );
}

function TimelineItem({ className, children, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="timeline-item" className={cn("group/timeline relative", className)} {...props}>
      <span
        aria-hidden="true"
        className="absolute top-1 -start-8 flex size-[1.375rem] items-center justify-center rounded-full border border-border bg-background transition-colors duration-300 group-data-[reached]/timeline:border-primary"
      >
        <span className="size-2 rounded-full bg-muted-foreground/40 transition-[background-color,scale] duration-300 ease-cue group-data-[reached]/timeline:scale-125 group-data-[reached]/timeline:bg-primary [[data-slot=timeline]:not([data-animate])_&]:bg-primary" />
      </span>
      <div data-slot="timeline-body" className="grid gap-1">
        {children}
      </div>
    </li>
  );
}

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
  return <time data-slot="timeline-time" className={cn("cue-label", className)} {...props} />;
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="timeline-title" className={cn("text-[0.9375rem] font-semibold tracking-tight", className)} {...props} />;
}

function TimelineDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="timeline-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export { Timeline, TimelineItem, TimelineTime, TimelineTitle, TimelineDescription };

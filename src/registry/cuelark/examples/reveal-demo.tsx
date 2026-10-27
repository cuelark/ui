import * as React from "react";
import { ArrowDownIcon } from "lucide-react";

import { Reveal } from "@/registry/cuelark/ui/reveal";

const effects = ["rise", "wipe", "blur", "scale"] as const;

export default function RevealDemo() {
  const [panel, setPanel] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setPanel} className="relative h-96 w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
        <span className="cue-label">Scroll this panel</span>
        <ArrowDownIcon className="size-4 animate-bounce text-muted-foreground" />
      </div>
      <div className="grid gap-12 px-5 pt-[22rem] pb-16">
        {panel &&
          effects.map((effect) => (
            <section key={effect} className="grid gap-3">
              <span className="font-mono text-xs text-muted-foreground">effect=&quot;{effect}&quot;</span>
              <Reveal effect={effect} stagger scroller={panel} className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="grid aspect-square place-items-center rounded-xl border border-border bg-card text-sm font-medium shadow-control">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                ))}
              </Reveal>
            </section>
          ))}
      </div>
    </div>
  );
}

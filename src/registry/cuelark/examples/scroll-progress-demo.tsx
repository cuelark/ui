import * as React from "react";

import { ScrollProgress } from "@/registry/cuelark/ui/scroll-progress";

export default function ScrollProgressDemo() {
  const [box, setBox] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setBox} className="relative h-64 w-full max-w-md overflow-y-auto rounded-xl border border-border bg-card">
      <div className="sticky top-0 z-10 bg-card/90 px-5 pt-4 pb-3 backdrop-blur">
        <span className="cue-label">Reading · 4 min</span>
        {box && <ScrollProgress position="static" scroller={box} className="mt-3" />}
      </div>
      <div className="grid gap-4 px-5 pb-5 text-sm text-muted-foreground">
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i}>
            Paragraph {i + 1}. On a real page, drop ScrollProgress at the top of the layout with no target and it tracks the whole document; give it a target to follow a single
            article instead.
          </p>
        ))}
      </div>
    </div>
  );
}

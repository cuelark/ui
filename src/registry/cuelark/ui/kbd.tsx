import * as React from "react";

import { cn } from "@/lib/utils";

/** A keycap. Uses the theme's `cue-kbd` utility, so it matches the hints inside buttons, menus and tooltips. */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return <kbd data-slot="kbd" className={cn("cue-kbd", className)} {...props} />;
}

/** A key combination, e.g. `<KbdGroup keys={["⌘", "Shift", "P"]} />`; rendered as nested `<kbd>` per the HTML spec. */
function KbdGroup({ className, keys, separator, ...props }: React.ComponentProps<"kbd"> & { keys: string[]; separator?: React.ReactNode }) {
  return (
    <kbd data-slot="kbd-group" className={cn("inline-flex items-center gap-1 font-sans", className)} {...props}>
      {keys.map((key, i) => (
        <React.Fragment key={`${key}-${i}`}>
          {i > 0 && separator != null && <span className="text-xs text-muted-foreground">{separator}</span>}
          <kbd className="cue-kbd">{key}</kbd>
        </React.Fragment>
      ))}
    </kbd>
  );
}

export { Kbd, KbdGroup };

import * as React from "react";
import { BookmarkIcon, RotateCcwIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CheckpointProps = Omit<React.ComponentProps<"div">, "children"> & {
  label?: React.ReactNode;
  time?: string;
  onRestore?: () => void;
};

/** A restore point in a conversation: a dashed rule with a small pill; restoring rewinds the agent's work to here. */
function Checkpoint({ label = "Checkpoint", time, onRestore, className, ...props }: CheckpointProps) {
  return (
    <div data-slot="checkpoint" role="separator" className={cn("flex items-center gap-3 text-xs text-muted-foreground", className)} {...props}>
      <span className="cue-dash-b h-px flex-1" />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 ps-2.5 pe-1 shadow-control">
        <BookmarkIcon className="size-3" />
        <span className="font-medium text-foreground">{label}</span>
        {time && <span className="font-mono">{time}</span>}
        {onRestore && (
          <button type="button" onClick={onRestore} className="relative ms-1 inline-flex h-5 items-center gap-1 rounded-full px-2 after:absolute after:-inset-y-2 after:inset-x-0 font-medium text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
            <RotateCcwIcon className="size-3" /> Restore
          </button>
        )}
      </span>
      <span className="cue-dash-b h-px flex-1" />
    </div>
  );
}

export { Checkpoint };
export type { CheckpointProps };

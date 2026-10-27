"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/cuelark/ui/collapsible";
import { Spinner } from "@/registry/cuelark/ui/spinner";
import { TextShimmer } from "@/registry/cuelark/ui/text-shimmer";
import { cn } from "@/lib/utils";

type ReasoningProps = Omit<React.ComponentProps<typeof Collapsible>, "children"> & {
  /** True while the model is still thinking. */
  streaming?: boolean;
  /** Seconds spent thinking; measured automatically when omitted. */
  duration?: number;
  /** Status line while streaming. */
  label?: string;
  children?: React.ReactNode;
};

/**
 * A model's thinking, shown as it happens and tucked away when it is done: "Thinking…" shimmers next to the
 * crop-mark spinner, the trace streams in a faded window, then it collapses to "Thought for 6s".
 */
function Reasoning({ streaming = false, duration, label = "Thinking…", className, children, open: openProp, onOpenChange, ...props }: ReasoningProps) {
  const [open, setOpen] = React.useState(streaming);
  const started = React.useRef<number | null>(null);
  const [took, setTook] = React.useState(duration);
  const isOpen = openProp ?? open;

  React.useEffect(() => {
    if (streaming) {
      started.current ??= performance.now();
      setOpen(true);
      return;
    }
    if (started.current !== null && duration === undefined) setTook(Math.max(1, Math.round((performance.now() - started.current) / 1000)));
    const id = setTimeout(() => setOpen(false), 600);
    return () => clearTimeout(id);
  }, [streaming, duration]);

  return (
    <Collapsible
      data-slot="reasoning"
      open={isOpen}
      onOpenChange={(o) => {
        setOpen(o);
        onOpenChange?.(o);
      }}
      className={cn("grid gap-2", className)}
      {...props}
    >
      <CollapsibleTrigger className="group/reasoning flex w-fit items-center gap-2 rounded-md text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        {streaming ? (
          <>
            <Spinner size="sm" className="text-foreground" label="Thinking" />
            <TextShimmer className="font-medium">{label}</TextShimmer>
          </>
        ) : (
          <>
            <span className="font-medium">Thought</span>
            <span className="text-muted-foreground">for {took ?? duration ?? 1}s</span>
          </>
        )}
        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200 ease-cue group-data-[state=open]/reasoning:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="max-h-48 overflow-y-auto border-s-2 border-dashed border-border ps-4 text-sm leading-relaxed text-muted-foreground [mask-image:linear-gradient(transparent,black_12px,black_calc(100%-12px),transparent)] [&>*+*]:mt-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { Reasoning };
export type { ReasoningProps };

import * as React from "react";
import { Maximize2Icon, Minimize2Icon, PlayIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { Conversation, ConversationContent } from "@/registry/cuelark/ui/conversation";
import { cn } from "@/lib/utils";
import type { Script } from "./script";

type AgentWindowProps = {
  name: string;
  /** What the agent is working in, e.g. a repo or a workspace. */
  context: string;
  script: Script;
  thread: React.ReactNode;
  composer: React.ReactNode;
  panel: React.ReactNode;
  className?: string;
};

/**
 * The app frame every scenario runs in: the conversation and composer on the left, the run panel (trace, artifacts,
 * files) on the right. Tall enough to feel like a real product, never taller than the screen.
 */
export function AgentWindow({ name, context, script, thread, composer, panel, className }: AgentWindowProps) {
  // Full screen expands this same element in place, so a run keeps playing while you toggle it.
  const [full, setFull] = React.useState(false);
  React.useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);
  return (
    <div
      role={full ? "dialog" : undefined}
      aria-modal={full || undefined}
      aria-label={full ? `${name} demo, full screen` : undefined}
      className={cn(
        "grid overflow-hidden border border-border bg-background lg:grid-cols-[minmax(0,1fr)_minmax(20rem,27rem)]",
        full ? "fixed inset-0 z-[100] h-dvh grid-rows-[minmax(0,1fr)_auto] overflow-y-auto lg:grid-rows-1" : "rounded-2xl shadow-raised lg:h-[min(50rem,calc(100dvh-8rem))] lg:min-h-[38rem]",
        className,
      )}
    >
      <div className={cn("flex min-w-0 flex-col lg:h-auto lg:min-h-0", full ? "h-dvh" : "h-[44rem]")}>
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className={cn("size-2 rounded-full bg-signal", script.playing && "animate-pulse")} />
          <span className="text-sm font-medium">{name}</span>
          <span className="truncate font-mono text-xs text-muted-foreground">{context}</span>
          <Button variant={script.playing ? "ghost" : "secondary"} size="xs" className="ms-auto" onClick={script.play}>
            {script.playing ? <RotateCcwIcon /> : <PlayIcon />}
            {script.playing ? "Restart" : "Play the run"}
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setFull((f) => !f)} aria-label={full ? "Exit full screen" : "Full screen"} title={full ? "Exit full screen (Esc)" : "Full screen"}>
            {full ? <Minimize2Icon /> : <Maximize2Icon />}
          </Button>
        </div>
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="gap-5 p-5">{thread}</ConversationContent>
        </Conversation>
        <div className="border-t border-border p-3">{composer}</div>
      </div>
      <aside aria-label={`${name} run panel`} className="grid min-h-0 content-start gap-5 overflow-y-auto border-t border-border bg-muted/25 p-4 lg:border-t-0 lg:border-l">
        {panel}
      </aside>
    </div>
  );
}

/** A titled block in the run panel. */
export function PanelSection({ title, aside, className, children }: { title: string; aside?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("grid gap-2.5", className)}>
      <div className="flex min-h-6 items-center justify-between gap-2">
        <h3 className="cue-label">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** What the panel shows before the run reaches a section. */
export function PanelWaiting({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">{children}</p>;
}

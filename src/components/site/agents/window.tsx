import * as React from "react";
import { PlayIcon, RotateCcwIcon } from "lucide-react";

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
  return (
    <div className={cn("grid overflow-hidden rounded-2xl border border-border bg-background shadow-raised lg:h-[min(50rem,calc(100dvh-8rem))] lg:min-h-[38rem] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,27rem)]", className)}>
      <div className="flex h-[44rem] min-w-0 flex-col lg:h-auto lg:min-h-0">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className={cn("size-2 rounded-full bg-signal", script.playing && "animate-pulse")} />
          <span className="text-sm font-medium">{name}</span>
          <span className="truncate font-mono text-xs text-muted-foreground">{context}</span>
          <Button variant={script.playing ? "ghost" : "secondary"} size="xs" className="ms-auto" onClick={script.play}>
            {script.playing ? <RotateCcwIcon /> : <PlayIcon />}
            {script.playing ? "Restart" : "Play the run"}
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

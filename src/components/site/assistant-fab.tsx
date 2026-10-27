import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon, MessageCircleIcon, XIcon } from "lucide-react";
import { PiSparkleFill as SparklesIcon } from "react-icons/pi";

import { components } from "@/content/components";
import type { ComponentDoc } from "@/content/types";
import { gsap, motionScale } from "@/lib/motion";
import { Conversation, ConversationContent } from "@/registry/cuelark/ui/conversation";
import { Message, MessageAvatar, MessageContent } from "@/registry/cuelark/ui/message";
import { PromptInput } from "@/registry/cuelark/ui/prompt-input";
import { StreamingText } from "@/registry/cuelark/ui/streaming-text";
import { Suggestion, Suggestions } from "@/registry/cuelark/ui/suggestions";

type Turn = { id: number; from: "user" | "assistant"; text: string; picks?: ComponentDoc[] };

function find(query: string) {
  const words = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  return components
    .map((doc) => ({
      doc,
      score: words.reduce((s, w) => s + (doc.name.toLowerCase().includes(w) ? 5 : 0) + (doc.keywords.join(" ").toLowerCase().includes(w) ? 2 : 0) + (doc.description.toLowerCase().includes(w) ? 1 : 0), 0),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.doc);
}

const STARTERS = ["Build an AI chat", "Show approval flows", "Animated text", "Forms with validation"];

/**
 * A fixed round chat button in the corner that opens a small assistant, built from the library's own agent
 * components. It answers by recommending components for what you describe, streaming its reply.
 */
export function AssistantFab() {
  const [open, setOpen] = React.useState(false);
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [streamed, setStreamed] = React.useState(0);
  const panel = React.useRef<HTMLDivElement>(null);
  const last = turns.at(-1);
  const streaming = last?.from === "assistant" && streamed < last.text.length;

  React.useEffect(() => {
    if (!streaming) return;
    const id = setTimeout(() => setStreamed((n) => n + 4), 18);
    return () => clearTimeout(id);
  }, [streaming, streamed]);

  React.useLayoutEffect(() => {
    const el = panel.current;
    if (open && el && motionScale(el)) gsap.fromTo(el, { opacity: 0, scale: 0.92, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "cue", clearProps: "transform,opacity" });
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = (text: string) => {
    const picks = find(text);
    const reply = picks.length
      ? `For “${text}”, start with ${picks.map((p) => p.name).join(", ")}. Each installs with one shadcn command and follows your theme.`
      : `I couldn't match that to a component yet. Try describing the interface, like “chat input”, “toast” or “pricing”.`;
    setTurns((t) => [...t, { id: t.length, from: "user", text }, { id: t.length + 1, from: "assistant", text: reply, picks }]);
    setStreamed(0);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div
          ref={panel}
          role="dialog"
          aria-label="Cuelark assistant"
          className="flex h-[min(34rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-overlay"
        >
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <SparklesIcon className="size-4" />
            </span>
            <div className="grid flex-1">
              <span className="text-sm font-semibold">Ask Cuelark</span>
              <span className="text-xs text-muted-foreground">Finds the right component for you</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
              <XIcon className="size-4" />
            </button>
          </div>
          <Conversation className="flex-1">
            <ConversationContent className="gap-4">
              <Message from="assistant">
                <MessageAvatar className="bg-primary text-primary-foreground">
                  <SparklesIcon />
                </MessageAvatar>
                <MessageContent>
                  <p>Hi! Tell me what you're building and I'll point you to the components for it.</p>
                  {!turns.length && (
                    <Suggestions className="flex-wrap overflow-visible [mask-image:none]">
                      {STARTERS.map((s) => (
                        <Suggestion key={s} onClick={() => ask(s)}>
                          {s}
                        </Suggestion>
                      ))}
                    </Suggestions>
                  )}
                </MessageContent>
              </Message>
              {turns.map((t, i) => (
                <Message key={t.id} from={t.from}>
                  {t.from === "assistant" && (
                    <MessageAvatar className="bg-primary text-primary-foreground">
                      <SparklesIcon />
                    </MessageAvatar>
                  )}
                  <MessageContent>
                    {t.from === "assistant" && i === turns.length - 1 ? <StreamingText text={t.text.slice(0, streamed)} streaming={streaming} /> : <p>{t.text}</p>}
                    {t.picks && (i < turns.length - 1 || !streaming) && (
                      <ul className="grid gap-1.5">
                        {t.picks.map((p) => (
                          <li key={p.slug}>
                            <Link
                              to="/components/$slug"
                              params={{ slug: p.slug }}
                              onClick={() => setOpen(false)}
                              className="group flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted"
                            >
                              <span className="grid flex-1">
                                <span className="font-medium">{p.name}</span>
                                <span className="truncate text-xs text-muted-foreground">{p.description}</span>
                              </span>
                              <ArrowUpRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
          </Conversation>
          <div className="border-t border-border p-3">
            <PromptInput attachments={false} status={streaming ? "streaming" : "idle"} onStop={() => last && setStreamed(last.text.length)} onSubmit={({ text }) => text && ask(text)} placeholder="What are you building?" className="shadow-none" />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Ask Cuelark"}
        aria-expanded={open}
        className="grid size-13 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_-6px_color-mix(in_oklch,var(--primary)_60%,transparent)] outline-none transition-[scale,filter] duration-200 ease-cue hover:scale-105 hover:brightness-110 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95"
      >
        {open ? <XIcon className="size-5" /> : <MessageCircleIcon className="size-5.5" />}
      </button>
    </div>
  );
}

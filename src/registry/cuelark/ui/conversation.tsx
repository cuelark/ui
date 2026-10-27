"use client";

import * as React from "react";
import { ArrowDownIcon } from "lucide-react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ConversationContext = { atBottom: boolean; scrollToBottom: () => void };
const Ctx = React.createContext<ConversationContext>({ atBottom: true, scrollToBottom: () => {} });

/**
 * A chat transcript that sticks to the latest message while it streams, but lets go the moment you scroll up to
 * read; a "Latest" pill then offers the way back. Edges fade so text never cuts off hard.
 */
function Conversation({ className, children, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = React.useState(true);
  const stick = React.useRef(true);

  const scrollToBottom = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    stick.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior: motionScale(el) ? "smooth" : "auto" });
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      stick.current = bottom;
      setAtBottom(bottom);
    };
    const follow = new ResizeObserver(() => stick.current && (el.scrollTop = el.scrollHeight));
    el.addEventListener("scroll", onScroll, { passive: true });
    Array.from(el.children).forEach((c) => follow.observe(c));
    return () => {
      el.removeEventListener("scroll", onScroll);
      follow.disconnect();
    };
  }, []);

  return (
    <Ctx.Provider value={{ atBottom, scrollToBottom }}>
      <div data-slot="conversation" className={cn("relative min-h-0", className)}>
        <div
          ref={ref}
          role="log"
          aria-live="polite"
          className="size-full overflow-y-auto [mask-image:linear-gradient(transparent,black_16px,black_calc(100%-16px),transparent)]"
          {...props}
        >
          {children}
        </div>
        <ConversationScrollButton />
      </div>
    </Ctx.Provider>
  );
}

function ConversationContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="conversation-content" className={cn("grid gap-6 p-4", className)} {...props} />;
}

function ConversationScrollButton() {
  const { atBottom, scrollToBottom } = React.useContext(Ctx);
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = motionScale(el);
    gsap.to(el, atBottom ? { opacity: 0, y: 8, scale: 0.95, duration: s ? 0.15 : 0, pointerEvents: "none" } : { opacity: 1, y: 0, scale: 1, duration: s ? 0.25 : 0, ease: "cue", pointerEvents: "auto" });
  }, [atBottom]);
  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollToBottom}
      tabIndex={atBottom ? -1 : 0}
      className="absolute bottom-3 left-1/2 -ml-11 flex h-7 w-22 items-center justify-center gap-1 rounded-full border border-border bg-background/90 text-xs font-medium opacity-0 shadow-raised backdrop-blur outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ArrowDownIcon className="size-3.5" /> Latest
    </button>
  );
}

export { Conversation, ConversationContent };

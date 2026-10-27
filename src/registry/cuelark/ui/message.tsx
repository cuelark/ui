"use client";

import * as React from "react";

import { enterOnce } from "@/lib/motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/cuelark/ui/tooltip";
import { cn } from "@/lib/utils";

type From = "user" | "assistant";
const MessageContext = React.createContext<From>("assistant");

/**
 * One turn in a conversation. User turns sit in a bubble on the right; assistant turns read as a document on the
 * left, full width, with actions that appear on hover. New messages rise in once.
 */
function Message({ className, from = "assistant", ref, ...props }: React.ComponentProps<"div"> & { from?: From }) {
  const enter = React.useCallback((node: HTMLDivElement | null) => enterOnce(node, (s) => ({ opacity: 0, y: 8 * s }), { duration: 0.35 }), []);
  return (
    <MessageContext.Provider value={from}>
      <div
        ref={(node) => {
          enter(node);
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        data-slot="message"
        data-from={from}
        className={cn("group/message flex w-full gap-3", from === "user" ? "flex-row-reverse" : "flex-row", className)}
        {...props}
      />
    </MessageContext.Provider>
  );
}

function MessageAvatar({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn("grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-muted text-xs font-medium ring-1 ring-border [&_img]:size-full [&_img]:object-cover [&_svg]:size-3.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  const from = React.useContext(MessageContext);
  return (
    <div
      data-slot="message-content"
      className={cn(
        "grid min-w-0 gap-3 text-sm leading-relaxed",
        from === "user" ? "max-w-[80%] rounded-2xl rounded-se-md bg-secondary px-4 py-2.5 text-secondary-foreground" : "flex-1 pt-0.5",
        className,
      )}
      {...props}
    />
  );
}

/** A row of quiet icon actions (copy, retry, rate) that fades in when the message is hovered or focused. */
function MessageActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-actions"
      className={cn("-ms-1.5 flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover/message:opacity-100 group-focus-within/message:opacity-100 [@media(hover:none)]:opacity-100", className)}
      {...props}
    />
  );
}

function MessageAction({ label, className, children, ...props }: React.ComponentProps<"button"> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-[background-color,color,scale] duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-90 [&_svg]:size-3.5",
            className,
          )}
          {...props}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export { Message, MessageAvatar, MessageContent, MessageActions, MessageAction };

"use client";

import * as React from "react";
import { ArrowUpIcon, PaperclipIcon, SquareIcon, XIcon } from "lucide-react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PromptInputProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  onSubmit?: (message: { text: string; files: File[] }) => void;
  /** While streaming, the send button becomes Stop. */
  status?: "idle" | "streaming";
  onStop?: () => void;
  placeholder?: string;
  /** Extra controls in the toolbar, e.g. a ModelSelector. */
  toolbar?: React.ReactNode;
  /** Allow attaching files (button, paste and drop). */
  attachments?: boolean;
  disabled?: boolean;
};

/**
 * The composer for talking to an agent. It grows with the text; Enter sends and Shift+Enter breaks a line; files
 * attach by button, paste or drop; while the agent works, Send turns into Stop (Esc). On send, a signal line
 * sweeps the top edge.
 */
function PromptInput({ onSubmit, status = "idle", onStop, placeholder = "Ask anything…", toolbar, attachments = true, disabled, className, ...props }: PromptInputProps) {
  const [text, setText] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [over, setOver] = React.useState(false);
  const form = React.useRef<HTMLFormElement>(null);
  const picker = React.useRef<HTMLInputElement>(null);
  const streaming = status === "streaming";
  const canSend = !disabled && !streaming && (text.trim().length > 0 || files.length > 0);

  const send = () => {
    if (!canSend) return;
    onSubmit?.({ text: text.trim(), files });
    setText("");
    setFiles([]);
    const line = form.current?.querySelector('[data-slot="prompt-sweep"]');
    if (line && form.current && motionScale(form.current)) gsap.fromTo(line, { scaleX: 0, opacity: 1, transformOrigin: "left" }, { scaleX: 1, duration: 0.5, ease: "cue", onComplete: () => void gsap.to(line, { opacity: 0, duration: 0.3 }) });
  };

  React.useEffect(() => {
    if (!streaming) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onStop?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [streaming, onStop]);

  return (
    <form
      ref={form}
      data-slot="prompt-input"
      data-over={over || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      onDragOver={(e) => attachments && (e.preventDefault(), setOver(true))}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        if (!attachments) return;
        e.preventDefault();
        setOver(false);
        setFiles((f) => [...f, ...Array.from(e.dataTransfer.files)]);
      }}
      className={cn(
        "relative grid gap-2 overflow-hidden rounded-2xl border border-input bg-card p-2 shadow-raised transition-[border-color,box-shadow] duration-150 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20 data-[over]:border-ring data-[over]:bg-signal/5",
        className,
      )}
      {...props}
    >
      <span data-slot="prompt-sweep" aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-signal opacity-0" />
      {files.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 px-1 pt-1">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="inline-flex h-7 max-w-48 items-center gap-1.5 rounded-lg border border-border bg-muted/60 ps-2 pe-1 text-xs">
              <PaperclipIcon className="size-3 shrink-0 text-muted-foreground" />
              <span className="truncate">{f.name}</span>
              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles((all) => all.filter((_, j) => j !== i))} className="grid size-5 place-items-center rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-foreground">
                <XIcon className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <textarea
        value={text}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="Message"
        onChange={(e) => setText(e.target.value)}
        onPaste={(e) => {
          if (attachments && e.clipboardData.files.length) setFiles((f) => [...f, ...Array.from(e.clipboardData.files)]);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            send();
          }
        }}
        className="max-h-48 min-h-11 w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground/80 [field-sizing:content]"
      />
      <div className="flex items-center gap-1">
        {attachments && (
          <>
            <button
              type="button"
              aria-label="Attach files"
              onClick={() => picker.current?.click()}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <PaperclipIcon className="size-4" />
            </button>
            <input ref={picker} type="file" multiple hidden onChange={(e) => e.target.files && setFiles((f) => [...f, ...Array.from(e.target.files!)])} />
          </>
        )}
        {toolbar}
        <span className="ms-auto hidden items-center gap-1 pe-1 text-[0.6875rem] text-muted-foreground sm:flex">
          {streaming ? (
            <>
              <kbd className="cue-kbd">esc</kbd> to stop
            </>
          ) : (
            <>
              <kbd className="cue-kbd">⏎</kbd> to send
            </>
          )}
        </span>
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="relative grid size-8 place-items-center rounded-full bg-primary text-primary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95"
          >
            <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-signal/40 motion-reduce:hidden" />
            <SquareIcon className="relative size-3 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground outline-none transition-[opacity,scale] duration-150 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95 disabled:opacity-30"
          >
            <ArrowUpIcon className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
}

export { PromptInput };
export type { PromptInputProps };

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { DownloadIcon, Maximize2Icon, Minimize2Icon, XIcon } from "lucide-react";

import { enterOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ArtifactProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: React.ReactNode;
  /** Kind shown as a label, e.g. "Document", "React component", "Chart". */
  kind?: string;
  onClose?: () => void;
  onDownload?: () => void;
  /** Extra header actions. */
  actions?: React.ReactNode;
};

/**
 * Something an agent made (a document, a component, a chart) shown in its own panel beside the chat, with a header
 * of actions and a full-screen toggle.
 */
function Artifact({ title, kind, onClose, onDownload, actions, className, children, ...props }: ArtifactProps) {
  const [full, setFull] = React.useState(false);
  React.useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [full]);
  const enter = React.useCallback((node: HTMLElement | null) => enterOnce(node, (s) => ({ opacity: 0, x: 16 * s }), { duration: 0.35 }), []);
  const btn = "grid size-7 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-3.5";
  const panel = (
    <section
      ref={full ? undefined : enter}
      data-slot="artifact"
      data-fullscreen={full || undefined}
      role={full ? "dialog" : undefined}
      aria-modal={full || undefined}
      className={cn("flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-raised", full ? "fixed inset-3 z-[100] sm:inset-6" : className)}
      {...props}
    >
      <header className="flex items-center gap-2 border-b border-border px-3 py-2">
        <div className="grid min-w-0 flex-1">
          {kind && <span className="cue-label">{kind}</span>}
          <span className="truncate text-sm font-medium">{title}</span>
        </div>
        {actions}
        {onDownload && (
          <button type="button" aria-label="Download" onClick={onDownload} className={btn}>
            <DownloadIcon />
          </button>
        )}
        <button type="button" aria-label={full ? "Exit full screen" : "Full screen"} onClick={() => setFull((f) => !f)} className={btn}>
          {full ? <Minimize2Icon /> : <Maximize2Icon />}
        </button>
        {onClose && (
          <button type="button" aria-label="Close" onClick={onClose} className={btn}>
            <XIcon />
          </button>
        )}
      </header>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </section>
  );
  if (!full) return panel;
  return createPortal(
    <>
      <div aria-hidden="true" onClick={() => setFull(false)} className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-[2px] dark:bg-black/60" />
      {panel}
    </>,
    document.body,
  );
}

export { Artifact };
export type { ArtifactProps };

"use client";

import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon, MonitorIcon, RotateCwIcon, SmartphoneIcon, TabletIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type WebPreviewProps = React.ComponentProps<"div"> & {
  /** The page to show. */
  url: string;
  onUrlChange?: (url: string) => void;
  /** Render custom content instead of an iframe (e.g. a sandboxed component preview). */
  children?: React.ReactNode;
};

const WIDTHS = { desktop: "100%", tablet: "768px", mobile: "390px" } as const;

/** A small browser for what an agent built: address bar, reload, open-in-new-tab and desktop/tablet/mobile widths. */
function WebPreview({ url, onUrlChange, className, children, ...props }: WebPreviewProps) {
  const [draft, setDraft] = React.useState(url);
  const [device, setDevice] = React.useState<keyof typeof WIDTHS>("desktop");
  const [key, setKey] = React.useState(0);
  React.useEffect(() => setDraft(url), [url]);
  const btn = "grid size-7 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-muted aria-pressed:text-foreground [&_svg]:size-3.5";

  return (
    <div data-slot="web-preview" className={cn("flex min-h-80 flex-col overflow-hidden rounded-2xl border border-border bg-card", className)} {...props}>
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        <button type="button" aria-label="Back" className={btn}>
          <ArrowLeftIcon />
        </button>
        <button type="button" aria-label="Forward" className={btn}>
          <ArrowRightIcon />
        </button>
        <button type="button" aria-label="Reload" className={btn} onClick={() => setKey((k) => k + 1)}>
          <RotateCwIcon />
        </button>
        <form
          className="mx-1 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            onUrlChange?.(draft);
          }}
        >
          <input value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Address" className="h-7 w-full rounded-md bg-muted px-2.5 font-mono text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/40" />
        </form>
        {(["desktop", "tablet", "mobile"] as const).map((d) => {
          const Icon = d === "desktop" ? MonitorIcon : d === "tablet" ? TabletIcon : SmartphoneIcon;
          return (
            <button key={d} type="button" aria-label={d} aria-pressed={device === d} onClick={() => setDevice(d)} className={btn}>
              <Icon />
            </button>
          );
        })}
        {/^https?:\/\//.test(url) && (
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Open in new tab" className={btn}>
            <ExternalLinkIcon />
          </a>
        )}
      </div>
      <div className="flex flex-1 justify-center bg-muted/40 p-2">
        <div className="h-full overflow-hidden rounded-lg bg-background ring-1 ring-border transition-[width] duration-300 ease-cue" style={{ width: WIDTHS[device], maxWidth: "100%" }}>
          {children ?? <iframe key={key} src={url} title="Preview" className="size-full min-h-72 border-0" sandbox="allow-scripts allow-same-origin allow-forms" />}
        </div>
      </div>
    </div>
  );
}

export { WebPreview };
export type { WebPreviewProps };

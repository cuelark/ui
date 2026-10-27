"use client";

import * as React from "react";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";

import { enterChildren, gsap, marksIn, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FileDropzoneProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** Called with the accepted files (after accept/size checks). */
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  /** Maximum size per file in bytes. */
  maxSize?: number;
  hint?: React.ReactNode;
};

const formatBytes = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`);

/**
 * Drag-and-drop upload area. While a file is dragged over, the crop marks lock onto the zone and the icon lifts;
 * dropped files list in with a stagger and can be removed. Click or press Enter to browse instead.
 */
function FileDropzone({ onFilesChange, accept, multiple = true, maxSize, hint, className, ...props }: FileDropzoneProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [over, setOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const zone = React.useRef<HTMLDivElement>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const list = React.useRef<HTMLUListElement>(null);
  const before = React.useRef(0);

  const take = (incoming: FileList | null) => {
    if (!incoming) return;
    const ok: File[] = [];
    const rejected: string[] = [];
    for (const f of Array.from(incoming)) {
      if (maxSize && f.size > maxSize) rejected.push(`${f.name} is over ${formatBytes(maxSize)}`);
      else ok.push(f);
    }
    setError(rejected[0] ?? null);
    const next = multiple ? [...files, ...ok] : ok.slice(0, 1);
    before.current = multiple ? files.length : 0;
    setFiles(next);
    onFilesChange?.(next);
  };

  React.useLayoutEffect(() => {
    const items = list.current ? Array.from(list.current.children).slice(before.current) : [];
    if (items.length && list.current && motionScale(list.current)) enterChildren(items, { opacity: 0, y: 8 }, { stagger: 0.05 });
    before.current = files.length;
  }, [files.length]);

  React.useEffect(() => {
    const el = zone.current;
    if (!el || !motionScale(el)) return;
    if (over) marksIn(el);
    gsap.to(el.querySelector('[data-slot="dropzone-icon"]'), { y: over ? -6 : 0, scale: over ? 1.08 : 1, duration: 0.25, ease: "cue" });
  }, [over]);

  return (
    <div data-slot="file-dropzone" className={cn("grid gap-3", className)} {...props}>
      <div
        ref={zone}
        role="button"
        tabIndex={0}
        aria-label="Upload files: drop them here or press Enter to browse"
        data-over={over || undefined}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), input.current?.click())}
        onDragEnter={(e) => (e.preventDefault(), setOver(true))}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files);
        }}
        className="relative grid cursor-pointer justify-items-center gap-2 rounded-2xl border border-dashed border-input bg-muted/30 px-6 py-10 text-center outline-none transition-colors duration-200 hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 data-[over]:cue-marks data-[over]:border-ring data-[over]:bg-signal/10"
      >
        <span data-slot="dropzone-icon" className="grid size-11 place-items-center rounded-xl border border-border bg-card shadow-raised">
          <UploadCloudIcon className="size-5" />
        </span>
        <p className="text-sm font-medium">{over ? "Drop to upload" : "Drop files here or click to browse"}</p>
        <p className="text-xs text-muted-foreground">{hint ?? (maxSize ? `Up to ${formatBytes(maxSize)} each` : "Any file type")}</p>
        <input ref={input} type="file" accept={accept} multiple={multiple} className="sr-only" tabIndex={-1} onChange={(e) => take(e.target.files)} />
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
      {files.length > 0 && (
        <ul ref={list} className="grid gap-2">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 text-sm shadow-control">
              <span className="grid size-8 place-items-center rounded-md bg-muted">
                <FileIcon className="size-4 text-muted-foreground" />
              </span>
              <span className="grid min-w-0 flex-1">
                <span className="truncate font-medium">{f.name}</span>
                <span className="font-mono text-[0.6875rem] text-muted-foreground">{formatBytes(f.size)}</span>
              </span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => {
                  const next = files.filter((_, j) => j !== i);
                  setFiles(next);
                  onFilesChange?.(next);
                }}
                className="grid size-7 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { FileDropzone };
export type { FileDropzoneProps };

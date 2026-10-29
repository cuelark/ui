"use client";

import * as React from "react";
import { GripVerticalIcon, XIcon } from "lucide-react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type QueueItem = { id: string; text: string };

type QueueProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  items: QueueItem[];
  onItemsChange?: (items: QueueItem[]) => void;
  label?: React.ReactNode;
};

/**
 * Messages queued while the agent is busy. Each waits in line above the composer; reorder with Alt+↑/↓, remove with
 * ×, and the next one slides out when the agent picks it up.
 */
function Queue({ items, onItemsChange, label = "Queued", className, ...props }: QueueProps) {
  const ref = React.useRef<HTMLUListElement>(null);
  const prev = React.useRef(items.map((i) => i.id));

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionScale(el)) return;
    Array.from(el.children).forEach((li) => {
      const id = (li as HTMLElement).dataset.id!;
      if (!prev.current.includes(id)) gsap.fromTo(li, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: "cue" });
    });
    prev.current = items.map((i) => i.id);
  }, [items]);

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onItemsChange?.(next);
  };

  if (!items.length) return null;
  return (
    <div data-slot="queue" className={cn("grid gap-1.5 rounded-xl border border-dashed border-border bg-muted/30 p-2", className)} {...props}>
      <div className="flex items-center justify-between px-1">
        <span className="cue-label">{label}</span>
        <span className="font-mono text-[0.6875rem] text-muted-foreground">{items.length}</span>
      </div>
      <ul ref={ref} className="grid gap-1">
        {items.map((it, i) => (
          <li
            key={it.id}
            data-id={it.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
                e.preventDefault();
                move(i, e.key === "ArrowUp" ? -1 : 1);
              }
              if (e.key === "Delete" || e.key === "Backspace") onItemsChange?.(items.filter((x) => x.id !== it.id));
            }}
            className="group/q flex items-center gap-2 rounded-lg bg-card px-2 py-1.5 text-sm shadow-control ring-1 ring-border outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <GripVerticalIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
            <span className="font-mono text-[0.6875rem] text-muted-foreground">{i + 1}</span>
            <span className="flex-1 truncate">{it.text}</span>
            <button type="button" aria-label={`Remove “${it.text}”`} onClick={() => onItemsChange?.(items.filter((x) => x.id !== it.id))} className="relative after:absolute after:-inset-2 grid size-5 place-items-center rounded text-muted-foreground opacity-0 group-hover/q:opacity-100 group-focus-within/q:opacity-100 hover:bg-muted hover:text-foreground pointer-coarse:opacity-100">
              <XIcon className="size-3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Queue };
export type { QueueItem, QueueProps };

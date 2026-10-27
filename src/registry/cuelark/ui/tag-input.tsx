"use client";

import * as React from "react";
import { XIcon } from "lucide-react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TagInputProps = Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange"> & {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  /** Suggestions shown while typing; Tab or Enter accepts the first match. */
  suggestions?: string[];
  max?: number;
};

/**
 * Tags typed into one field: Enter or comma adds, Backspace on an empty field selects then removes the last
 * tag, paste splits on commas. New tags pop in, duplicates shake instead of being added twice.
 */
function TagInput({ value, defaultValue = [], onValueChange, suggestions = [], max, placeholder = "Add a tag…", className, ...props }: TagInputProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const tags = value ?? internal;
  const [draft, setDraft] = React.useState("");
  const [armed, setArmed] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);
  const match = draft ? suggestions.find((s) => s.toLowerCase().startsWith(draft.toLowerCase()) && !tags.includes(s)) : undefined;

  const commit = (next: string[]) => {
    setInternal(next);
    onValueChange?.(next);
  };
  const add = (raw: string) => {
    const items = raw.split(",").map((t) => t.trim()).filter(Boolean);
    const next = [...tags];
    for (const t of items) {
      const dup = next.findIndex((x) => x.toLowerCase() === t.toLowerCase());
      if (dup >= 0) {
        const el = listRef.current?.children[dup];
        if (el && motionScale(el)) gsap.fromTo(el, { x: 0 }, { keyframes: { x: [0, -4, 4, -2, 0] }, duration: 0.35 });
      } else if (!max || next.length < max) next.push(t);
    }
    if (next.length !== tags.length) commit(next);
    setDraft("");
  };

  React.useLayoutEffect(() => {
    const last = listRef.current?.lastElementChild;
    if (last && motionScale(last) && last.getAttribute("data-new") === "true") {
      last.setAttribute("data-new", "false");
      gsap.fromTo(last, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "cue-snap" });
    }
  }, [tags.length]);

  return (
    <div
      data-slot="tag-input"
      className={cn(
        "flex min-h-ctl-md w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border border-input bg-card px-1.5 py-1 shadow-well transition-[border-color,box-shadow] duration-150 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/20",
        className,
      )}
      onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
    >
      <div ref={listRef} className="contents">
        {tags.map((t, i) => (
          <span
            key={t}
            data-new="true"
            className={cn(
              "inline-flex h-6 items-center gap-1 rounded-md border border-border bg-secondary ps-2 pe-1 text-xs font-medium transition-colors",
              armed && i === tags.length - 1 && "border-destructive/50 bg-destructive/10 text-destructive",
            )}
          >
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              onClick={() => commit(tags.filter((x) => x !== t))}
              className="grid size-4 place-items-center rounded-sm text-muted-foreground outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="relative min-w-24 flex-1">
        <input
          value={draft}
          placeholder={tags.length ? "" : placeholder}
          onChange={(e) => {
            setArmed(false);
            if (e.target.value.endsWith(",")) add(e.target.value);
            else setDraft(e.target.value);
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (text.includes(",")) {
              e.preventDefault();
              add(text);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft) {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Tab" && match) {
              e.preventDefault();
              add(match);
            } else if (e.key === "Backspace" && !draft && tags.length) {
              if (armed) {
                commit(tags.slice(0, -1));
                setArmed(false);
              } else setArmed(true);
            } else if (e.key === "Escape") setArmed(false);
          }}
          className="h-6 w-full bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground/80"
          {...props}
        />
        {match && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1 flex items-center text-sm text-muted-foreground/60">
            <span className="invisible">{draft}</span>
            {match.slice(draft.length)}
            <kbd className="cue-kbd ms-2 h-4 text-[0.625rem]">tab</kbd>
          </span>
        )}
      </div>
    </div>
  );
}

export { TagInput };
export type { TagInputProps };

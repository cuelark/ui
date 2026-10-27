"use client";

import * as React from "react";
import { ChevronRightIcon, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type TreeNode = { name: string; children?: TreeNode[]; status?: "added" | "modified" | "deleted" };

type FileTreeProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  tree: TreeNode[];
  /** Selected file path, e.g. "src/lib/tax.ts". */
  selected?: string;
  onSelect?: (path: string) => void;
  defaultExpanded?: string[];
};

const STATUS = { added: "text-success", modified: "text-warning", deleted: "text-destructive line-through" };
const MARK = { added: "A", modified: "M", deleted: "D" };

/** The files an agent touched, as a tree: folders expand, changed files carry A/M/D marks, and keyboard arrows walk it. */
function FileTree({ tree, selected, onSelect, defaultExpanded = [], className, ...props }: FileTreeProps) {
  const [open, setOpen] = React.useState(() => new Set(defaultExpanded));
  const toggle = (p: string) => setOpen((s) => (s.has(p) ? (s.delete(p), new Set(s)) : new Set(s).add(p)));

  const render = (nodes: TreeNode[], base: string, depth: number): React.ReactNode =>
    nodes.map((n) => {
      const path = base ? `${base}/${n.name}` : n.name;
      const folder = !!n.children;
      const isOpen = open.has(path);
      return (
        <li key={path} role="treeitem" aria-expanded={folder ? isOpen : undefined} aria-selected={selected === path}>
          <button
            type="button"
            onClick={() => (folder ? toggle(path) : onSelect?.(path))}
            className={cn(
              "flex h-7 w-full items-center gap-1.5 rounded-md pe-2 text-left font-mono text-xs outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
              selected === path && "bg-accent text-accent-foreground",
            )}
            style={{ paddingInlineStart: 6 + depth * 14 }}
          >
            {folder ? <ChevronRightIcon className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-cue", isOpen && "rotate-90")} /> : <span className="w-3.5" />}
            {folder ? (isOpen ? <FolderOpenIcon className="size-3.5 shrink-0 text-muted-foreground" /> : <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />) : <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />}
            <span className={cn("truncate", n.status && STATUS[n.status])}>{n.name}</span>
            {n.status && <span className={cn("ms-auto text-[0.625rem] font-semibold", STATUS[n.status].split(" ")[0])}>{MARK[n.status]}</span>}
          </button>
          {folder && isOpen && (
            <ul role="group">
              {render(n.children!, path, depth + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <div data-slot="file-tree" className={cn("rounded-xl border border-border bg-card p-1.5", className)} {...props}>
      <ul role="tree" aria-label="Files">
        {render(tree, "", 0)}
      </ul>
    </div>
  );
}

export { FileTree };
export type { FileTreeProps, TreeNode };

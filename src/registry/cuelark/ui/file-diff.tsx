"use client";

import * as React from "react";
import { CheckIcon, FileCodeIcon, XIcon } from "lucide-react";

import { enterChildren, motionScale } from "@/lib/motion";
import { Button } from "@/registry/cuelark/ui/button";
import { cn } from "@/lib/utils";

type DiffLine = { type: "add" | "remove" | "context"; content: string };

type FileDiffProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  filename: string;
  lines: DiffLine[];
  onAccept?: () => void;
  onReject?: () => void;
  /** Unchanged runs longer than this fold into "N unchanged lines". */
  foldAfter?: number;
};

/**
 * A change an agent proposes to a file: added and removed lines with gutters, +/− stats, long unchanged runs folded
 * away, and Accept/Reject. Once decided, the header records the outcome and the actions step aside.
 */
function FileDiff({ filename, lines, onAccept, onReject, foldAfter = 6, className, ...props }: FileDiffProps) {
  const [decision, setDecision] = React.useState<"accepted" | "rejected" | null>(null);
  const [unfolded, setUnfolded] = React.useState<Set<number>>(new Set());
  const body = React.useRef<HTMLTableSectionElement>(null);
  React.useLayoutEffect(() => {
    const el = body.current;
    if (el && motionScale(el)) enterChildren(el.querySelectorAll("tr.bg-success\\/10, tr.bg-destructive\\/10"), { opacity: 0, x: -6 }, { stagger: 0.03, duration: 0.3 });
  }, []);
  const added = lines.filter((l) => l.type === "add").length;
  const removed = lines.filter((l) => l.type === "remove").length;

  // Number lines on both sides and group long context runs.
  let oldNo = 1;
  let newNo = 1;
  const rows = lines.map((l) => {
    const row = { ...l, old: l.type === "add" ? null : oldNo, new: l.type === "remove" ? null : newNo };
    if (l.type !== "add") oldNo++;
    if (l.type !== "remove") newNo++;
    return row;
  });
  const blocks: ({ fold: number; start: number } | (typeof rows)[number])[] = [];
  for (let i = 0; i < rows.length; ) {
    let j = i;
    while (j < rows.length && rows[j]!.type === "context") j++;
    const run = j - i;
    if (run > foldAfter && !unfolded.has(i)) {
      blocks.push(...rows.slice(i, i + 2), { fold: run - 4, start: i }, ...rows.slice(j - 2, j));
      i = j;
    } else if (run > 0) {
      blocks.push(...rows.slice(i, j));
      i = j;
    } else {
      blocks.push(rows[i]!);
      i++;
    }
  }

  return (
    <div data-slot="file-diff" data-decision={decision ?? undefined} className={cn("overflow-hidden rounded-xl border border-border bg-card text-sm", className)} {...props}>
      <div className="flex items-center gap-2.5 border-b border-border px-3 py-2">
        <FileCodeIcon className="size-4 text-muted-foreground" />
        <span className="truncate font-mono text-[0.8125rem]">{filename}</span>
        <span className="font-mono text-xs">
          <span className="text-success">+{added}</span> <span className="text-destructive">−{removed}</span>
        </span>
        <span className="ms-auto flex items-center gap-1.5">
          {decision ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {decision === "accepted" ? <CheckIcon className="size-3.5 text-success" /> : <XIcon className="size-3.5" />}
              {decision === "accepted" ? "Accepted" : "Rejected"}
            </span>
          ) : (
            <>
              <Button variant="ghost" size="xs" onClick={() => (setDecision("rejected"), onReject?.())}>
                Reject
              </Button>
              <Button size="xs" onClick={() => (setDecision("accepted"), onAccept?.())}>
                Accept
              </Button>
            </>
          )}
        </span>
      </div>
      <div className={cn("overflow-x-auto font-mono text-xs leading-6 transition-opacity", decision === "rejected" && "opacity-50")}>
        <table className="w-full border-collapse">
          <tbody ref={body}>
            {blocks.map((b, i) =>
              "fold" in b ? (
                <tr key={`fold-${i}`}>
                  <td colSpan={3}>
                    <button type="button" onClick={() => setUnfolded((s) => new Set(s).add(b.start))} className="w-full bg-muted/40 py-1 text-center text-[0.6875rem] text-muted-foreground hover:bg-muted hover:text-foreground">
                      ⋯ {b.fold} unchanged lines
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={i} className={cn(b.type === "add" && "bg-success/10", b.type === "remove" && "bg-destructive/10")}>
                  <td className="w-10 border-e border-border pe-2 text-right text-muted-foreground/70 select-none">{b.old ?? ""}</td>
                  <td className="w-10 border-e border-border pe-2 text-right text-muted-foreground/70 select-none">{b.new ?? ""}</td>
                  <td className="ps-2 pe-4 whitespace-pre">
                    <span className={cn("me-2 inline-block w-2 select-none", b.type === "add" ? "text-success" : b.type === "remove" ? "text-destructive" : "text-transparent")}>
                      {b.type === "add" ? "+" : b.type === "remove" ? "−" : " "}
                    </span>
                    {b.content}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { FileDiff };
export type { FileDiffProps, DiffLine };

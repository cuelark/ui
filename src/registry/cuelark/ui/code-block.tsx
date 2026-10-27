"use client";

import * as React from "react";
import { CheckIcon, CopyIcon, WrapTextIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CodeBlockProps = Omit<React.ComponentProps<"div">, "children"> & {
  code: string;
  language?: string;
  filename?: string;
  /** Lines to highlight (1-based). */
  highlight?: number[];
  showLineNumbers?: boolean;
};

/**
 * Code in an agent's reply: filename and language, line numbers, highlighted lines, soft-wrap toggle and copy. No
 * highlighter bundled, so it stays light; pass pre-highlighted HTML through your own renderer if you need colors.
 */
function CodeBlock({ code, language, filename, highlight = [], showLineNumbers = true, className, ...props }: CodeBlockProps) {
  const [wrap, setWrap] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const lines = code.replace(/\n$/, "").split("\n");
  const btn = "grid size-7 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:text-foreground [&_svg]:size-3.5";
  return (
    <div data-slot="code-block" className={cn("overflow-hidden rounded-xl border border-border bg-muted/30 text-sm", className)} {...props}>
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
        {filename && <span className="truncate font-mono text-xs">{filename}</span>}
        {language && <span className="cue-label">{language}</span>}
        <span className="ms-auto flex items-center gap-0.5">
          <button type="button" aria-label="Wrap lines" aria-pressed={wrap} onClick={() => setWrap((w) => !w)} className={btn}>
            <WrapTextIcon />
          </button>
          <button
            type="button"
            aria-label={copied ? "Copied" : "Copy code"}
            onClick={async () => {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
            className={btn}
          >
            {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
          </button>
        </span>
      </div>
      <pre className={cn("overflow-x-auto py-2.5 font-mono text-xs leading-6", wrap && "whitespace-pre-wrap")}>
        <code>
          {lines.map((l, i) => (
            <span key={i} className={cn("block pe-4", highlight.includes(i + 1) ? "bg-signal/15 shadow-[inset_2px_0_0_var(--signal)]" : "")}>
              {showLineNumbers && <span className="inline-block w-10 pe-3 text-right text-muted-foreground/60 select-none">{i + 1}</span>}
              <span className={showLineNumbers ? "" : "ps-4"}>{l || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export { CodeBlock };
export type { CodeBlockProps };

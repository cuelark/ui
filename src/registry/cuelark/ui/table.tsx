import * as React from "react";

import { cn } from "@/lib/utils";

type TableProps = React.ComponentProps<"table"> & {
  /** Zebra rows. */
  striped?: boolean;
  /** Keeps the header visible while the container scrolls (give the container a max height). */
  stickyHeader?: boolean;
};

/** A semantic, crawlable HTML table with hairline rows, mono numerals and optional zebra striping. */
function Table({ className, striped, stickyHeader, ...props }: TableProps) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-auto rounded-lg border border-border bg-card shadow-control">
      <table
        data-slot="table"
        data-striped={striped || undefined}
        data-sticky={stickyHeader || undefined}
        className={cn("w-full caption-bottom border-collapse text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-muted/50 [[data-sticky]_&]:sticky [[data-sticky]_&]:top-0 [[data-sticky]_&]:z-10 [[data-sticky]_&]:backdrop-blur-sm [&_tr]:border-b [&_tr]:border-border", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0 [[data-striped]_&_tr:nth-child(even)]:bg-muted/40", className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("cue-dash-t bg-muted/40 font-medium [&>tr]:last:border-b-0", className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("border-b border-border transition-colors hover:bg-accent/40 data-[state=selected]:bg-accent/60", className)} {...props} />;
}

function TableHead({ className, numeric, ...props }: React.ComponentProps<"th"> & { numeric?: boolean }) {
  return (
    <th
      data-slot="table-head"
      className={cn("cue-label h-10 px-3 text-start align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0", numeric && "text-end", className)}
      {...props}
    />
  );
}

/** `numeric` right-aligns and uses tabular mono figures so columns of numbers line up. */
function TableCell({ className, numeric, ...props }: React.ComponentProps<"td"> & { numeric?: boolean }) {
  return <td data-slot="table-cell" className={cn("px-3 py-2.5 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0", numeric && "text-end font-mono tabular-nums", className)} {...props} />;
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("py-3 text-xs text-muted-foreground", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
export type { TableProps };

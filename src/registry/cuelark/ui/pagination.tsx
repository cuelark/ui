import * as React from "react";
import { Slot } from "radix-ui";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Pages to show for `current` of `total`: always the first and last, `siblings` around the current one,
 * and `"…"` for the gaps. e.g. `pageRange(6, 20)` → `[1, "…", 5, 6, 7, "…", 20]`.
 */
function pageRange(current: number, total: number, siblings = 1): (number | "…")[] {
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  const pages: (number | "…")[] = [1];
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  if (total > 1) pages.push(total);
  return pages;
}

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="Pagination" data-slot="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = React.ComponentProps<"a"> & { isActive?: boolean; asChild?: boolean };

/** Use real links (`href="?page=3"`) so every page is crawlable; `asChild` takes your router's Link. */
function PaginationLink({ className, isActive, asChild, ...props }: PaginationLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "inline-flex h-ctl-sm min-w-ctl-sm items-center justify-center gap-1 rounded-md px-2 font-mono text-[0.8125rem] tabular-nums outline-none transition-[background-color,color,box-shadow] duration-150 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:bg-card data-[active=true]:text-foreground data-[active=true]:shadow-raised data-[active=true]:ring-1 data-[active=true]:ring-border [&_svg]:size-4",
        !isActive && "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, children = "Previous", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to previous page" className={cn("px-2.5 font-sans", className)} {...props}>
      <ChevronLeftIcon />
      <span className="hidden sm:block">{children}</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, children = "Next", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to next page" className={cn("px-2.5 font-sans", className)} {...props}>
      <span className="hidden sm:block">{children}</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden="true" data-slot="pagination-ellipsis" className={cn("flex size-ctl-sm items-center justify-center text-muted-foreground", className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, pageRange };

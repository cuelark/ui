import * as React from "react";
import { Slot } from "radix-ui";
import { MoreHorizontalIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Pair it with BreadcrumbList JSON-LD on the page so search results show the same trail. */
function Breadcrumb(props: React.ComponentProps<"nav">) {
  return <nav aria-label="Breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground", className)} {...props} />;
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("-my-1 inline-block rounded-sm py-1 underline-offset-4 outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50", className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn("font-medium text-foreground", className)} {...props} />;
}

/** A thin mono slash by default; pass children for a custom separator. */
function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn("font-mono text-xs text-border select-none [&>svg]:size-3.5", className)} {...props}>
      {children ?? "/"}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" className={cn("flex size-6 items-center justify-center", className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };

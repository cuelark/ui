import * as React from "react";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, pageRange } from "@/registry/cuelark/ui/pagination";

export default function PaginationDemo() {
  const [page, setPage] = React.useState(6);
  const total = 20;
  const go = (p: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setPage(Math.min(total, Math.max(1, p)));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`?page=${page - 1}`} onClick={go(page - 1)} />
        </PaginationItem>
        {pageRange(page, total).map((p, i) => (
          <PaginationItem key={i}>
            {p === "…" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={`?page=${p}`} isActive={p === page} onClick={go(p)}>
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={`?page=${page + 1}`} onClick={go(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

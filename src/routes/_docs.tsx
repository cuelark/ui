import { Outlet, createFileRoute } from "@tanstack/react-router";

import { DocsSidebar } from "@/components/site/docs-sidebar";

export const Route = createFileRoute("/_docs")({
  component: DocsLayout,
});

function DocsLayout() {
  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6">
      <DocsSidebar />
      <main id="main" className="min-w-0 flex-1 py-10">
        <Outlet />
      </main>
    </div>
  );
}

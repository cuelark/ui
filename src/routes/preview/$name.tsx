import * as React from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { PreviewBar, StandalonePreview } from "@/components/site/component-preview";
import { examples } from "@/components/site/examples";
import { ThemeScope, usePreviewTheme } from "@/components/site/theme-scope";
import { components } from "@/content/components";
import { SITE } from "@/content/site";

const owner = (name: string) => components.find((c) => c.examples.some((e) => e.name === name));

/** One example alone in the window, for full-screen testing and resizing. Kept out of the index: the docs page is canonical. */
export const Route = createFileRoute("/preview/$name")({
  beforeLoad: ({ params }) => {
    if (!examples[params.name]) throw notFound();
  },
  head: ({ params }) => {
    const doc = owner(params.name);
    return {
      meta: [{ title: `${doc?.name ?? params.name} preview · ${SITE.name}` }, { name: "robots", content: "noindex, follow" }],
      links: doc ? [{ rel: "canonical", href: `${SITE.url}/components/${doc.slug}` }] : [],
    };
  },
  component: PreviewPage,
});

function PreviewPage() {
  const { name } = Route.useParams();
  const Example = examples[name]!;
  const [run, setRun] = React.useState(0);
  const { theme, mode } = usePreviewTheme();
  return (
    <StandalonePreview>
      <main id="main" className="flex h-dvh flex-col">
        <PreviewBar name={name} onReplay={() => setRun((r) => r + 1)} />
        <ThemeScope theme={theme} mode={mode} className="relative flex min-h-0 flex-1 overflow-auto bg-card">
          <div key={run} className="m-auto flex w-full max-w-5xl min-w-0 justify-center p-4 sm:p-10 [&>*]:max-w-full [&>*]:min-w-0">
            <Example />
          </div>
        </ThemeScope>
      </main>
    </StandalonePreview>
  );
}

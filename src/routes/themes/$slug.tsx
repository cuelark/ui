import { createFileRoute, notFound } from "@tanstack/react-router";

import { ThemeDetail } from "@/components/site/themes/theme-detail";
import { themeBySlug, themeItem } from "@/content/themes";
import { SITE, registryUrl } from "@/content/site";
import { ld, seo } from "@/lib/seo";

export const Route = createFileRoute("/themes/$slug")({
  loader: ({ params }) => {
    const page = themeBySlug(params.slug);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData: page }) => {
    if (!page) return {};
    const title = `${page.name} theme for shadcn/ui and Tailwind CSS`;
    const description = `${page.summary} Light and dark mode, live preview, copy-ready CSS and a one-line shadcn install (${registryUrl(themeItem(page.slug)).replace("https://", "")}).`;
    const path = `/themes/${page.slug}`;
    return seo({
      title,
      description,
      path,
      type: "article",
      keywords: [...page.keywords, "shadcn theme", "tailwind css v4 theme", "dark mode"],
      jsonLd: [
        ld.sourceCode(`${page.name} theme`, description, path, page.keywords),
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Themes", path: "/themes" },
          { name: page.name, path },
        ]),
      ],
    });
  },
  component: ThemeRoute,
});

function ThemeRoute() {
  return <ThemeDetail page={Route.useLoaderData()} />;
}

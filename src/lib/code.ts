import { createServerFn } from "@tanstack/react-start";

import type { Lang } from "./code.server";

export type CodeRequest = { path: string } | { code: string; lang: Lang };
export type CodeResult = { code: string; html: string };

async function run(data: CodeRequest[]) {
  const { highlight, readSource } = await import("./code.server");
  return Promise.all(
    data.map(async (req): Promise<CodeResult> => {
      const code = "path" in req ? readSource(req.path) : req.code;
      return { code, html: await highlight(code, "path" in req ? "tsx" : req.lang) };
    }),
  );
}

/** Highlights registry files and snippets on the server; called from route loaders (prerendered at build). */
export const getCode = createServerFn({ method: "GET" })
  .validator((data: CodeRequest[]) => data)
  .handler(({ data }) => run(data));

/** Everything a component page needs from the server: highlighted source, usage, examples and dependencies. */
export const getComponentPage = createServerFn({ method: "GET" })
  .validator((data: { slug: string; usage: string; examples: string[] }) => data)
  .handler(async ({ data }) => {
    const { itemDependencies } = await import("./code.server");
    const [source, usage, ...examples] = await run([
      { path: `src/registry/cuelark/ui/${data.slug}.tsx` },
      { code: data.usage, lang: "tsx" },
      ...data.examples.map((name) => ({ path: `src/registry/cuelark/examples/${name}.tsx` })),
    ]);
    return {
      source: source!,
      usage: usage!,
      examples: Object.fromEntries(data.examples.map((name, i) => [name, examples[i]!])),
      deps: itemDependencies(data.slug),
    };
  });

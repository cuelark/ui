/**
 * Server-only syntax highlighting (Shiki, JS regex engine, fine-grained bundle) so code ships as
 * static HTML: no highlighter in the client bundle, and code blocks are in the prerendered pages.
 */
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import tsx from "shiki/langs/tsx.mjs";
import bash from "shiki/langs/bash.mjs";
import css from "shiki/langs/css.mjs";
import json from "shiki/langs/json.mjs";
import githubLight from "shiki/themes/github-light.mjs";
import githubDark from "shiki/themes/github-dark-default.mjs";

import registry from "../../registry.json";

export type Lang = "tsx" | "bash" | "css" | "json";

const sources = import.meta.glob(["/src/registry/cuelark/**/*.tsx", "/src/lib/motion.ts"], { query: "?raw", import: "default", eager: true }) as Record<string, string>;

let highlighter: Promise<HighlighterCore> | null = null;
const getHighlighter = () =>
  (highlighter ??= createHighlighterCore({ themes: [githubLight, githubDark], langs: [tsx, bash, css, json], engine: createJavaScriptRegexEngine() }));

/** A registry file as the user will have it after `shadcn add`: registry import paths become their aliases. */
export function readSource(path: string) {
  const raw = sources[`/${path}`];
  if (raw === undefined) throw new Error(`Unknown source file: ${path}`);
  return raw.replaceAll("@/registry/cuelark/ui/", "@/components/ui/");
}

/** npm and registry dependencies of an item, from the generated registry.json. */
export function itemDependencies(name: string) {
  const item = (registry.items as { name: string; dependencies?: string[]; registryDependencies?: string[] }[]).find((i) => i.name === name);
  return {
    npm: item?.dependencies ?? [],
    registry: (item?.registryDependencies ?? []).map((d) => d.replace(/^.*\/r\/(.+)\.json$/, "$1")),
  };
}

export async function highlight(code: string, lang: Lang) {
  const h = await getHighlighter();
  return h.codeToHtml(code.trimEnd(), { lang, themes: { light: "github-light", dark: "github-dark-default" }, defaultColor: false });
}

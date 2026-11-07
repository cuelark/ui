import { strict as assert } from "node:assert";
import { test } from "node:test";

import { createRequire } from "node:module";

import { expandQuery, iconKeywords, iconQueryParts, POPULAR_SEARCHES, rankIconWords, relatedTerms, termFromSlug } from "../src/lib/icon-seo.ts";
import { iconRedirect } from "../src/lib/icon-redirect.ts";
import { HUB_DESCRIPTION, HUB_TITLE, licenseLabel, setPageCopy, titleUnder60 } from "../src/lib/icon-set-seo.ts";
import { kebab, setIdFromSlug, setSlug } from "../src/lib/icon-slugs.ts";

const require = createRequire(import.meta.url);

test("synonyms work in both directions", () => {
  assert.ok(relatedTerms("agent").includes("robot"));
  assert.ok(relatedTerms("robot").includes("agent"));
  assert.ok(relatedTerms("trash").includes("delete"));
});

test("query expansion keeps the original word first", () => {
  const [group] = expandQuery("bot");
  assert.equal(group?.[0], "bot");
  assert.ok(group?.includes("robot"));
});

test("icon keywords include long-tail and synonym phrases", () => {
  const k = iconKeywords("robot", "Lucide");
  for (const phrase of ["robot icon", "robot icon react", "animated robot icon", "agent icon"]) assert.ok(k.includes(phrase), phrase);
});

test("popular searches are listed once", () => {
  assert.equal(new Set(POPULAR_SEARCHES).size, POPULAR_SEARCHES.length);
});

test("icon search matches whole tokens, not substrings", () => {
  const { terms, groups } = iconQueryParts("ai");
  const rank = (words: string) => rankIconWords(words, terms, groups);
  for (const words of ["chair", "mail", "stairs", "train", "email", "detail"]) assert.equal(rank(words), null, words);
  const exact = rank("ai");
  const named = rank("open ai");
  const synonym = rank("robot");
  assert.ok(exact !== null && named !== null && synonym !== null);
  assert.ok(exact < named && named < synonym);
  const arrow = iconQueryParts("arrow-right");
  const exactArrow = rankIconWords("arrow right", arrow.terms, arrow.groups);
  const longerArrow = rankIconWords("arrow right circle", arrow.terms, arrow.groups);
  assert.ok(exactArrow !== null && longerArrow !== null && exactArrow < longerArrow);
  assert.equal(rankIconWords("arrow", arrow.terms, arrow.groups), null);
  assert.equal(rankIconWords("arrows", arrow.terms, arrow.groups), null);
  assert.equal(rankIconWords("narrow", arrow.terms, arrow.groups), null);
});

test("slugs are readable and reversible", () => {
  assert.equal(kebab("Arrow Up Right"), "arrow-up-right");
  assert.equal(setSlug("lu"), "lucide");
  assert.equal(setIdFromSlug("font-awesome-6"), "fa6");
  assert.equal(termFromSlug("arrow-right"), "arrow right");
});

test("hub copy stays within the snippet limits", () => {
  const title = titleUnder60(HUB_TITLE);
  assert.ok(title.length < 60, title);
  assert.ok(HUB_DESCRIPTION.length >= 120 && HUB_DESCRIPTION.length <= 160, String(HUB_DESCRIPTION.length));
});

test("every icon set has a unique title under 60 and a 120-160 description", async () => {
  const { IconsManifest } = require("react-icons/lib") as { IconsManifest: { id: string; name: string; license: string }[] };
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const s of IconsManifest) {
    const mod = (await import(`react-icons/${s.id}`)) as Record<string, unknown>;
    const count = Object.values(mod).filter((x) => typeof x === "function").length;
    const copy = setPageCopy({ name: s.name, count }, licenseLabel(s.license));
    const title = titleUnder60(copy.title);
    assert.ok(title.length < 60, `${s.id} title ${title.length}: ${title}`);
    assert.ok(copy.description.length >= 120 && copy.description.length <= 160, `${s.id} description ${copy.description.length}: ${copy.description}`);
    assert.ok(copy.intro.length > 40, s.id);
    assert.ok(!titles.has(title), title);
    assert.ok(!descriptions.has(copy.description), copy.description);
    titles.add(title);
    descriptions.add(copy.description);
  }
  assert.equal(titles.size, IconsManifest.length);
});

test("retired icon URLs redirect to the set or the hub", () => {
  const empty = new URLSearchParams();
  assert.equal(iconRedirect("/icons/lucide/arrow-right", empty)?.location, "/icons/lucide");
  assert.equal(iconRedirect("/icons/github-octicons/checklist", empty)?.location, "/icons/github-octicons");
  assert.equal(iconRedirect("/icons/github-octicons/checklist.html", empty)?.location, "/icons/github-octicons");
  assert.equal(iconRedirect("/icons/lu/LuArrowRight", empty)?.location, "/icons/lucide");
  assert.equal(iconRedirect("/icons/go/GoChecklist/", empty)?.location, "/icons/github-octicons");
  assert.equal(iconRedirect("/icons/lucide/arrow-right/extra", empty)?.location, "/icons");
  assert.equal(iconRedirect("/icons/_b/abc/assets/app.js", empty)?.location, "/icons");
  assert.equal(iconRedirect("/icons/not-a-set", empty)?.location, "/icons");
  assert.equal(iconRedirect("/icons/search", empty)?.location, "/icons");
  assert.equal(iconRedirect("/icons/search/arrow/extra", empty)?.location, "/icons");
  assert.equal(iconRedirect("/icons/lu", empty)?.location, "/icons/lucide");
  assert.equal(iconRedirect("/icons/lucide/", empty)?.location, "/icons/lucide");
  assert.equal(iconRedirect("/icons/lucide", new URLSearchParams("page=2"))?.location, "/icons/lucide");
  assert.equal(iconRedirect("/icons/", new URLSearchParams("page=3"))?.location, "/icons");
  assert.equal(iconRedirect("/icons", empty), null);
  assert.equal(iconRedirect("/icons/lucide", empty), null);
  assert.equal(iconRedirect("/icons/search/arrow", empty), null);
  assert.equal(iconRedirect("/icons/search/arrow", new URLSearchParams("page=2")), null);
  assert.equal(iconRedirect("/icons/index.json", empty), null);
  assert.equal(iconRedirect("/icons/lu.json", empty), null);
  assert.equal(iconRedirect("/icons/lucide/arrow-right.svg", empty), null);
  assert.equal(iconRedirect("/components/button", empty), null);
});

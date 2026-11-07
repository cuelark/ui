import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createRequire } from "node:module";

import { expandQuery, iconKeywords, iconMatchesQuery, POPULAR_SEARCHES, relatedSearchSlugs, relatedTerms, termFromSlug } from "../src/lib/icon-seo.ts";
import { iconRedirect } from "../src/lib/icon-redirect.ts";
import { HUB_DESCRIPTION, HUB_TITLE, licenseLabel, representativeIndexes, setAttribution, setGuide, setImportExample, setPageCopy, titleUnder60, SAMPLE_SIZE } from "../src/lib/icon-set-seo.ts";
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

test("icon search matches whole tokens", () => {
  for (const words of ["chair", "chairs", "mail", "stairs"]) assert.equal(iconMatchesQuery(words, "ai"), false, words);
  assert.equal(iconMatchesQuery("ai", "ai"), true);
  assert.equal(iconMatchesQuery("open ai", "ai"), true);
  assert.equal(iconMatchesQuery("arrow right", "arrow"), true);
  assert.equal(iconMatchesQuery("arrow right", "arrow-right"), true);
  assert.equal(iconMatchesQuery("arrow up", "arrow right"), false);
  assert.equal(iconMatchesQuery("stairs", "star"), false);
  assert.equal(iconMatchesQuery("star", "star"), true);
  assert.equal(iconMatchesQuery("airmail", "mail"), false);
  // Synonym groups still match whole tokens: "ai" includes "android", "mail" includes "email".
  assert.equal(iconMatchesQuery("android", "ai"), true);
  assert.equal(iconMatchesQuery("email", "mail"), true);
  assert.equal(iconMatchesQuery("robot", "agent"), true);
});

test("related searches share a token and skip substring hits", () => {
  const related = relatedSearchSlugs("ai", 20);
  assert.ok(related.includes("android"));
  assert.ok(related.includes("bot"));
  assert.equal(related.includes("mail"), false);
});

test("search pages stay out of the sitemap and out of robots.txt blocks", () => {
  const src = readFileSync(new URL("../scripts/registry-data.ts", import.meta.url), "utf8");
  const robots = src.slice(src.indexOf("export function buildRobots"), src.indexOf("function iconLines"));
  const sitemaps = src.slice(src.indexOf("export function buildSitemaps"), src.indexOf("export function buildRobots"));
  assert.equal(sitemaps.includes("/icons/search/"), false);
  assert.equal(sitemaps.includes("POPULAR_SEARCHES"), false);
  assert.equal(robots.includes("Disallow: /icons/search/"), false);
  assert.equal(robots.includes("Allow: /icons/search/"), false);
  assert.ok(robots.includes('Allow: /"') || robots.includes('"Allow: /"'));
  assert.ok(robots.includes("Disallow: /preview/"));
  assert.equal(POPULAR_SEARCHES.some((term) => robots.includes(`/icons/search/${term}`)), false);
});

test("a set sample prefers whole-word names and stays within the cap", () => {
  const indexes = representativeIndexes(["chair", "mail", "stairs", "home"], 3);
  assert.equal(indexes[0], 3);
  assert.ok(indexes.includes(1));
  assert.equal(new Set(indexes).size, indexes.length);
  assert.ok(indexes.length <= SAMPLE_SIZE);
  const wide = representativeIndexes(Array.from({ length: 200 }, (_, i) => `icon ${i}`), SAMPLE_SIZE);
  assert.equal(wide.length, SAMPLE_SIZE);
  assert.equal(new Set(wide).size, wide.length);
});

test("every icon set has a factual guide, import path and registry attribution", async () => {
  const { IconsManifest } = require("react-icons/lib") as { IconsManifest: { id: string; name: string; license: string; licenseUrl: string; projectUrl: string }[] };
  const guides = new Set<string>();
  for (const s of IconsManifest) {
    const guide = setGuide(s.id);
    assert.ok(guide.length > 180, `${s.id} guide is short`);
    assert.equal(guides.has(guide), false, s.id);
    guides.add(guide);
    assert.match(guide, /outline|solid|filled|stroke|brand|logo|weight/i, s.id);
    const mod = (await import(`react-icons/${s.id}`)) as Record<string, unknown>;
    const iconName = Object.keys(mod).find((k) => typeof mod[k] === "function");
    assert.ok(iconName, s.id);
    const example = setImportExample(s.id, iconName!);
    assert.equal(example.install, "npm install react-icons");
    assert.ok(example.code.includes(`import { ${iconName} } from "react-icons/${s.id}";`));
    const credit = setAttribution(s);
    for (const part of [s.name, s.license, s.licenseUrl, s.projectUrl]) assert.ok(credit.includes(part), `${s.id} ${part}`);
  }
  assert.equal(guides.size, IconsManifest.length);
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

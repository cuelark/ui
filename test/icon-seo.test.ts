import { strict as assert } from "node:assert";
import { test } from "node:test";

import { expandQuery, iconKeywords, relatedTerms, termFromSlug } from "../src/lib/icon-seo.ts";
import { kebab, setIdFromSlug, setSlug } from "../src/lib/icon-slugs.ts";

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

test("slugs are readable and reversible", () => {
  assert.equal(kebab("Arrow Up Right"), "arrow-up-right");
  assert.equal(setSlug("lu"), "lucide");
  assert.equal(setIdFromSlug("font-awesome-6"), "fa6");
  assert.equal(termFromSlug("arrow-right"), "arrow right");
});

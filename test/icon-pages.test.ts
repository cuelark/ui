import { strict as assert } from "node:assert";
import { createRequire } from "node:module";
import { test } from "node:test";

import {
  attributionNote,
  classifyRenderedIcon,
  describeSet,
  exampleIconName,
  finalizeDrawing,
  LICENSE_NOTES,
  previewIndexes,
  setUsageSource,
  whenToPick,
} from "../src/lib/icon-set-facts.ts";
import type { IconSetMeta } from "../src/lib/icons.ts";
import { buildRobots, buildSitemaps, sitePaths } from "../scripts/registry-data.ts";

const require = createRequire(import.meta.url);

const drawing = (partial: Partial<NonNullable<IconSetMeta["drawing"]>> & Pick<NonNullable<IconSetMeta["drawing"]>, "stroke" | "fill">): NonNullable<IconSetMeta["drawing"]> => ({
  duotone: 0,
  colored: 0,
  variants: {},
  ...partial,
});

const set = (partial: Partial<IconSetMeta> & Pick<IconSetMeta, "id" | "name" | "count" | "license">): IconSetMeta => ({
  licenseUrl: "https://example.com/license",
  projectUrl: "https://example.com",
  ...partial,
});

test("search pages are absent from the sitemap and are not blocked in robots.txt", () => {
  const xml = buildSitemaps("2026-11-07")["public/sitemap-pages.xml"] ?? "";
  assert.equal(xml.includes("/icons/search/"), false);
  const locs = xml.match(/<loc>/g)?.length ?? 0;
  assert.ok(locs >= sitePaths().length);
  const robots = buildRobots();
  assert.equal(robots.includes("Disallow: /icons/search/"), false);
  assert.equal(/Allow: \/icons\/search\//.test(robots), false);
  assert.ok(robots.includes("Allow: /"));
  assert.ok(robots.includes("Disallow: /preview/"));
});

test("every registry license has an attribution note", () => {
  const { IconsManifest } = require("react-icons/lib") as { IconsManifest: { license: string }[] };
  const licenses = [...new Set(IconsManifest.map((item) => item.license))];
  assert.ok(licenses.length >= 8);
  for (const license of licenses) {
    assert.ok(LICENSE_NOTES[license], license);
    assert.equal(attributionNote(license), LICENSE_NOTES[license]);
  }
  assert.match(attributionNote("CC BY 4.0 License"), /attribution/i);
  assert.match(attributionNote("CC BY 3.0"), /attribution/i);
  assert.match(attributionNote("CC BY-SA 3.0"), /share-alike/i);
  assert.match(attributionNote("CC0 1.0 Universal"), /not required/i);
  assert.doesNotMatch(attributionNote("MIT"), /attribution is required/i);
  assert.doesNotMatch(attributionNote("ISC"), /attribution is required/i);
  assert.match(attributionNote("Something Else"), /See the license/);
});

test("set copy uses measured style and does not invent a missing one", () => {
  const stroke = set({ id: "lu", name: "Lucide", count: 4, license: "ISC", drawing: drawing({ stroke: 4, fill: 0 }) });
  const fill = set({ id: "fa6", name: "Font Awesome 6", count: 5, license: "CC BY 4.0 License", drawing: drawing({ stroke: 0, fill: 5, duotone: 0 }) });
  const mixed = set({
    id: "hi",
    name: "Heroicons",
    count: 4,
    license: "MIT",
    drawing: drawing({ stroke: 2, fill: 2, variants: { outline: 2 } }),
  });
  const unknown = set({ id: "xx", name: "Example", count: 3, license: "Custom" });
  assert.match(describeSet(stroke), /stroke icons/);
  assert.doesNotMatch(describeSet(stroke), /filled/);
  assert.match(describeSet(stroke), /ISC license/);
  assert.match(describeSet(stroke), /does not require a public credit line/);
  assert.match(describeSet(fill), /filled shapes/);
  assert.doesNotMatch(describeSet(fill), /stroke/);
  assert.match(describeSet(fill), /attribution/i);
  assert.match(describeSet(mixed), /2 stroke icons and 2 filled icons/);
  assert.match(describeSet(mixed), /outline \(2\)/);
  assert.match(describeSet(unknown), /does not include a stroke, fill, or duotone split/);
  assert.match(describeSet(unknown), /See the license/);
  const choice = whenToPick(stroke, [stroke, fill]);
  assert.match(choice, /Lucide/);
  assert.match(choice, /stroke set/);
  assert.doesNotMatch(choice, /Font Awesome/);
  const withPeer = whenToPick(stroke, [stroke, { ...fill, drawing: drawing({ stroke: 9, fill: 0 }), count: 9, id: "fi", name: "Feather" }]);
  assert.match(withPeer, /Feather/);
  assert.doesNotMatch(withPeer, /Not A Set/);
});

test("duotone and fixed colors are mentioned only when measured", () => {
  const plain = set({ id: "fa", name: "Font Awesome 5", count: 10, license: "CC BY 4.0 License", drawing: drawing({ stroke: 0, fill: 10 }) });
  const duo = set({
    id: "pi",
    name: "Phosphor Icons",
    count: 10,
    license: "MIT",
    drawing: drawing({ stroke: 0, fill: 10, duotone: 2, variants: { thin: 2 } }),
  });
  const colored = set({
    id: "fc",
    name: "Flat Color Icons",
    count: 4,
    license: "MIT",
    drawing: drawing({ stroke: 0, fill: 4, colored: 4 }),
  });
  assert.doesNotMatch(describeSet(plain), /duotone|own colors/);
  assert.match(describeSet(duo), /2 icon names include duotone or twotone/);
  assert.match(describeSet(duo), /thin \(2\)/);
  assert.match(describeSet(colored), /own colors/);
  const choice = whenToPick(duo, [duo, plain]);
  assert.match(choice, /This set includes 2 duotone or twotone names/);
  assert.match(choice, /Font Awesome 5 does not/);
  const colors = whenToPick(colored, [colored, plain]);
  assert.match(colors, /own colors/);
  assert.match(colors, /Font Awesome 5 does not/);
});

test("preview sample is 48 unique icons and the import example is a real export", () => {
  const indexes = previewIndexes(200);
  assert.equal(indexes.length, 48);
  assert.equal(new Set(indexes).size, 48);
  assert.equal(indexes[0], 0);
  assert.equal(indexes.at(-1), 199);
  assert.deepEqual(previewIndexes(10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(exampleIconName(["LuArrowRight", "LuHouse"], "lu"), "LuHouse");
  assert.equal(exampleIconName(["FaBeer"], "fa"), "FaBeer");
  const usage = setUsageSource("lu", "LuHouse");
  assert.match(usage, /from "react-icons\/lu"/);
  assert.match(usage, /<LuHouse \/>/);
});

test("rendered svg classification follows the open tag", () => {
  const stroke = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"></svg>`;
  const fill = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"></svg>`;
  const colored = `<svg stroke="currentColor" fill="currentColor" stroke-width="0"><path fill="#00BCD4"></path></svg>`;
  assert.equal(classifyRenderedIcon("LuHouse", "lu", stroke).paint, "stroke");
  assert.equal(classifyRenderedIcon("FaBeer", "fa", fill).paint, "fill");
  assert.equal(classifyRenderedIcon("PiHouseDuotone", "pi", fill).duotone, true);
  assert.equal(classifyRenderedIcon("FcWorkflow", "fc", colored).colored, true);
  const summary = finalizeDrawing({ stroke: 200, fill: 800, duotone: 200, colored: 0, variantHits: { thin: 200, line: 10, duotone: 200 }, total: 1000 });
  assert.equal(summary.stroke, 200);
  assert.equal(summary.duotone, 200);
  assert.deepEqual(summary.variants, { thin: 200 });
});

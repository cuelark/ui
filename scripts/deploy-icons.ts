/**
 * Ships the 50,939 icon pages (and one SVG per icon) as static files, apart from the main site:
 *
 *   pnpm deploy:icons --plan                    → build + shard + show the plan
 *   pnpm deploy:icons --confirm-production      → build + shard + deploy (ui.cuelark.com/icons/<set>/*)
 *   …add --skip-build to reuse the last icon build in dist/
 *
 * Why a separate deploy: one Worker may hold 20,000 static files (Cloudflare free plan), and static files are served
 * free and without running any code. So the pages are split across a few assets-only Workers, each mounted on the
 * routes of the icon sets it holds (routes win over the main site's custom domain). Each page loads the JS and CSS of
 * the build that made it from /icons/_b/<build>/, which ships with the pages, so main-site deploys never break them,
 * and run this again only when icon pages change. The main Worker still renders any icon page on request
 * (preview stage, local dev), so nothing depends on these shards existing.
 *
 * Steps: Node check → ICON_BUILD=1 vite build (prerender every icon page) → write SVGs → pin asset URLs to the build →
 * pack shards (≤19,000 files each) → alchemy deploy alchemy.icons.ts.
 */
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { setSlug } from "../src/lib/icon-slugs.ts";
import { svgMarkup, type IconData, type IconIndex, type IconSet } from "../src/lib/icons.ts";

const args = process.argv.slice(2);
const plan = args.includes("--plan");
const MAX_FILES = 19_000;
const OUT = ".icon-shards";
const CLIENT = join("dist", "client");

function fail(message: string): never {
  console.error(`\n[icons] ✗ ${message}\n`);
  process.exit(1);
}
function run(label: string, cmd: string, cmdArgs: string[], env: NodeJS.ProcessEnv = process.env) {
  console.log(`\n[icons] ▸ ${label}`);
  const r = spawnSync(cmd, cmdArgs, { stdio: "inherit", env });
  if (r.status !== 0) fail(`${label} failed`);
}

if (!plan && !args.includes("--confirm-production")) fail("deploys need --confirm-production (or use --plan)");
const [major, minor] = process.versions.node.split(".").map(Number) as [number, number];
if (major < 24 || (major === 24 && minor < 11)) fail(`Alchemy needs Node >= 24.11 (you have ${process.versions.node}). Run: nvm use`);
if (!existsSync("public/icons/index.json")) run("icons:build", "pnpm", ["icons:build"]);

if (!args.includes("--skip-build")) {
  rmSync("dist", { recursive: true, force: true });
  run("prerender icon pages", "npx", ["vite", "build"], { ...process.env, ICON_BUILD: "1" });
}
const index = JSON.parse(readFileSync("public/icons/index.json", "utf8")) as IconIndex;
await fillGaps();

// The build's assets go under a content-addressed prefix the pages are rewritten to.
const assets = readdirSync(join(CLIENT, "assets")).sort();
const build = createHash("sha256").update(assets.join("\n")).digest("hex").slice(0, 10);
const prefix = `/icons/_b/${build}`;

rmSync(OUT, { recursive: true, force: true });
type Shard = { name: string; dir: string; sets: string[]; files: number };
const shards: Shard[] = [];
// ICON_SETS=lu,fi packs only those sets (a quick local check; deploying needs every set).
const only = process.env.ICON_SETS?.split(",");
if (only && !plan) fail("ICON_SETS is for --plan checks only");
const sets = index.sets.filter((s) => !only || only.includes(s.id)).map((s) => ({ id: s.id, slug: setSlug(s.id), files: index.slugs[s.id]!.length * 2 })).sort((a, b) => b.files - a.files);
for (const set of sets) {
  if (set.files > MAX_FILES) fail(`set ${set.slug} alone has ${set.files} files`);
  let shard = shards.find((s) => s.files + set.files <= MAX_FILES - (s.name === "icons-0" ? assets.length + 2 : 2));
  if (!shard) {
    shard = { name: `icons-${shards.length}`, dir: join(OUT, `icons-${shards.length}`), sets: [], files: 0 };
    shards.push(shard);
  }
  shard.sets.push(set.slug);
  shard.files += set.files;
}

const notFound = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Icon not found · Cuelark UI</title><body style="font:15px/1.5 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0"><main style="text-align:center"><h1 style="font-size:20px">This icon is not here</h1><p><a href="/icons">Search 50,000+ icons</a></p></main></body></html>`;
const headers = `/icons/_b/*\n  Cache-Control: public, max-age=31536000, immutable\n/icons/*.svg\n  Cache-Control: public, max-age=86400, stale-while-revalidate=604800\n  Access-Control-Allow-Origin: *\n`;

let pages = 0;
for (const shard of shards) {
  mkdirSync(shard.dir, { recursive: true });
  writeFileSync(join(shard.dir, "404.html"), notFound);
  writeFileSync(join(shard.dir, "_headers"), headers);
  if (shard.name === "icons-0") {
    // The build's JS/CSS, pinned to its prefix: Vite's preload map ("assets/…", joined to base "/"), asset URLs
    // ("/assets/…", e.g. the stylesheet link) and CSS font URLs (url(/assets/…)) would otherwise load whatever the
    // main site deployed last.
    const dest = join(shard.dir, prefix.slice(1), "assets");
    mkdirSync(dest, { recursive: true });
    for (const file of assets) {
      const from = join(CLIENT, "assets", file);
      if (file.endsWith(".js")) writeFileSync(join(dest, file), readFileSync(from, "utf8").replace(/(["'`])(\/?)assets\//g, (_, q: string, slash: string) => `${q}${slash ? prefix : prefix.slice(1)}/assets/`));
      else if (file.endsWith(".css")) writeFileSync(join(dest, file), readFileSync(from, "utf8").replaceAll("url(/assets/", `url(${prefix}/assets/`));
      else cpSync(from, join(dest, file));
    }
  }
  for (const slug of shard.sets) {
    const id = sets.find((s) => s.slug === slug)!.id;
    const src = join(CLIENT, "icons", slug);
    const dest = join(shard.dir, "icons", slug);
    mkdirSync(dest, { recursive: true });
    const data = JSON.parse(readFileSync(`public/icons/${id}.json`, "utf8")) as IconSet;
    index.names[id]!.forEach((name, i) => {
      const file = index.slugs[id]![i]!;
      const html = readFileSync(join(src, `${file}.html`), "utf8");
      writeFileSync(join(dest, `${file}.html`), html.replaceAll('"/assets/', `"${prefix}/assets/`));
      writeFileSync(join(dest, `${file}.svg`), svgMarkup(data.icons[name] as IconData).replace(' width="1em" height="1em"', ' width="24" height="24"'));
      pages++;
    });
  }
  console.log(`[icons] ${shard.name}: ${shard.sets.length} sets, ${shard.files} files`);
}
if (!only && pages !== Object.values(index.slugs).reduce((n, s) => n + s.length, 0)) fail(`expected every icon page, wrote ${pages}`);
writeFileSync(join(OUT, "shards.json"), JSON.stringify({ build, shards: shards.map(({ name, dir, sets }) => ({ name, dir, sets })) }, null, 2));
console.log(`[icons] ${pages} pages + ${pages} SVGs in ${shards.length} shards (build ${build})`);

const profileFile = ".alchemy-profile";
const profile = process.env.ALCHEMY_PROFILE ?? (existsSync(profileFile) ? readFileSync(profileFile, "utf8").trim() : "default");
run(
  plan ? "alchemy plan" : "alchemy deploy",
  "npx",
  ["alchemy", plan ? "plan" : "deploy", "alchemy.icons.ts", "--stage", "prod", "--profile", profile, ...(plan ? [] : ["--yes"])],
  { ...process.env, ALCHEMY_PROFILE: profile, NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --experimental-strip-types`.trim() },
);
console.log(`\n[icons] ✓ ${plan ? "planned" : "deployed"}.\n`);

/**
 * The prerenderer occasionally drops a page it had to retry (a few dozen of 51k). Render just those from the build on
 * disk with `vite preview`, so a single hiccup never costs a full re-run.
 */
async function fillGaps() {
  const only = process.env.ICON_SETS?.split(",");
  const missing = Object.entries(index.slugs)
    .filter(([id]) => !only || only.includes(id))
    .flatMap(([id, slugs]) => slugs.map((slug) => `/icons/${setSlug(id)}/${slug}`))
    .filter((path) => !existsSync(join(CLIENT, `${path}.html`)));
  if (!missing.length) return;
  console.log(`\n[icons] ▸ rendering ${missing.length} pages the prerender missed`);
  const port = 4399;
  const preview = spawn("npx", ["vite", "preview", "--port", String(port), "--strictPort"], { stdio: "ignore", env: process.env });
  try {
    const origin = `http://localhost:${port}`;
    for (let i = 0; i < 60; i++) {
      if (await fetch(origin).then(() => true, () => false)) break;
      await new Promise((r) => setTimeout(r, 1000));
    }
    for (const path of missing) {
      let html = "";
      for (let attempt = 0; attempt < 5 && !html; attempt++) {
        const res = await fetch(origin + path).catch(() => null);
        if (res?.ok) html = await res.text();
        else await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
      if (!html) fail(`could not render ${path}`);
      writeFileSync(join(CLIENT, `${path}.html`), html);
    }
  } finally {
    preview.kill();
  }
}

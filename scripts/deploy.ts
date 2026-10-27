/**
 * The only supported way to deploy Cuelark UI (wraps `alchemy deploy`):
 *
 *   pnpm plan:preview                        → show the plan only
 *   pnpm deploy:preview                      → stage preview
 *   pnpm deploy:prod --confirm-production    → stage prod (ui.cuelark.com; explicit flag)
 *
 * Steps: Node check → typecheck → full local build (icons, registry, prerendered pages) → stage the static HTML and
 * its assets into public/ → alchemy deploy (uploads them as static assets) → remove the staged files.
 * Alchemy's own build cannot prerender, so pages are prerendered here and shipped as plain files: served by Cloudflare's
 * asset layer without invoking the Worker. Maintainers only: needs Cloudflare access.
 * The Alchemy profile comes from ALCHEMY_PROFILE, else a git-ignored .alchemy-profile file, else "default".
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const args = process.argv.slice(2);
const stage = args[0] ?? "";
const plan = args.includes("--plan");

function fail(message: string): never {
  console.error(`\n[deploy] ✗ ${message}\n`);
  process.exit(1);
}
function run(label: string, cmd: string, cmdArgs: string[], env: NodeJS.ProcessEnv = process.env) {
  console.log(`\n[deploy] ▸ ${label}`);
  const r = spawnSync(cmd, cmdArgs, { stdio: "inherit", env });
  if (r.status !== 0) fail(`${label} failed`);
}

if (stage !== "preview" && stage !== "prod") fail("usage: tsx scripts/deploy.ts <preview|prod> [--plan] [--confirm-production]");
if (stage === "prod" && !plan && !args.includes("--confirm-production")) fail("production deploys need --confirm-production (deploy and verify preview first)");
const [major, minor] = process.versions.node.split(".").map(Number) as [number, number];
if (major < 24 || (major === 24 && minor < 11)) fail(`Alchemy needs Node >= 24.11 (you have ${process.versions.node}). Run: nvm use`);

run("typecheck", "npx", ["tsc", "--noEmit"]);
run("build + prerender", "pnpm", ["build"]);

/** Every file under a directory, recursively. */
const walk = (dir: string): string[] => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));

// Stage prerendered HTML plus the client assets it references (their hashes come from this build) into public/.
const staged: string[] = [];
const client = join("dist", "client");
for (const file of walk(client)) {
  const rel = relative(client, file);
  if (!rel.endsWith(".html") && !rel.startsWith("assets/")) continue;
  const target = join("public", rel);
  if (existsSync(target)) continue;
  cpSync(file, target, { recursive: true });
  staged.push(target);
}
console.log(`[deploy] staged ${staged.filter((p) => p.endsWith(".html")).length} static pages and ${staged.filter((p) => !p.endsWith(".html")).length} assets`);
const cleanup = () => {
  for (const p of staged) rmSync(p, { force: true });
  // Drop directories that only held staged files.
  for (const d of [...new Set(staged.map((p) => dirname(p)))].sort((a, b) => b.length - a.length)) {
    if (d !== "public" && existsSync(d) && readdirSync(d).length === 0) rmSync(d, { recursive: true });
  }
};
process.on("exit", cleanup);
process.on("SIGINT", () => process.exit(130));
const profileFile = ".alchemy-profile";
const profile = process.env.ALCHEMY_PROFILE ?? (existsSync(profileFile) ? readFileSync(profileFile, "utf8").trim() : "default");
run(
  plan ? "alchemy plan" : "alchemy deploy",
  "npx",
  ["alchemy", plan ? "plan" : "deploy", "alchemy.run.ts", "--stage", stage, "--profile", profile, ...(plan ? [] : ["--yes"])],
  { ...process.env, ALCHEMY_PROFILE: profile, NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --experimental-strip-types`.trim() },
);
console.log(`\n[deploy] ✓ ${stage} ${plan ? "planned" : "deployed"}.\n`);

/**
 * Deletes the assets-only icon Workers and the routes that own ui.cuelark.com/icons/<set>/*.
 *
 *   pnpm retire:icons --confirm-production
 *
 * Deploy the main site first (`pnpm deploy:prod --confirm-production`). That ships src/worker.ts, which 301s
 * /icons/<set>/<icon> to /icons/<set> and other removed icon URLs to /icons. Until this command runs, Cloudflare
 * still sends /icons/<set>/* to the old Workers, and the 301s never run for those paths.
 *
 * Alchemy state for stack `cuelark-ui-icons` (stage prod) lists the workers. Destroying the stack deletes them
 * and their routes. The main site's custom domain then receives the paths.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const args = process.argv.slice(2);

function fail(message: string): never {
  console.error(`\n[icons] ✗ ${message}\n`);
  process.exit(1);
}
function run(label: string, cmd: string, cmdArgs: string[], env: NodeJS.ProcessEnv = process.env) {
  console.log(`\n[icons] ▸ ${label}`);
  const r = spawnSync(cmd, cmdArgs, { stdio: "inherit", env });
  if (r.status !== 0) fail(`${label} failed`);
}

if (!args.includes("--confirm-production")) fail("retiring the icon Workers needs --confirm-production");
const [major, minor] = process.versions.node.split(".").map(Number) as [number, number];
if (major < 24 || (major === 24 && minor < 11)) fail(`Alchemy needs Node >= 24.11 (you have ${process.versions.node}). Run: nvm use`);

const profileFile = ".alchemy-profile";
const profile = process.env.ALCHEMY_PROFILE ?? (existsSync(profileFile) ? readFileSync(profileFile, "utf8").trim() : "default");
run(
  "destroy icon workers",
  "npx",
  ["alchemy", "destroy", "alchemy.icons.ts", "--stage", "prod", "--profile", profile, "--yes"],
  { ...process.env, ALCHEMY_PROFILE: profile, NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --experimental-strip-types`.trim() },
);
console.log(`\n[icons] ✓ icon Workers destroyed. /icons/<set>/* is now served by the main site.\n`);

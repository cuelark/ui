/**
 * The static icon pages (Alchemy v2, stage prod): assets-only Workers, each mounted on the routes of the icon sets
 * it holds. No code runs, so requests are free and served from the edge cache. Deploy only through
 * scripts/deploy-icons.ts, which builds .icon-shards/ first.
 */
import { readFileSync } from "node:fs";

import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy/Stack";
import * as Effect from "effect/Effect";

const HOST = "ui.cuelark.com";
const ZONE = "cuelark.com";
const manifest = JSON.parse(readFileSync(".icon-shards/shards.json", "utf8")) as { build: string; shards: { name: string; dir: string; sets: string[] }[] };

export default Alchemy.Stack(
  "cuelark-ui-icons",
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const { stage } = yield* Stack;
    if (stage !== "prod") return yield* Effect.die(new Error(`Unknown stage "${stage}". Icon pages ship to prod only.`));
    const workers = [];
    for (const [i, shard] of manifest.shards.entries()) {
      const worker = yield* Cloudflare.Worker(`Icons${i}`, {
        name: `cuelark-ui-${shard.name}`,
        assets: { directory: shard.dir, htmlHandling: "auto-trailing-slash", notFoundHandling: "404-page" },
        workersDev: false,
        routes: [
          ...shard.sets.map((set) => ({ pattern: `${HOST}/icons/${set}/*`, zoneName: ZONE })),
          // The JS and CSS every icon page loads ship with the first shard.
          ...(i === 0 ? [{ pattern: `${HOST}/icons/_b/*`, zoneName: ZONE }] : []),
        ],
      });
      workers.push(worker.workerName);
    }
    return { build: manifest.build, workers };
  }),
);

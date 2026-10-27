/**
 * Cuelark UI docs + shadcn registry (Alchemy v2), one stack per stage:
 *
 *   pnpm deploy:preview                      → stage `preview` (workers.dev)
 *   pnpm deploy:prod --confirm-production    → stage `prod` (ui.cuelark.com)
 *
 * Prerendered pages and /r/*.json registry files are static assets; the Worker only answers what is left.
 */
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy/Stack";
import * as Effect from "effect/Effect";

const APP = "cuelark-ui";
const DOMAIN = "ui.cuelark.com";

export default Alchemy.Stack(
  APP,
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const { stage } = yield* Stack;
    if (stage !== "preview" && stage !== "prod") return yield* Effect.die(new Error(`Unknown stage "${stage}". Use preview or prod.`));
    const prod = stage === "prod";

    const site = yield* Cloudflare.Website.Vite("Ui", {
      name: `${APP}-${stage}`,
      main: "./src/worker.ts",
      compatibility: { date: "2026-09-01", flags: ["nodejs_compat"] },
      domain: prod ? { name: DOMAIN } : null,
      workersDev: !prod,
      observability: { enabled: true, logs: { enabled: true, invocationLogs: false } },
      env: { STAGE: stage },
    });

    return { url: site.url, stage };
  }),
);

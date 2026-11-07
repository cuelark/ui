/**
 * Retired icon-page Workers (Alchemy v2, stack `cuelark-ui-icons`, stage prod).
 *
 * These used to be assets-only Workers mounted on ui.cuelark.com/icons/<set>/*, which wins over the main site's
 * custom domain. The main Worker (alchemy.run.ts) now owns those paths and returns real 301s, but only after this
 * stack is destroyed. The program registers the Cloudflare provider and declares no resources, so `alchemy destroy`
 * can delete the workers still recorded in this stack's state.
 *
 *   pnpm retire:icons --confirm-production
 *
 * Run that after `pnpm deploy:prod --confirm-production`. Do not deploy icon pages again.
 */
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy/Stack";
import * as Effect from "effect/Effect";

export default Alchemy.Stack(
  "cuelark-ui-icons",
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const { stage } = yield* Stack;
    if (stage !== "prod") return yield* Effect.die(new Error(`Unknown stage "${stage}". Icon workers are retired from prod only.`));
    return { retired: true as const };
  }),
);

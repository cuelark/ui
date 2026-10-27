# Contributing to Cuelark UI

Thanks for helping. Issues, ideas and pull requests are all welcome.

## Setup

Requirements: Node 24.11+ (see `.nvmrc`) and pnpm via Corepack.

```bash
corepack enable
pnpm install
pnpm dev            # http://localhost:3300 (builds icons and the registry first)
```

Before opening a pull request, run everything CI runs:

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

## Where things live

| Path | What |
| --- | --- |
| `src/registry/cuelark/ui/` | The components people install. One file per component. |
| `src/registry/cuelark/examples/` | One demo per component; also the live previews on the site. |
| `src/content/` | Docs for each component (description, props, accessibility, FAQ, SEO keywords). |
| `src/registry/cuelark/theme.ts`, `src/lib/site-theme.ts` | Theme tokens and the live theme generator. |
| `src/lib/motion.ts` | Shared GSAP helpers (`--cl-motion`, reduced motion). |
| `scripts/` | Generators for `registry.json`, the theme CSS, sitemaps, `llms.txt` and the icon data. |

## Adding a component

1. Add `src/registry/cuelark/ui/<name>.tsx` and `src/registry/cuelark/examples/<name>-demo.tsx`.
2. Add its docs entry in `src/content/` (the registry metadata is generated from it).
3. Run `pnpm registry:build` and open `/components/<name>`.

Guidelines: use semantic tokens (no hard-coded colors), keep it keyboard accessible with visible focus, route motion
through `src/lib/motion.ts` so it honors `--cl-motion` and `prefers-reduced-motion`, and never let GSAP and a Tailwind
`translate`/`scale` utility target the same element.

## Pull requests

Keep them focused, describe the change and how you tested it, and add screenshots for anything visual. By contributing
you agree your work is released under the [MIT License](./LICENSE).

## Maintainers

`.githooks/` holds maintainer-only hooks for the project's release identity; contributors don't need them. Deploys
(`pnpm deploy:*`) are run by maintainers and need Cloudflare credentials.

# Cuelark UI

**Animated, accessible React components for [shadcn/ui](https://ui.shadcn.com): an AI agent UI kit, GSAP motion, live theming, and 50,000+ icons.**

[Website](https://ui.cuelark.com) · [Components](https://ui.cuelark.com/components) · [Agent UI kit](https://ui.cuelark.com/agents) · [Icons](https://ui.cuelark.com/icons) · [Theme editor](https://ui.cuelark.com/docs/theming)

Cuelark UI is a shadcn-compatible registry. Components install as source into your project with the shadcn CLI, so you
own every line. They're built on Radix UI and Tailwind CSS v4, animated with GSAP, and themed with CSS variables.

## Install a component

```bash
npx shadcn@latest add https://ui.cuelark.com/r/button.json
```

Every component page lists its install command. Add the theme once to get the Cuelark tokens (colors, radius, density,
motion):

```bash
npx shadcn@latest add https://ui.cuelark.com/r/theme.json
```

## What's inside

- **Core components:** buttons, inputs, selects, dialogs, sheets, menus, command palette, tabs, toasts, tables and more,
  keyboard-accessible with visible focus.
- **AI agent UI kit:** prompt input, messages, conversation, reasoning, chain of thought, tool calls, plans with approval,
  confirmations, sources, inline citations, file diffs, terminals, test results and a trace waterfall. Works with the
  Vercel AI SDK or any stream.
- **Motion and effects:** text reveal, number ticker, marquee, tilt card, border beam, orbit, flip grid and more. All motion
  scales with one `--cl-motion` token and respects `prefers-reduced-motion`.
- **Theming:** presets, fonts, radius, density and accent colors, editable live and exported as CSS.
- **Icons:** every [react-icons](https://react-icons.github.io/react-icons/) set, searchable, with a page per icon. Copy the
  SVG or JSX, or install any icon as a static or dependency-free animated component:

  ```bash
  npx shadcn@latest add https://ui.cuelark.com/r/icons/lucide/bell.json
  npx shadcn@latest add https://ui.cuelark.com/r/icons/lucide/bell-animated.json
  ```

## Develop

Requires Node 24.11+ and pnpm (via Corepack).

```bash
corepack enable
pnpm install
pnpm dev        # http://localhost:3300
pnpm build      # icons, registry, then the site (prerendered)
```

The site is built with TanStack Start and Vite and deploys to Cloudflare Workers. See [CONTRIBUTING.md](./CONTRIBUTING.md)
for the project layout and how to add a component.

## License

The code is [MIT](./LICENSE) © Cuelark. Icons keep their original licenses, and GSAP has its own license; see
[NOTICE.md](./NOTICE.md).

# Third-party notices

The Cuelark UI source code in this repository is licensed under the [MIT License](./LICENSE). Some things it uses or
distributes are not, and keep their own terms.

## Icons

The icon library at [ui.cuelark.com/icons](https://ui.cuelark.com/icons) and the icon registry items
(`/r/icons/<set>/<icon>.json`, `.svg`) are generated at build time from [react-icons](https://github.com/react-icons/react-icons)
(MIT). Each icon set remains under its **original license**, shown with a link to the license and project on every set page,
every icon page and in every installed icon component. Most sets are MIT, ISC or Apache-2.0. Note in particular:

- **Attribution required (CC BY):** Font Awesome 5 and 6 (CC BY 4.0), IcoMoon Free (CC BY 4.0), VS Code Codicons
  (CC BY 4.0), Game Icons (CC BY 3.0). Credit the set when you ship its icons; each icon page offers a ready-made
  attribution line.
- **Share-alike (CC BY-SA 3.0):** Typicons. Adaptations must be shared under the same license.
- **Mozilla Public License 2.0:** Circum Icons. **SIL OFL 1.1:** Weather Icons. **CC0:** Simple Icons (brand marks may
  still be trademarks of their owners; follow each brand's guidelines).

The generated icon data is not committed to this repository; `pnpm icons:build` recreates it from the react-icons package.

## Animation

Components animate with [GSAP](https://gsap.com), installed as an npm dependency under GSAP's own
[standard license](https://gsap.com/standard-license). It is free to use, including commercially, but it is not an OSI
open-source license. Read it before redistributing GSAP itself.

## Fonts

Inter, Geist, Geist Mono and the other selectable typefaces are installed from [Fontsource](https://fontsource.org) packages
under the SIL Open Font License 1.1.

## Building blocks

Components are built on [Radix UI](https://www.radix-ui.com) (MIT), [Tailwind CSS](https://tailwindcss.com) (MIT),
[cmdk](https://cmdk.paco.me) (MIT), [input-otp](https://input-otp.rodz.dev) (MIT) and [Lucide](https://lucide.dev) (ISC), and follow
the [shadcn/ui](https://ui.shadcn.com) registry format (MIT). Trademarks belong to their respective owners.

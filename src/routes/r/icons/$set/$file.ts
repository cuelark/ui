import { createFileRoute } from "@tanstack/react-router";

import { setIdFromSlug } from "@/lib/icon-slugs";
import { animationFor } from "@/registry/cuelark/ui/animated-icon";
import { animatedIconComponentSource, componentName, iconComponentSource, iconTitle, svgMarkup, type IconIndex, type IconSet } from "@/lib/icons";

const HEADERS = { "cache-control": "public, max-age=86400", "access-control-allow-origin": "*" };

/**
 * shadcn registry items and raw SVGs for any icon, generated on request:
 *   /r/icons/lucide/bell.json           static component (components/icons/lucide-bell.tsx)
 *   /r/icons/lucide/bell-animated.json  dependency-free animated component (Web Animations API)
 *   /r/icons/lucide/bell.svg            the SVG file
 * Old react-icons ids and names (/r/icons/lu/LuBell.json) still resolve.
 */
export const Route = createFileRoute("/r/icons/$set/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { readIconAsset } = await import("@/lib/icons-asset.server");
        const m = /^(.+?)(-animated)?\.(json|svg)$/.exec(params.file);
        if (!m) return Response.json({ error: "Use <icon>.json, <icon>-animated.json or <icon>.svg" }, { status: 404 });
        const [, key, animated, ext] = m as unknown as [string, string, string | undefined, "json" | "svg"];
        const index = await readIconAsset<IconIndex>("/icons/index.json");
        const id = setIdFromSlug(params.set) ?? params.set;
        const meta = index.sets.find((s) => s.id === id);
        if (!meta) return Response.json({ error: "Icon set not found" }, { status: 404 });
        let at = index.slugs[id]!.indexOf(key);
        if (at < 0) at = index.names[id]!.indexOf(key);
        if (at < 0) return Response.json({ error: "Icon not found" }, { status: 404 });
        const name = index.names[id]![at]!;
        const slug = index.slugs[id]!.at(at)!;
        const set = await readIconAsset<IconSet>(`/icons/${id}.json`);
        const icon = set.icons[name]!;
        if (ext === "svg") return new Response(svgMarkup(icon).replace(' width="1em" height="1em"', ' width="24" height="24"'), { headers: { ...HEADERS, "content-type": "image/svg+xml; charset=utf-8" } });
        const setPart = params.set;
        const file = `${setPart}-${slug}${animated ? "-animated" : ""}`;
        const motion = animationFor(name);
        return Response.json(
          {
            $schema: "https://ui.shadcn.com/schema/registry-item.json",
            name: file,
            type: "registry:ui",
            title: `${iconTitle(name, id)} icon${animated ? " (animated)" : ""} · ${meta.name}`,
            description: `${animated ? componentName(name).replace(/Icon$/, "AnimatedIcon") : componentName(name)}: the ${iconTitle(name, id).toLowerCase()} icon from ${meta.name} (${meta.license}).${animated ? ` Animates with "${motion}" on hover; no dependencies.` : ""}`,
            files: [
              {
                path: `icons/${file}.tsx`,
                type: "registry:ui",
                target: `components/icons/${file}.tsx`,
                content: animated ? animatedIconComponentSource(name, meta, icon, motion) : iconComponentSource(name, meta, icon),
              },
            ],
          },
          { headers: HEADERS },
        );
      },
    },
  },
});

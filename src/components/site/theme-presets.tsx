import { DicesIcon } from "lucide-react";

import { PRESETS, fontStack, randomTheme, setSiteTheme, themeCss, themeTokens, useSiteTheme } from "@/lib/site-theme";
import { Button } from "@/registry/cuelark/ui/button";
import { CopyButton } from "@/registry/cuelark/ui/copy-button";
import { cn } from "@/lib/utils";

/** Curated themes, each previewed in its own colors and face, applied in one click or copied as CSS. */
export function ThemePresets() {
  const current = useSiteTheme();
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PRESETS.map((p) => {
          const t = themeTokens(p.theme).light;
          const active = JSON.stringify(p.theme) === JSON.stringify(current);
          const r = `${p.theme.radius}rem`;
          return (
            <article
              key={p.name}
              className={cn("grid overflow-hidden rounded-2xl border bg-card transition-[border-color,box-shadow]", active ? "border-foreground shadow-raised" : "border-border hover:shadow-raised")}
            >
              <div className="grid gap-3 p-4" style={{ background: t.background, color: t.foreground, fontFamily: fontStack(p.theme.font) }}>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold tracking-tight">{p.name}</span>
                  <span className="rounded-full px-2 py-0.5 text-[0.6875rem] font-medium" style={{ background: t.signal, color: t["signal-foreground"] }}>
                    {p.theme.font}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 text-xs font-medium" style={{ background: t.primary, color: t["primary-foreground"], borderRadius: r }}>
                    Primary
                  </span>
                  <span className="px-3 py-1.5 text-xs font-medium" style={{ background: t.secondary, color: t["secondary-foreground"], borderRadius: r }}>
                    Secondary
                  </span>
                  <span className="relative ms-auto h-5 w-9 rounded-full p-0.5" style={{ background: t.signal }}>
                    <span className="block size-4 translate-x-4 rounded-full bg-white shadow" />
                  </span>
                </div>
                <div className="h-2 overflow-hidden" style={{ background: t.muted, borderRadius: r }}>
                  <div className="h-full w-2/3" style={{ background: t.primary, borderRadius: r }} />
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                <p className="flex-1 text-xs text-muted-foreground">{p.description}</p>
                <CopyButton value={themeCss(p.theme)} aria-label={`Copy ${p.name} CSS`} />
                <Button size="xs" variant={active ? "secondary" : "primary"} onClick={() => setSiteTheme(p.theme)}>
                  {active ? "Applied" : "Apply"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      <Button variant="outline" className="w-fit" onClick={() => setSiteTheme(randomTheme())}>
        <DicesIcon /> Surprise me
      </Button>
    </div>
  );
}

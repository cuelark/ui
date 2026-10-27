import * as React from "react";
import { Link } from "@tanstack/react-router";
import { DicesIcon, MoonIcon, PaletteIcon, RotateCcwIcon, SunIcon } from "lucide-react";

import { BASES, FONTS, PRESETS, SIGNALS, fontStack, randomTheme, resetSiteTheme, setSiteTheme, themeTokens, useSiteTheme, type SiteTheme } from "@/lib/site-theme";
import { Button } from "@/registry/cuelark/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/cuelark/ui/popover";
import { Slider } from "@/registry/cuelark/ui/slider";
import { Switch } from "@/registry/cuelark/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/registry/cuelark/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/cuelark/ui/tooltip";
import { cn } from "@/lib/utils";

function Row({ label, value, children }: { label: string; value?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-2.5">
      <div className="flex items-center justify-between">
        <span className="cue-label">{label}</span>
        {value != null && <span className="font-mono text-[0.6875rem] text-muted-foreground">{value}</span>}
      </div>
      {children}
    </div>
  );
}

/** Every theme knob, bound to the live site theme. Used in the header popover and on the theming page. */
export function ThemeControls({ compact = false }: { compact?: boolean }) {
  const theme = useSiteTheme();
  const presetName = PRESETS.find((p) => JSON.stringify(p.theme) === JSON.stringify(theme))?.name;
  return (
    <div className={cn("grid", compact ? "gap-5" : "gap-6")}>
      <Row label="Preset" value={presetName ?? "Custom"}>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <PresetChip key={p.name} name={p.name} theme={p.theme} active={presetName === p.name} />
          ))}
        </div>
      </Row>
      <Row label="Signal" value={theme.signal}>
        <div className="flex flex-wrap gap-2">
          {SIGNALS.map((s) => (
            <button
              key={s.name}
              type="button"
              aria-label={s.name}
              aria-pressed={theme.signal === s.name}
              onClick={() => setSiteTheme({ signal: s.name, hue: s.hue })}
              className="grid size-8 place-items-center rounded-full outline-none transition-[scale] duration-150 ease-cue focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-90 aria-pressed:ring-2 aria-pressed:ring-foreground aria-pressed:ring-offset-2 aria-pressed:ring-offset-background"
            >
              <span className="size-6 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]" style={{ background: s.c ? `oklch(${s.l} ${s.c} ${s.hue})` : "var(--foreground)" }} />
            </button>
          ))}
        </div>
        {!compact && (
          <Slider
            value={[theme.hue]}
            min={0}
            max={360}
            onValueChange={([v]) => setSiteTheme({ hue: v!, signal: theme.signal === "Ink" ? "Chartreuse" : theme.signal })}
            aria-label="Signal hue"
            showValue
            format={(v) => `${v}°`}
          />
        )}
      </Row>
      <Row label="Base">
        <ToggleGroup type="single" size="sm" value={theme.base} onValueChange={(v) => v && setSiteTheme({ base: v })} className="w-full" aria-label="Base gray">
          {BASES.map((b) => (
            <ToggleGroupItem key={b.name} value={b.name} className="flex-1 text-xs">
              {b.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Row>
      <Row label="Font" value={FONTS.find((x) => x.name === theme.font)?.note}>
        <div className={cn("grid gap-1.5", compact ? "grid-cols-2" : "grid-cols-2")}>
          {(compact ? FONTS.slice(0, 6) : FONTS).map((x) => (
            <button
              key={x.name}
              type="button"
              aria-pressed={theme.font === x.name}
              onClick={() => setSiteTheme({ font: x.name })}
              className="flex h-9 items-center justify-between gap-2 rounded-lg border border-border bg-background px-2.5 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:border-foreground aria-pressed:bg-muted"
              style={{ fontFamily: fontStack(x.name) }}
            >
              <span className="truncate">{x.name}</span>
              <span className="text-xs text-muted-foreground">Aa</span>
            </button>
          ))}
        </div>
      </Row>
      <div className="grid gap-5">
        <Row label="Text size" value={`${Math.round(theme.textSize * 16)}px`}>
          <ToggleGroup type="single" size="sm" value={String(theme.textSize)} onValueChange={(v) => v && setSiteTheme({ textSize: Number(v) })} className="w-full" aria-label="Text size">
            {[
              { v: 0.875, l: "S" },
              { v: 0.9375, l: "M" },
              { v: 1, l: "L" },
              { v: 1.0625, l: "XL" },
            ].map((o) => (
              <ToggleGroupItem key={o.v} value={String(o.v)} className="flex-1 text-xs" aria-label={`${o.v * 16}px`}>
                {o.l}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Row>
        <Row label="Spacing">
          <ToggleGroup type="single" size="sm" value={String(theme.tracking)} onValueChange={(v) => v && setSiteTheme({ tracking: Number(v) })} className="w-full" aria-label="Letter spacing">
            {[
              { v: -0.015, l: "Tight" },
              { v: 0, l: "Normal" },
              { v: 0.015, l: "Wide" },
            ].map((o) => (
              <ToggleGroupItem key={o.v} value={String(o.v)} className="flex-1 text-xs">
                {o.l}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Row>
      </div>
      <Row label="Radius" value={`${theme.radius}rem`}>
        <ToggleGroup type="single" size="sm" value={String(theme.radius)} onValueChange={(v) => v && setSiteTheme({ radius: Number(v) })} className="w-full" aria-label="Radius">
          {[0, 0.375, 0.625, 0.875, 1.25].map((r) => (
            <ToggleGroupItem key={r} value={String(r)} className="flex-1" aria-label={`${r}rem`}>
              <span className="size-3.5 border-2 border-current border-b-0 border-l-0" style={{ borderTopRightRadius: `${r * 8}px` }} />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Row>
      {!compact && (
        <Row label="Density">
          <ToggleGroup type="single" size="sm" value={String(theme.density)} onValueChange={(v) => v && setSiteTheme({ density: Number(v) })} className="w-full" aria-label="Density">
            {[
              { v: 0.875, l: "Compact" },
              { v: 1, l: "Default" },
              { v: 1.125, l: "Roomy" },
            ].map((d) => (
              <ToggleGroupItem key={d.v} value={String(d.v)} className="flex-1 text-xs">
                {d.l}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Row>
      )}
      <Row label="Motion" value={theme.motion === 0 ? "Off" : theme.motion < 1 ? "Calm" : theme.motion > 1 ? "Expressive" : "Default"}>
        <Slider value={[theme.motion]} min={0} max={1.5} step={0.25} onValueChange={([v]) => setSiteTheme({ motion: v! })} aria-label="Motion" ticks={compact ? undefined : [0, 0.5, 1, 1.5]} />
      </Row>
      <label className="flex items-center justify-between text-sm">
        Crop marks
        <Switch checked={theme.marks} onCheckedChange={(v) => setSiteTheme({ marks: v })} size="sm" />
      </label>
    </div>
  );
}

/** A preset as a tiny swatch: its paper, ink and signal. */
function PresetChip({ name, theme, active }: { name: string; theme: SiteTheme; active: boolean }) {
  const t = themeTokens(theme).light;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => setSiteTheme(theme)}
      className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-background ps-1 pe-2.5 text-xs font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:border-foreground"
      style={{ fontFamily: fontStack(theme.font) }}
    >
      <span className="flex -space-x-1.5">
        <span className="size-5 rounded-full ring-1 ring-black/10" style={{ background: t.background }} />
        <span className="size-5 rounded-full ring-1 ring-black/10" style={{ background: t.primary }} />
        <span className="size-5 rounded-full ring-1 ring-black/10" style={{ background: t.signal }} />
      </span>
      {name}
    </button>
  );
}

/** The header's palette button: change the whole site's theme from any page. */
export function ThemeCustomizer() {
  const toggleDark = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  };
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Customize theme">
              <PaletteIcon />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Customize</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="max-h-[calc(100dvh-5rem)] w-[22rem] overflow-y-auto p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">Customize</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={toggleDark} aria-label="Toggle dark mode">
              <SunIcon className="hidden dark:block" />
              <MoonIcon className="dark:hidden" />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={() => setSiteTheme(randomTheme())} aria-label="Random theme">
                  <DicesIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Shuffle</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="icon-sm" onClick={resetSiteTheme} aria-label="Reset theme">
              <RotateCcwIcon />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <ThemeControls compact />
        </div>
        <div className="border-t border-border px-4 py-3">
          <Link to="/docs/theming" className="text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground">
            Open the full editor and copy CSS →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

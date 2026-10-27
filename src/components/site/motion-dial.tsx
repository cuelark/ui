import * as React from "react";

import { Button } from "@/registry/cuelark/ui/button";
import { Checkbox } from "@/registry/cuelark/ui/checkbox";
import { Slider } from "@/registry/cuelark/ui/slider";
import { Spinner } from "@/registry/cuelark/ui/spinner";
import { Switch } from "@/registry/cuelark/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/registry/cuelark/ui/toggle-group";

const LEVELS = [
  { v: 0, label: "Off" },
  { v: 0.5, label: "Calm" },
  { v: 1, label: "Default" },
  { v: 1.5, label: "Expressive" },
];

/** One CSS variable, every animation: drag the dial and play with the controls inside its scope. */
export function MotionDial() {
  const [motion, setMotion] = React.useState(1);
  const label = LEVELS.reduce((a, b) => (Math.abs(b.v - motion) < Math.abs(a.v - motion) ? b : a)).label;

  return (
    <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
      <div className="grid gap-5">
        <span className="cue-label">--cl-motion: {motion}</span>
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">One knob for every animation.</h3>
        <p className="text-muted-foreground">
          Motion amplitude is a CSS variable that cascades. Calm a dense dashboard, liven up a landing page, or switch it off. A visitor's reduced-motion setting always wins.
        </p>
        <div className="grid gap-3 pt-2">
          <Slider value={[motion]} min={0} max={1.5} step={0.25} onValueChange={([v]) => setMotion(v!)} aria-label="Motion amplitude" ticks={[0, 0.5, 1, 1.5]} />
          <span className="font-mono text-sm text-foreground">{label}</span>
        </div>
      </div>
      <div style={{ "--cl-motion": motion } as React.CSSProperties} className="grid place-items-center gap-6 rounded-xl border border-dashed border-border bg-background p-8">
        <ToggleGroup type="single" defaultValue="b" aria-label="Demo">
          <ToggleGroupItem value="a">Daily</ToggleGroupItem>
          <ToggleGroupItem value="b">Weekly</ToggleGroupItem>
          <ToggleGroupItem value="c">Monthly</ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center gap-6">
          <Switch defaultChecked aria-label="Demo switch" size="lg" />
          <Checkbox size="lg" aria-label="Demo checkbox" />
          <Spinner key={motion} size="md" />
        </div>
        <Button variant="secondary" size="sm">
          Press me, then toggle things
        </Button>
      </div>
    </div>
  );
}

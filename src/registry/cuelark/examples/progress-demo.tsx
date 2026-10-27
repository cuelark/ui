import * as React from "react";

import { Button } from "@/registry/cuelark/ui/button";
import { Progress } from "@/registry/cuelark/ui/progress";

export default function ProgressDemo() {
  const [value, setValue] = React.useState(35);
  return (
    <div className="grid w-full max-w-sm gap-6">
      <div className="grid gap-2">
        <div className="flex justify-between text-sm">
          <span>Uploading</span>
          <span className="font-mono text-muted-foreground tabular-nums">{value}%</span>
        </div>
        <Progress value={value} aria-label="Upload progress" />
      </div>
      <Progress value={value} segments={12} size="lg" aria-label="Storage used" />
      <Progress value={null} size="sm" aria-label="Loading" />
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.max(0, v - 15))}>
          −15
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.min(100, v + 15))}>
          +15
        </Button>
      </div>
    </div>
  );
}

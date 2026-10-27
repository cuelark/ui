import * as React from "react";

import { FlipGrid, FlipGridItem } from "@/registry/cuelark/ui/flip-grid";
import { ToggleGroup, ToggleGroupItem } from "@/registry/cuelark/ui/toggle-group";

const items = [
  { id: "button", name: "Button", kind: "actions" },
  { id: "dialog", name: "Dialog", kind: "overlays" },
  { id: "input", name: "Input", kind: "forms" },
  { id: "tooltip", name: "Tooltip", kind: "overlays" },
  { id: "switch", name: "Switch", kind: "forms" },
  { id: "copy", name: "Copy", kind: "actions" },
  { id: "select", name: "Select", kind: "forms" },
  { id: "sheet", name: "Sheet", kind: "overlays" },
];

export default function FlipGridDemo() {
  const [filter, setFilter] = React.useState("all");
  return (
    <div className="grid w-full max-w-md gap-5">
      <ToggleGroup type="single" value={filter} onValueChange={(v) => v && setFilter(v)} className="w-full" aria-label="Filter">
        {["all", "actions", "forms", "overlays"].map((f) => (
          <ToggleGroupItem key={f} value={f} className="flex-1 capitalize">
            {f}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <FlipGrid layoutKey={filter} className="grid-cols-4">
        {items.map((i) => (
          <FlipGridItem
            key={i.id}
            id={`flip-${i.id}`}
            hidden={filter !== "all" && i.kind !== filter}
            className="grid aspect-square place-items-center rounded-xl border border-border bg-card text-xs font-medium shadow-control"
          >
            {i.name}
          </FlipGridItem>
        ))}
      </FlipGrid>
    </div>
  );
}

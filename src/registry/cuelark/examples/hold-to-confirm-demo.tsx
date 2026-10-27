import * as React from "react";
import { Trash2Icon } from "lucide-react";

import { HoldToConfirm } from "@/registry/cuelark/ui/hold-to-confirm";

export default function HoldToConfirmDemo() {
  const [deleted, setDeleted] = React.useState(0);
  return (
    <div className="grid justify-items-center gap-3">
      <HoldToConfirm onConfirm={() => setDeleted((d) => d + 1)}>
        <Trash2Icon /> Delete workspace
      </HoldToConfirm>
      <span className="cue-label">{deleted ? `Deleted ${deleted}×` : "Press and hold"}</span>
    </div>
  );
}

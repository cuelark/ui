import * as React from "react";

import { Checkbox } from "@/registry/cuelark/ui/checkbox";

const channels = ["Email", "Push", "SMS"];

export default function CheckboxSelectAll() {
  const [selected, setSelected] = React.useState<string[]>(["Email"]);
  const all = selected.length === channels.length ? true : selected.length ? "indeterminate" : false;

  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Notification channels</legend>
      <label className="flex items-center gap-2.5 text-sm font-medium">
        <Checkbox checked={all} onCheckedChange={(v) => setSelected(v === true ? channels : [])} />
        All channels
      </label>
      <div className="grid gap-3 border-s border-dashed border-border ps-4 ms-2">
        {channels.map((c) => (
          <label key={c} className="flex items-center gap-2.5 text-sm">
            <Checkbox checked={selected.includes(c)} onCheckedChange={(v) => setSelected((s) => (v === true ? [...s, c] : s.filter((x) => x !== c)))} />
            {c}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

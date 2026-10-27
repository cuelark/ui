import * as React from "react";
import { ArrowRightIcon, PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";

export default function ButtonStates() {
  const [saving, setSaving] = React.useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => setSaving(false), 1600);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" kbd="⌘K">
          <SearchIcon />
          Search
        </Button>
        <Button loading={saving} onClick={save}>
          Save changes
        </Button>
        <Button variant="outline" size="icon" aria-label="Add item">
          <PlusIcon />
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">
          Large
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

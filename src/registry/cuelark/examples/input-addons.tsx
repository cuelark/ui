import { AtSignIcon, SearchIcon } from "lucide-react";

import { Input } from "@/registry/cuelark/ui/input";

export default function InputAddons() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input aria-label="Search" placeholder="Search components" leading={<SearchIcon />} trailing={<kbd className="cue-kbd">/</kbd>} />
      <Input aria-label="Website" placeholder="cuelark.com" leading={<span className="text-sm">https://</span>} />
      <Input aria-label="Username" placeholder="handle" leading={<AtSignIcon />} aria-invalid defaultValue="taken" />
      <Input aria-label="Disabled" placeholder="Disabled" disabled size="sm" />
    </div>
  );
}

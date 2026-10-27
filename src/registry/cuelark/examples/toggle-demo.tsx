import { BoldIcon, ItalicIcon, StarIcon } from "lucide-react";

import { Toggle } from "@/registry/cuelark/ui/toggle";

export default function ToggleDemo() {
  return (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic" defaultPressed>
        <ItalicIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Favorite">
        <StarIcon />
        Favorite
      </Toggle>
    </div>
  );
}

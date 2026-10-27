import { BoldIcon, ItalicIcon, LinkIcon, UnderlineIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/cuelark/ui/tooltip";

const tools = [
  { label: "Bold", kbd: "⌘B", icon: BoldIcon },
  { label: "Italic", kbd: "⌘I", icon: ItalicIcon },
  { label: "Underline", kbd: "⌘U", icon: UnderlineIcon },
  { label: "Insert link", kbd: "⌘K", icon: LinkIcon },
];

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <div role="toolbar" aria-label="Formatting" className="inline-flex gap-1 rounded-lg border border-border bg-card p-1 shadow-control">
        {tools.map(({ label, kbd, icon: Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={label}>
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent kbd={kbd}>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

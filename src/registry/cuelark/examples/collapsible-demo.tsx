import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/cuelark/ui/collapsible";

export default function CollapsibleDemo() {
  return (
    <Collapsible className="grid w-full max-w-sm gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">3 changed files</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle files">
            <ChevronsUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">src/routes/index.tsx</div>
      <CollapsibleContent className="grid gap-2">
        <div className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">src/lib/motion.ts</div>
        <div className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">src/styles/globals.css</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

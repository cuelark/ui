import { Button } from "@/registry/cuelark/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/cuelark/ui/tooltip";

const sides = ["top", "right", "bottom", "left"] as const;

export default function TooltipSides() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="capitalize">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Opens on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

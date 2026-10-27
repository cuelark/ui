import { Button } from "@/registry/cuelark/ui/button";
import { Input } from "@/registry/cuelark/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/cuelark/ui/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent marks className="grid gap-3">
        <div className="grid gap-1">
          <span className="cue-label">Layer</span>
          <p className="text-sm text-muted-foreground">Set the frame size in pixels.</p>
        </div>
        {["Width", "Height"].map((d) => (
          <label key={d} className="grid grid-cols-[4rem_1fr] items-center gap-2 text-sm">
            {d}
            <Input size="sm" defaultValue={d === "Width" ? "1440" : "900"} trailing="px" />
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

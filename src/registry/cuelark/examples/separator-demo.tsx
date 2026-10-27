import { Button } from "@/registry/cuelark/ui/button";
import { Separator } from "@/registry/cuelark/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Button variant="secondary">Continue with GitHub</Button>
      <Separator label="or" />
      <Button>Continue with email</Button>
      <Separator variant="dashed" />
      <div className="flex h-5 items-center gap-3 text-sm text-muted-foreground">
        Docs <Separator orientation="vertical" /> Components <Separator orientation="vertical" variant="dashed" /> Theming
      </div>
    </div>
  );
}

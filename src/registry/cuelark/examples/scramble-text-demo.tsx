import { ScrambleText } from "@/registry/cuelark/ui/scramble-text";

export default function ScrambleTextDemo() {
  return (
    <div className="grid gap-4 text-center">
      <ScrambleText text="SIGNAL ACQUIRED" trigger="mount" className="text-2xl font-semibold tracking-[0.2em] text-primary" />
      <p className="text-sm text-muted-foreground">
        Hover to decode: <ScrambleText text="cuelark.com" trigger="hover" chars="lowerCase" tabIndex={0} className="text-foreground underline decoration-dashed underline-offset-4" />
      </p>
    </div>
  );
}

import { TiltCard } from "@/registry/cuelark/ui/tilt-card";

export default function TiltCardDemo() {
  return (
    <TiltCard className="grid aspect-[1.6/1] w-full max-w-sm content-between p-6">
      <div className="flex items-center justify-between">
        <span className="cue-label">Cuelark · Member</span>
        <span className="size-8 rounded-md bg-signal" />
      </div>
      <div className="grid gap-1">
        <span className="font-mono text-lg tracking-[0.2em]">4242 0042 1987 2026</span>
        <span className="text-sm text-muted-foreground">Ada Lovelace · 10/29</span>
      </div>
    </TiltCard>
  );
}

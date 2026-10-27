import { BorderBeam } from "@/registry/cuelark/ui/border-beam";
import { Button } from "@/registry/cuelark/ui/button";

export default function BorderBeamDemo() {
  return (
    <div className="relative grid w-full max-w-xs gap-3 rounded-2xl border border-border bg-card p-6 shadow-raised">
      <span className="cue-label">Pro plan</span>
      <p className="text-3xl font-semibold tracking-tight">
        $24<span className="text-sm font-normal text-muted-foreground"> / month</span>
      </p>
      <p className="text-sm text-muted-foreground">Everything in Studio, plus SSO and audit logs.</p>
      <Button className="mt-2">Upgrade</Button>
      <BorderBeam />
    </div>
  );
}

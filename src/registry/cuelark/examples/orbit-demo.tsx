import { CloudIcon, CodeIcon, DatabaseIcon, GitBranchIcon, LockIcon, ZapIcon } from "lucide-react";

import { Orbit } from "@/registry/cuelark/ui/orbit";

const tile = "grid size-10 place-items-center rounded-xl border border-border bg-card shadow-raised [&_svg]:size-4.5";

export default function OrbitDemo() {
  return (
    <div className="relative h-80 w-full max-w-md">
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary font-semibold text-primary-foreground shadow-raised">cue</span>
      </div>
      <Orbit radius={70} duration={18}>
        <span className={tile}><ZapIcon /></span>
        <span className={tile}><LockIcon /></span>
        <span className={tile}><CodeIcon /></span>
      </Orbit>
      <Orbit radius={130} duration={30} reverse>
        <span className={tile}><CloudIcon /></span>
        <span className={tile}><DatabaseIcon /></span>
        <span className={tile}><GitBranchIcon /></span>
      </Orbit>
    </div>
  );
}

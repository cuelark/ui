import * as React from "react";

import { Button } from "@/registry/cuelark/ui/button";
import { Stepper } from "@/registry/cuelark/ui/stepper";

const steps = [
  { title: "Account", description: "Name and email" },
  { title: "Workspace", description: "Team and URL" },
  { title: "Billing", description: "Plan and card" },
  { title: "Done", description: "Invite your team" },
];

export default function StepperDemo() {
  const [current, setCurrent] = React.useState(1);
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <Stepper steps={steps} current={current} onStepClick={setCurrent} />
      <div className="flex justify-between">
        <Button variant="ghost" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Back
        </Button>
        <Button disabled={current === steps.length - 1} onClick={() => setCurrent((c) => c + 1)}>
          Continue
        </Button>
      </div>
    </div>
  );
}

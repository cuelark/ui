import * as React from "react";

import { Button } from "@/registry/cuelark/ui/button";
import { Plan } from "@/registry/cuelark/ui/plan";

const steps = [
  { label: "Create a shared tax helper", done: true },
  { label: "Use it in the invoice API" },
  { label: "Use it in the PDF renderer" },
  { label: "Add tests for both paths" },
  { label: "Update the changelog" },
  { label: "Open a pull request" },
];

export default function PlanDemo() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="grid w-full max-w-md gap-3">
      <Plan key={run} title="Plan · fix tax on invoices" steps={steps} autoRun={8} shortcuts={false} />
      <Button variant="ghost" size="xs" className="w-fit" onClick={() => setRun((r) => r + 1)}>
        Reset
      </Button>
    </div>
  );
}

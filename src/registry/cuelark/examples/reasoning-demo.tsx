import * as React from "react";

import { Button } from "@/registry/cuelark/ui/button";
import { Reasoning } from "@/registry/cuelark/ui/reasoning";

const thoughts = [
  "The user wants the invoice total to include tax only when a tax ID is present.",
  "Totals are computed in two places: the API and the PDF renderer. Both need the same rule.",
  "Safest change: move the rule into a shared helper and call it from both.",
  "Add a test for invoices with and without a tax ID.",
];

export default function ReasoningDemo() {
  const [shown, setShown] = React.useState(0);
  const streaming = shown < thoughts.length;
  React.useEffect(() => {
    if (!streaming) return;
    const id = setTimeout(() => setShown((n) => n + 1), 900);
    return () => clearTimeout(id);
  }, [shown, streaming]);
  return (
    <div className="grid w-full max-w-lg gap-4">
      <Reasoning streaming={streaming}>
        {thoughts.slice(0, shown).map((t) => (
          <p key={t}>{t}</p>
        ))}
      </Reasoning>
      <Button variant="ghost" size="xs" className="w-fit" onClick={() => setShown(0)}>
        Think again
      </Button>
    </div>
  );
}

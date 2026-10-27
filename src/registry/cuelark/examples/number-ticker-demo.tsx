import * as React from "react";

import { Button } from "@/registry/cuelark/ui/button";
import { NumberTicker } from "@/registry/cuelark/ui/number-ticker";

export default function NumberTickerDemo() {
  const [revenue, setRevenue] = React.useState(128450);
  return (
    <div className="grid justify-items-center gap-6">
      <div className="grid grid-cols-3 gap-8 text-center">
        <div className="grid justify-items-center gap-1.5">
          <NumberTicker value={revenue} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} trigger="mount" className="text-3xl font-semibold" />
          <span className="cue-label">Revenue</span>
        </div>
        <div className="grid justify-items-center gap-1.5">
          <NumberTicker value={98.9} format={{ minimumFractionDigits: 1 }} trigger="mount" className="text-3xl font-semibold" />
          <span className="cue-label">Uptime %</span>
        </div>
        <div className="grid justify-items-center gap-1.5">
          <NumberTicker value={52} trigger="mount" className="text-3xl font-semibold" />
          <span className="cue-label">Components</span>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={() => setRevenue((r) => r + Math.round(Math.random() * 9000))}>
        New sale
      </Button>
    </div>
  );
}

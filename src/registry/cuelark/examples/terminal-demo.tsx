import * as React from "react";

import { Terminal } from "@/registry/cuelark/ui/terminal";

const script = ["$ pnpm test billing", "", " RUN  v3.2.4", " ✓ tax.test.ts (6 tests) 41ms", " ✓ invoice.test.ts (12 tests) 88ms", " ✗ renew.test.ts > retries twice", "warn: 1 snapshot obsolete", "", "$ pnpm test billing --update", " ✓ renew.test.ts (4 tests) 23ms", "done in 1.9s"];

export default function TerminalDemo() {
  const [n, setN] = React.useState(1);
  React.useEffect(() => {
    const id = setInterval(() => setN((v) => (v >= script.length ? 1 : v + 1)), 450);
    return () => clearInterval(id);
  }, []);
  return <Terminal className="w-full max-w-lg" title="agent · shell" lines={script.slice(0, n)} streaming={n < script.length} />;
}

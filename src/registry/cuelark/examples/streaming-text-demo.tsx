import * as React from "react";

import { StreamingText } from "@/registry/cuelark/ui/streaming-text";

const reply =
  "Here is the plan: move the tax rule into one helper, call it from the API and the PDF renderer, and cover both with tests. Invoices without a tax ID keep their current totals, so nothing changes for most customers.";

export default function StreamingTextDemo() {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setN((v) => (v >= reply.length + 40 ? 0 : v + 6)), 70);
    return () => clearInterval(id);
  }, []);
  return <StreamingText className="max-w-lg" text={reply.slice(0, n)} streaming={n < reply.length} />;
}

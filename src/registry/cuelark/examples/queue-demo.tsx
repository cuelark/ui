import * as React from "react";

import { Queue } from "@/registry/cuelark/ui/queue";

export default function QueueDemo() {
  const [items, setItems] = React.useState([
    { id: "1", text: "Also update the changelog" },
    { id: "2", text: "Then open a draft pull request" },
    { id: "3", text: "Ping #billing when it's up" },
  ]);
  return <Queue className="w-full max-w-md" items={items} onItemsChange={setItems} />;
}

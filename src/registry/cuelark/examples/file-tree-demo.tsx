import * as React from "react";

import { FileTree } from "@/registry/cuelark/ui/file-tree";

const tree = [
  {
    name: "src",
    children: [
      { name: "billing", children: [{ name: "tax.ts", status: "modified" as const }, { name: "tax.test.ts", status: "added" as const }, { name: "legacy-tax.ts", status: "deleted" as const }] },
      { name: "pdf", children: [{ name: "render.ts", status: "modified" as const }] },
      { name: "index.ts" },
    ],
  },
  { name: "package.json" },
];

export default function FileTreeDemo() {
  const [selected, setSelected] = React.useState("src/billing/tax.ts");
  return <FileTree className="w-full max-w-xs" tree={tree} selected={selected} onSelect={setSelected} defaultExpanded={["src", "src/billing", "src/pdf"]} />;
}

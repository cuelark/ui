import { DatabaseIcon, GlobeIcon } from "lucide-react";

import { Tool } from "@/registry/cuelark/ui/tool";

export default function ToolDemo() {
  return (
    <div className="grid w-full max-w-lg gap-2">
      <Tool name="web_search" icon={<GlobeIcon />} status="success" duration={1.2} input={{ query: "tailwind v4 container queries" }} output={{ results: 8, top: "tailwindcss.com/docs/responsive-design" }} />
      <Tool name="sql.query" icon={<DatabaseIcon />} status="running" input={{ sql: "select count(*) from invoices where status = 'failed'" }} />
      <Tool name="deploy" status="error" duration={4.8} input={{ env: "production" }} output="Error: build failed: Type error in src/routes/index.tsx:42" />
    </div>
  );
}

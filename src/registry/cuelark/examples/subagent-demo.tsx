import { Subagent } from "@/registry/cuelark/ui/subagent";
import { Tool } from "@/registry/cuelark/ui/tool";

export default function SubagentDemo() {
  return (
    <div className="grid w-full max-w-lg gap-2">
      <Subagent name="research-agent" task="Find how other billing systems handle reverse-charge VAT" status="running" activity="Reading stripe.com/docs/tax…" />
      <Subagent name="test-writer" task="Write tests for tax() with and without a tax ID" status="done" duration={12.4} defaultOpen>
        <Tool name="write_file" status="success" duration={0.3} input={{ path: "billing/tax.test.ts" }} />
        <Tool name="shell.run" status="success" duration={2.1} input={{ cmd: "pnpm test tax" }} output="8 passed" />
      </Subagent>
    </div>
  );
}

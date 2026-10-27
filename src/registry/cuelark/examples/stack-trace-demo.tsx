import { StackTrace } from "@/registry/cuelark/ui/stack-trace";

const trace = `TypeError: Cannot read properties of undefined (reading 'taxId')
    at tax (src/billing/tax.ts:3:22)
    at total (src/billing/invoice.ts:18:30)
    at renderInvoice (src/pdf/render.ts:57:11)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Promise.all (index 0)
    at handler (node_modules/@tanstack/start/dist/server.js:212:9)`;

export default function StackTraceDemo() {
  return <StackTrace className="w-full max-w-xl" trace={trace} />;
}

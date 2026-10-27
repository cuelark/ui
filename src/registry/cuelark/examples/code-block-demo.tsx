import { CodeBlock } from "@/registry/cuelark/ui/code-block";

const code = `export function tax(i: Invoice) {
  if (!i.customer.taxId) return 0
  return Math.round(i.subtotal * i.rate * 100) / 100
}

export function total(i: Invoice) {
  return i.subtotal + tax(i)
}`;

export default function CodeBlockDemo() {
  return <CodeBlock className="w-full max-w-lg" code={code} language="ts" filename="billing/tax.ts" highlight={[2, 3]} />;
}

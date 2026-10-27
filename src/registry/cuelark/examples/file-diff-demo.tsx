import { FileDiff } from "@/registry/cuelark/ui/file-diff";

export default function FileDiffDemo() {
  return (
    <FileDiff
      className="w-full max-w-xl"
      filename="src/billing/tax.ts"
      lines={[
        { type: "context", content: "import { Invoice } from './types'" },
        { type: "context", content: "" },
        { type: "remove", content: "export const tax = (i: Invoice) => i.subtotal * i.rate" },
        { type: "add", content: "export function tax(i: Invoice) {" },
        { type: "add", content: "  if (!i.customer.taxId) return 0" },
        { type: "add", content: "  return Math.round(i.subtotal * i.rate * 100) / 100" },
        { type: "add", content: "}" },
        { type: "context", content: "" },
        { type: "context", content: "export function total(i: Invoice) {" },
        { type: "context", content: "  return i.subtotal + tax(i)" },
        { type: "context", content: "}" },
      ]}
    />
  );
}

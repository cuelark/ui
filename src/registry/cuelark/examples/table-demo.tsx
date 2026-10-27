import { Badge } from "@/registry/cuelark/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/registry/cuelark/ui/table";

const invoices = [
  { id: "INV-0042", customer: "Atlas Labs", status: "Paid", amount: 1290 },
  { id: "INV-0043", customer: "Borealis", status: "Pending", amount: 480 },
  { id: "INV-0044", customer: "Cinder & Co", status: "Paid", amount: 2350 },
  { id: "INV-0045", customer: "Driftwood", status: "Overdue", amount: 99 },
];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const tone = { Paid: "success", Pending: "warning", Overdue: "destructive" } as const;

export default function TableDemo() {
  return (
    <div className="w-full max-w-2xl">
      <Table striped>
        <TableCaption>Invoices for October 2026.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead numeric>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-mono text-xs">{inv.id}</TableCell>
              <TableCell>{inv.customer}</TableCell>
              <TableCell>
                <Badge size="sm" dot variant={tone[inv.status as keyof typeof tone]}>
                  {inv.status}
                </Badge>
              </TableCell>
              <TableCell numeric>{money.format(inv.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell numeric>{money.format(invoices.reduce((s, i) => s + i.amount, 0))}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

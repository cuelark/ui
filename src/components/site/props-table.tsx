import type { ComponentDoc } from "@/content/components";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/cuelark/ui/table";

export function PropsTable({ api }: { api: ComponentDoc["api"] }) {
  return (
    <div className="grid gap-8">
      {api.map((part) => (
        <section key={part.part} className="grid gap-3">
          <h3 className="font-mono text-sm font-medium">{part.part}</h3>
          {part.description && <p className="text-sm text-muted-foreground">{part.description}</p>}
          {part.props.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prop</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="w-2/5">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {part.props.map((p) => (
                  <TableRow key={p.prop}>
                    <TableCell className="font-mono text-xs font-medium text-primary">{p.prop}</TableCell>
                    <TableCell className="max-w-64 font-mono text-xs whitespace-normal text-muted-foreground">{p.type}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.default ?? "—"}</TableCell>
                    <TableCell className="text-sm whitespace-normal text-muted-foreground">{p.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      ))}
    </div>
  );
}

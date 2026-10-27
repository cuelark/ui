import { ArrowUpRightIcon } from "lucide-react";

import { Card, CardDescription, CardHeader, CardLabel, CardTitle } from "@/registry/cuelark/ui/card";

const variants = [
  { variant: "outline", note: "Hairline border on the card surface." },
  { variant: "raised", note: "Adds the tactile highlight and a soft drop." },
  { variant: "inset", note: "Dashed and recessed, for empty or secondary areas." },
] as const;

export default function CardVariants() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
      {variants.map(({ variant, note }) => (
        <Card key={variant} variant={variant} interactive>
          <CardHeader>
            <CardLabel>{variant}</CardLabel>
            <CardTitle>
              <a href={`#${variant}`} className="inline-flex items-center gap-1 outline-none after:absolute after:inset-0">
                {variant[0]!.toUpperCase() + variant.slice(1)}
                <ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
              </a>
            </CardTitle>
            <CardDescription>{note}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

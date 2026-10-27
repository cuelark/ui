import { Label } from "@/registry/cuelark/ui/label";
import { NumberField } from "@/registry/cuelark/ui/number-field";

export default function NumberFieldDemo() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <div className="grid gap-2">
        <Label htmlFor="seats">Seats</Label>
        <NumberField id="seats" defaultValue={3} min={1} max={50} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="budget">Monthly budget</Label>
        <NumberField id="budget" defaultValue={250} step={25} min={0} formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} className="w-40" />
      </div>
    </div>
  );
}

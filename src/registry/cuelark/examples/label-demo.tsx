import { Input } from "@/registry/cuelark/ui/input";
import { Label } from "@/registry/cuelark/ui/label";

export default function LabelDemo() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <div className="grid gap-2">
        <Label htmlFor="company" required>
          Company
        </Label>
        <Input id="company" placeholder="Acme Inc." required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vat" optional>
          VAT number
        </Label>
        <Input id="vat" placeholder="DE123456789" />
      </div>
    </div>
  );
}

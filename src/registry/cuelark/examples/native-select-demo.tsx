import { Label } from "@/registry/cuelark/ui/label";
import { NativeSelect } from "@/registry/cuelark/ui/native-select";

export default function NativeSelectDemo() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="country">Country</Label>
      <NativeSelect id="country" defaultValue="in" className="w-64">
        <option value="us">United States</option>
        <option value="gb">United Kingdom</option>
        <option value="in">India</option>
        <option value="de">Germany</option>
        <option value="jp">Japan</option>
      </NativeSelect>
    </div>
  );
}

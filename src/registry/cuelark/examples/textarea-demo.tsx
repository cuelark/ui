import { Label } from "@/registry/cuelark/ui/label";
import { Textarea } from "@/registry/cuelark/ui/textarea";

export default function TextareaDemo() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <Label htmlFor="bio">Short bio</Label>
      <Textarea id="bio" autoGrow showCount maxLength={160} placeholder="Designer and engineer, building calm software." className="max-h-48" />
    </div>
  );
}

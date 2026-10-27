import { Checkbox } from "@/registry/cuelark/ui/checkbox";

export default function CheckboxDemo() {
  return (
    <div className="grid gap-4">
      <label className="flex items-center gap-2.5 text-sm">
        <Checkbox defaultChecked />
        Email me about product updates
      </label>
      <label className="flex items-start gap-2.5 text-sm">
        <Checkbox className="mt-0.5" />
        <span className="grid gap-0.5">
          Share anonymous usage
          <span className="text-xs text-muted-foreground">Helps us decide what to build next.</span>
        </span>
      </label>
      <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <Checkbox disabled />
        Disabled
      </label>
    </div>
  );
}

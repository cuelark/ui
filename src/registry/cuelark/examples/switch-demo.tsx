import { Switch } from "@/registry/cuelark/ui/switch";

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-6">
      <Switch size="sm" aria-label="Small switch" defaultChecked />
      <Switch aria-label="Medium switch" defaultChecked />
      <Switch size="lg" aria-label="Large switch" />
      <Switch aria-label="Disabled switch" disabled />
    </div>
  );
}

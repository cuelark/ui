import { Switch } from "@/registry/cuelark/ui/switch";

const settings = [
  { id: "digest", label: "Weekly digest", hint: "A Monday summary of everything that shipped.", on: true },
  { id: "mentions", label: "Mentions", hint: "Notify me when someone @mentions me.", on: true },
  { id: "marketing", label: "Product news", hint: "Launches, betas and the occasional survey.", on: false },
];

export default function SwitchSettings() {
  return (
    <ul className="w-full max-w-md">
      {settings.map((s) => (
        <li key={s.id} className="cue-dash-b flex items-center justify-between gap-6 py-3 last:bg-none">
          <label htmlFor={s.id} className="grid gap-0.5 text-sm font-medium">
            {s.label}
            <span className="text-xs font-normal text-muted-foreground">{s.hint}</span>
          </label>
          <Switch id={s.id} defaultChecked={s.on} />
        </li>
      ))}
    </ul>
  );
}

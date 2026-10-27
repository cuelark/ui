import { RadioGroup, RadioGroupCard, RadioGroupItem } from "@/registry/cuelark/ui/radio-group";

const plans = [
  { value: "hobby", name: "Hobby", price: "Free", note: "1 project" },
  { value: "studio", name: "Studio", price: "$24", note: "Unlimited projects" },
  { value: "scale", name: "Scale", price: "$96", note: "SSO and audit logs" },
];

export default function RadioGroupDemo() {
  return (
    <div className="grid w-full max-w-xl gap-8">
      <RadioGroup defaultValue="studio" aria-label="Plan" className="grid gap-4 sm:grid-cols-3">
        {plans.map((p) => (
          <RadioGroupCard key={p.value} value={p.value}>
            <span className="cue-label">{p.name}</span>
            <span className="text-xl font-semibold tracking-tight">{p.price}</span>
            <span className="text-xs text-muted-foreground">{p.note}</span>
          </RadioGroupCard>
        ))}
      </RadioGroup>
      <RadioGroup defaultValue="email" aria-label="Contact method" className="flex gap-6">
        {["email", "phone", "none"].map((v) => (
          <label key={v} className="flex items-center gap-2 text-sm capitalize">
            <RadioGroupItem value={v} />
            {v}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

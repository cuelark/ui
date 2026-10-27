import { Input } from "@/registry/cuelark/ui/input";

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="email" className="text-sm font-medium">
        Work email
      </label>
      <Input id="email" type="email" placeholder="you@example.com" aria-describedby="email-hint" />
      <p id="email-hint" className="text-xs text-muted-foreground">
        We only use it for receipts and security alerts.
      </p>
    </div>
  );
}

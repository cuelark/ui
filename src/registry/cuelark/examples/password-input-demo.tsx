import { Label } from "@/registry/cuelark/ui/label";
import { PasswordInput } from "@/registry/cuelark/ui/password-input";

export default function PasswordInputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="new-password">Create a password</Label>
      <PasswordInput id="new-password" placeholder="At least 8 characters" />
    </div>
  );
}

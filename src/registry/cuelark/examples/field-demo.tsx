import * as React from "react";

import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@/registry/cuelark/ui/field";
import { Input } from "@/registry/cuelark/ui/input";

export default function FieldDemo() {
  const [handle, setHandle] = React.useState("ada lovelace");
  const invalid = /\s/.test(handle);
  return (
    <Field invalid={invalid} className="w-full max-w-sm">
      <FieldLabel>Username</FieldLabel>
      <FieldControl>
        <Input value={handle} onChange={(e) => setHandle(e.target.value)} leading="@" />
      </FieldControl>
      <FieldDescription>Your public handle. Letters, numbers and dashes.</FieldDescription>
      <FieldError>Spaces aren't allowed. Try “{handle.replace(/\s+/g, "-")}”.</FieldError>
    </Field>
  );
}

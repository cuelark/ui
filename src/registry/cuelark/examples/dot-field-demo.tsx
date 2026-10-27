import { DotField } from "@/registry/cuelark/ui/dot-field";

export default function DotFieldDemo() {
  return (
    <DotField className="grid h-72 w-full max-w-xl place-items-center rounded-2xl border border-border bg-card">
      <div className="grid justify-items-center gap-2 p-10 text-center">
        <span className="cue-label">Move · click</span>
        <p className="text-2xl font-semibold tracking-tight">The background answers back.</p>
      </div>
    </DotField>
  );
}

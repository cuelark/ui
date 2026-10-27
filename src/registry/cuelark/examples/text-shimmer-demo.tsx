import { TextShimmer } from "@/registry/cuelark/ui/text-shimmer";

export default function TextShimmerDemo() {
  return (
    <div className="grid gap-3 text-sm">
      <TextShimmer className="font-medium">Searching the docs…</TextShimmer>
      <TextShimmer duration={2.4} className="text-lg font-semibold tracking-tight">
        Generating a migration plan
      </TextShimmer>
    </div>
  );
}

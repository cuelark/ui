import { Label } from "@/registry/cuelark/ui/label";
import { TagInput } from "@/registry/cuelark/ui/tag-input";

export default function TagInputDemo() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <Label>Skills</Label>
      <TagInput defaultValue={["React", "TypeScript"]} suggestions={["Tailwind CSS", "GSAP", "Radix UI", "Next.js", "Node.js", "Design systems"]} aria-label="Add a skill" />
      <p className="text-xs text-muted-foreground">Enter or comma to add · Tab accepts the suggestion · Backspace twice removes</p>
    </div>
  );
}

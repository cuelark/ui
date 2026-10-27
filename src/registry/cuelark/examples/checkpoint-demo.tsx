import { Checkpoint } from "@/registry/cuelark/ui/checkpoint";

export default function CheckpointDemo() {
  return <Checkpoint className="w-full max-w-lg" label="Before refactor" time="14:02" onRestore={() => {}} />;
}

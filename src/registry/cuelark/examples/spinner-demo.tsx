import { Spinner } from "@/registry/cuelark/ui/spinner";

export default function SpinnerDemo() {
  return (
    <div className="flex items-center gap-10 text-primary">
      <Spinner variant="marks" size="lg" />
      <Spinner variant="marks" />
      <Spinner variant="ring" className="text-muted-foreground" />
      <Spinner variant="dots" className="text-muted-foreground" />
    </div>
  );
}

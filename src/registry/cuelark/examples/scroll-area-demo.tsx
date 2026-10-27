import { ScrollArea } from "@/registry/cuelark/ui/scroll-area";

const tags = Array.from({ length: 40 }, (_, i) => `v1.${40 - i}.0`);

export default function ScrollAreaDemo() {
  return (
    <ScrollArea fade className="h-64 w-56 rounded-lg border border-border bg-card shadow-control">
      <div className="p-4">
        <h4 className="cue-label mb-3">Releases</h4>
        {tags.map((t) => (
          <div key={t} className="cue-dash-b py-2 font-mono text-sm last:bg-none">
            {t}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

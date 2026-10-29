import { CopyButton } from "@/registry/cuelark/ui/copy-button";

export default function CopyButtonDemo() {
  const command = "npx shadcn@latest add https://ui.cuelark.com/r/button.json";
  return (
    <div className="grid w-full max-w-lg grid-cols-1 gap-4">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card py-1.5 ps-4 pe-1.5 shadow-control">
        <code className="min-w-0 flex-1 truncate font-mono text-xs">{command}</code>
        <CopyButton value={command} />
      </div>
      <CopyButton value="contact@cuelark.com" label="Copy email" variant="secondary" className="w-fit" />
    </div>
  );
}

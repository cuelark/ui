import { WebPreview } from "@/registry/cuelark/ui/web-preview";

export default function WebPreviewDemo() {
  return (
    <WebPreview className="h-80 w-full max-w-xl" url="localhost:3000/dashboard">
      <div className="grid h-full content-start gap-3 p-5">
        <div className="h-3 w-24 rounded-full bg-foreground/80" />
        <div className="h-2 w-48 rounded-full bg-muted-foreground/30" />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 rounded-lg border border-border bg-card" />
          ))}
        </div>
        <div className="h-8 w-28 rounded-md bg-primary" />
      </div>
    </WebPreview>
  );
}

import { AspectRatio } from "@/registry/cuelark/ui/aspect-ratio";

export default function AspectRatioDemo() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border">
      <AspectRatio ratio={16 / 9} className="rounded-2xl">
        <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_30%,var(--signal),transparent_60%),linear-gradient(135deg,var(--muted),var(--card))]">
          <span className="cue-label rounded-full bg-background/80 px-2.5 py-1 backdrop-blur">16 : 9</span>
        </div>
      </AspectRatio>
    </div>
  );
}

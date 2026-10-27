import { CompareSlider } from "@/registry/cuelark/ui/compare-slider";

function Mock({ dark }: { dark?: boolean }) {
  return (
    <div className={dark ? "dark" : ""}>
      <div className="grid h-full content-start gap-3 bg-background p-6 text-foreground">
        <div className="h-3 w-24 rounded-full bg-foreground/80" />
        <div className="h-2 w-40 rounded-full bg-muted-foreground/40" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-lg border border-border bg-card" />
          ))}
        </div>
        <div className="mt-2 h-8 w-28 rounded-md bg-primary" />
      </div>
    </div>
  );
}

export default function CompareSliderDemo() {
  return <CompareSlider className="aspect-[16/10] w-full max-w-lg" before={<Mock />} after={<Mock dark />} beforeLabel="Light" afterLabel="Dark" />;
}

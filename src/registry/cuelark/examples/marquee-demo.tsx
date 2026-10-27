import { Marquee } from "@/registry/cuelark/ui/marquee";

const stack = ["React 19", "Tailwind CSS v4", "Radix UI", "GSAP", "TypeScript", "shadcn/ui", "TanStack", "Vite", "Cloudflare"];

export default function MarqueeDemo() {
  return (
    <div className="grid w-full gap-4">
      <Marquee>
        {stack.map((s) => (
          <span key={s} className="cue-label text-sm whitespace-nowrap text-foreground">
            {s}
          </span>
        ))}
      </Marquee>
      <Marquee reverse speed={28} gap="1rem">
        {stack.map((s) => (
          <span key={s} className="rounded-full border border-border bg-card px-3 py-1 text-sm whitespace-nowrap shadow-control">
            {s}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

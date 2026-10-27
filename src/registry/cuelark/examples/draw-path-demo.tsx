import { DrawPath } from "@/registry/cuelark/ui/draw-path";

export default function DrawPathDemo() {
  return (
    <div className="grid justify-items-center gap-2">
      <DrawPath viewBox="0 0 320 120" className="w-80 text-foreground" strokeWidth={2.5} trigger="mount">
        <path d="M20 80 C 40 20, 70 20, 80 70 S 120 110, 140 60 S 170 10, 190 60 S 230 100, 250 50 S 290 30, 300 70" />
        <path d="M30 100 H 290" className="text-signal" stroke="var(--signal)" strokeWidth={4} />
      </DrawPath>
      <span className="cue-label">Signed, sealed, drawn</span>
    </div>
  );
}

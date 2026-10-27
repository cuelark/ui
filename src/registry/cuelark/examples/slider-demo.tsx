import { Slider } from "@/registry/cuelark/ui/slider";

export default function SliderDemo() {
  return (
    <div className="grid w-full max-w-sm gap-10 pt-6">
      <Slider defaultValue={[64]} showValue format={(v) => `${v}%`} aria-label="Volume" />
      <Slider defaultValue={[20, 80]} step={10} showValue ticks={[0, 25, 50, 75, 100]} format={(v) => `$${v}`} aria-label="Price range" />
    </div>
  );
}

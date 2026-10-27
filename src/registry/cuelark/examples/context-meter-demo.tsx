import { ContextMeter } from "@/registry/cuelark/ui/context-meter";

export default function ContextMeterDemo() {
  return (
    <div className="flex items-center gap-4">
      <ContextMeter used={38000} max={200000} breakdown={{ input: 30000, output: 8000 }} cost={0.11} />
      <ContextMeter used={152000} max={200000} breakdown={{ input: 120000, output: 18000, cached: 14000 }} cost={1.27} />
      <ContextMeter used={191000} max={200000} breakdown={{ input: 160000, output: 31000 }} cost={2.4} />
    </div>
  );
}

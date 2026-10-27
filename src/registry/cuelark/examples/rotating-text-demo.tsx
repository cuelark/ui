import { RotatingText } from "@/registry/cuelark/ui/rotating-text";

export default function RotatingTextDemo() {
  return (
    <h2 className="text-center text-3xl font-semibold tracking-tight">
      Components for{" "}
      <RotatingText words={["dashboards", "landing pages", "docs", "admin tools"]} className="text-primary" />
    </h2>
  );
}

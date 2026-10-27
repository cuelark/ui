import { Typewriter } from "@/registry/cuelark/ui/typewriter";

export default function TypewriterDemo() {
  return (
    <p className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
      Ship <Typewriter text={["dashboards.", "landing pages.", "design systems.", "faster."]} />
    </p>
  );
}

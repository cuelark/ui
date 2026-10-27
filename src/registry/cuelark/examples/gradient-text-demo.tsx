import { GradientText } from "@/registry/cuelark/ui/gradient-text";

export default function GradientTextDemo() {
  return (
    <div className="grid justify-items-center gap-6 text-center">
      <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Interfaces with a <GradientText>signal</GradientText>.
      </h2>
      <p className="max-w-md text-2xl font-semibold tracking-tight">
        <GradientText variant="spotlight">Move your pointer across this line to light it like a torch.</GradientText>
      </p>
      <span className="cue-label">drift · spotlight</span>
    </div>
  );
}

import { TextReveal } from "@/registry/cuelark/ui/text-reveal";

export default function TextRevealDemo() {
  return (
    <div className="grid max-w-xl gap-4 text-center">
      <TextReveal as="h2" split="chars" trigger="mount" className="text-4xl font-semibold tracking-tight">
        Interfaces with a cue.
      </TextReveal>
      <TextReveal split="words" effect="blur" trigger="mount" delay={0.4} className="text-muted-foreground">
        Every word is in the server-rendered HTML, so search engines read it all while visitors watch it arrive.
      </TextReveal>
    </div>
  );
}

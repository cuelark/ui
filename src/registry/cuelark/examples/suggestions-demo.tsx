import { SparklesIcon } from "lucide-react";

import { Suggestion, Suggestions } from "@/registry/cuelark/ui/suggestions";

export default function SuggestionsDemo() {
  return (
    <Suggestions className="w-full max-w-lg">
      {["Explain this error", "Write tests for it", "Make it faster", "Add dark mode", "Summarize the PR"].map((s) => (
        <Suggestion key={s}>
          <SparklesIcon /> {s}
        </Suggestion>
      ))}
    </Suggestions>
  );
}

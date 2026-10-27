import * as React from "react";

import { ContextMeter } from "@/registry/cuelark/ui/context-meter";
import { ModelSelector } from "@/registry/cuelark/ui/model-selector";
import { PromptInput } from "@/registry/cuelark/ui/prompt-input";

const models = [
  { id: "claude", name: "Claude Opus", provider: "Anthropic", context: "200k", tags: ["reasoning"] },
  { id: "gpt", name: "GPT-5", provider: "OpenAI", context: "400k", tags: ["fast"] },
  { id: "gemini", name: "Gemini Pro", provider: "Google", context: "1M" },
];

export default function PromptInputDemo() {
  const [status, setStatus] = React.useState<"idle" | "streaming">("idle");
  return (
    <PromptInput
      className="w-full max-w-xl"
      status={status}
      onSubmit={() => {
        setStatus("streaming");
        setTimeout(() => setStatus("idle"), 2500);
      }}
      onStop={() => setStatus("idle")}
      placeholder="Ask the agent to change something…"
      toolbar={
        <>
          <ModelSelector models={models} />
          <ContextMeter used={84200} max={200000} breakdown={{ input: 61000, output: 9200, cached: 14000 }} cost={0.42} />
        </>
      }
    />
  );
}

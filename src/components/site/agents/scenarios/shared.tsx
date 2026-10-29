import { PiSparkleFill as SparklesIcon } from "react-icons/pi";

import { MessageAvatar } from "@/registry/cuelark/ui/message";

export const MODELS = [
  { id: "opus", name: "Claude Opus", provider: "Anthropic", context: "200k", tags: ["reasoning"] },
  { id: "gpt5", name: "GPT-5", provider: "OpenAI", context: "400k", tags: ["reasoning"] },
  { id: "gemini", name: "Gemini Pro", provider: "Google", context: "1M" },
];

export function AgentAvatar() {
  return (
    <MessageAvatar className="bg-foreground text-background">
      <SparklesIcon />
    </MessageAvatar>
  );
}

import { ModelSelector } from "@/registry/cuelark/ui/model-selector";

const models = [
  { id: "opus", name: "Claude Opus", provider: "Anthropic", context: "200k", tags: ["reasoning"] },
  { id: "sonnet", name: "Claude Sonnet", provider: "Anthropic", context: "1M", tags: ["balanced"] },
  { id: "gpt5", name: "GPT-5", provider: "OpenAI", context: "400k", tags: ["reasoning"] },
  { id: "gpt5mini", name: "GPT-5 mini", provider: "OpenAI", context: "400k", tags: ["fast"] },
  { id: "gemini", name: "Gemini Pro", provider: "Google", context: "1M", tags: ["multimodal"] },
];

export default function ModelSelectorDemo() {
  return <ModelSelector models={models} defaultValue="sonnet" />;
}

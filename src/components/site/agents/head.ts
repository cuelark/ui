import { SCENARIOS, type Scenario } from "@/content/agent-guide";
import { SHOTS } from "@/content/agent-shots";
import { components } from "@/content/components";
import { SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";
import { AGENTS_FAQ } from "./agents-page";

const agents = components.filter((c) => c.section === "Agents");
const KEYWORDS = [
  "ai agent ui components",
  "agentic ui",
  "agentic ui components",
  "ai chat ui react",
  "ai elements alternative",
  "shadcn ai components",
  "vercel ai sdk ui components",
  "llm ui kit",
  "chatbot ui react",
  "tool calling ui",
  "human in the loop ui",
  "ai reasoning ui",
];

/** Head tags for /agents (the first scenario) and each /agents/<scenario> page. */
export function agentsHead(scenario: Scenario) {
  const index = scenario === SCENARIOS[0];
  const path = index ? "/agents" : `/agents/${scenario.slug}`;
  const title = index ? "AI agent UI components for React and shadcn/ui" : `${scenario.title}: a live React example`;
  const description = index
    ? `${agents.length} open-source components for AI chat and agents, shown in live coding, research and data agents: prompt input, reasoning, tool calls, plans with approval, diffs, citations, artifacts and traces. Built for shadcn/ui and the Vercel AI SDK.`
    : `${scenario.description} Built from open-source Cuelark UI components for React and shadcn/ui.`;
  const shot = SHOTS[`scenario:${scenario.slug}`];
  const used = scenario.components.map((slug) => components.find((c) => c.slug === slug)).filter((c) => !!c);
  return seo({
    title,
    description,
    path,
    image: shot?.src,
    keywords: index ? KEYWORDS : [...scenario.keywords, ...KEYWORDS.slice(0, 4)],
    jsonLd: [
      ld.collection(title, description, path, (index ? agents : used).map((c) => ({ name: c.name, path: `/components/${c.slug}` }))),
      ld.breadcrumbs([
        { name: SITE.name, path: "/" },
        { name: "Agents", path: "/agents" },
        ...(index ? [] : [{ name: scenario.label, path }]),
      ]),
      ...(index ? [ld.faq(AGENTS_FAQ)] : []),
    ],
  });
}

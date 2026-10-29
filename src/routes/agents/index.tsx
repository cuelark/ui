import { createFileRoute } from "@tanstack/react-router";

import { AgentsPage } from "@/components/site/agents/agents-page";
import { agentsHead } from "@/components/site/agents/head";
import { SCENARIOS } from "@/content/agent-guide";

export const Route = createFileRoute("/agents/")({
  head: () => agentsHead(SCENARIOS[0]!),
  component: () => <AgentsPage scenario={SCENARIOS[0]!} />,
});

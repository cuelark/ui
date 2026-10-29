import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { AgentsPage } from "@/components/site/agents/agents-page";
import { agentsHead } from "@/components/site/agents/head";
import { SCENARIOS, scenarioBySlug } from "@/content/agent-guide";

export const Route = createFileRoute("/agents/$scenario")({
  beforeLoad: ({ params }) => {
    // The first scenario is the /agents page itself: one URL per page.
    if (params.scenario === SCENARIOS[0]!.slug) throw redirect({ to: "/agents", statusCode: 301 });
    if (!scenarioBySlug(params.scenario)) throw notFound();
  },
  loader: ({ params }) => scenarioBySlug(params.scenario)!,
  head: ({ loaderData }) => (loaderData ? agentsHead(loaderData) : {}),
  component: ScenarioPage,
});

function ScenarioPage() {
  const scenario = Route.useLoaderData();
  return <AgentsPage scenario={scenario} />;
}

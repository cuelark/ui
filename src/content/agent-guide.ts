/**
 * The agent UI guide: the scenarios on /agents, the zones of an agent app and which component goes where, and the
 * lifecycle groups the component index is organised by. Plain data (no React) so the sitemap and llms.txt can use it.
 */

export type Scenario = {
  slug: string;
  /** Tab label. */
  label: string;
  /** H1/H2 and <title> for the scenario page. */
  title: string;
  description: string;
  keywords: string[];
  /** Components the demo uses, in the order they appear. */
  components: string[];
};

export const SCENARIOS: Scenario[] = [
  {
    slug: "coding-agent",
    label: "Coding agent",
    title: "Coding agent UI",
    description:
      "A coding agent that reasons, searches the code, proposes a diff, waits for you to approve its plan, runs the tests and answers with citations, while the trace, changed files and test results fill the side panel.",
    keywords: ["coding agent ui", "ai code assistant ui react", "cursor style agent ui", "ai pair programmer interface", "diff approval ui"],
    components: ["checkpoint", "message", "reasoning", "chain-of-thought", "tool", "file-diff", "plan", "terminal", "streaming-text", "inline-citation", "sources", "suggestions", "prompt-input", "model-selector", "context-meter", "trace-waterfall", "file-tree", "test-results"],
  },
  {
    slug: "research-agent",
    label: "Research agent",
    title: "Research agent UI",
    description:
      "A research agent that plans its work, hands it to two sub-agents running in parallel, cites every claim and writes a brief into an artifact beside the chat, while you queue follow-ups.",
    keywords: ["research agent ui", "deep research ui", "multi agent ui react", "ai citations ui", "ai report generator ui"],
    components: ["message", "reasoning", "task", "subagent", "tool", "streaming-text", "inline-citation", "sources", "queue", "prompt-input", "artifact", "context-meter", "trace-waterfall"],
  },
  {
    slug: "data-analyst-agent",
    label: "Data analyst",
    title: "Data analyst agent UI",
    description:
      "A data agent that queries a warehouse, recovers from a failed query, charts the result as an artifact, asks before it writes to a shared dashboard and offers two versions of its answer.",
    keywords: ["ai data analyst ui", "text to sql ui", "ai analytics agent interface", "chat with your data ui", "ai chart generation ui"],
    components: ["message", "reasoning", "stack-trace", "tool", "code-block", "confirmation", "branch", "streaming-text", "suggestions", "prompt-input", "model-selector", "artifact", "context-meter", "trace-waterfall"],
  },
];

export const scenarioBySlug = (slug: string) => SCENARIOS.find((s) => s.slug === slug);

/** Where things live in an agent app. Each zone lists its components with when to reach for them. */
export type Zone = {
  id: string;
  name: string;
  summary: string;
  items: { slug: string; when: string; avoid?: string }[];
};

export const ZONES: Zone[] = [
  {
    id: "composer",
    name: "Composer",
    summary: "The bottom of the chat, where people start and steer a run.",
    items: [
      { slug: "prompt-input", when: "Always: the one place to type, attach files, pick a model and stop a run.", avoid: "A plain textarea without a Stop button once replies stream." },
      { slug: "suggestions", when: "Empty states and after an answer, to show what to ask next.", avoid: "More than three or four at once; they become noise." },
      { slug: "queue", when: "Runs that take more than a few seconds, so people can line up follow-ups instead of waiting." },
      { slug: "model-selector", when: "Products that let people trade speed, cost and quality per task." },
    ],
  },
  {
    id: "thread",
    name: "Thread",
    summary: "The conversation itself: who said what, in order.",
    items: [
      { slug: "conversation", when: "The scroll container: it follows a streaming reply and lets go when people scroll up." },
      { slug: "message", when: "Every turn, with actions (copy, retry, rate) on assistant replies." },
      { slug: "streaming-text", when: "Any reply that arrives token by token." },
      { slug: "branch", when: "Regenerated or edited replies, so earlier versions stay one click away." },
      { slug: "checkpoint", when: "Before an agent changes files or data, so people can roll back to that point." },
    ],
  },
  {
    id: "work",
    name: "Work in progress",
    summary: "Inside the assistant's turn, before the answer: what it is thinking and doing.",
    items: [
      { slug: "reasoning", when: "Models that think before answering: stream it, then fold it to one line.", avoid: "Leaving the full trace open after the answer starts." },
      { slug: "chain-of-thought", when: "Multi-step work where people want to see progress at a glance." },
      { slug: "task", when: "A checklist the agent works through, such as a research or migration plan." },
      { slug: "tool", when: "Every tool call: name, status, duration, and the exact input and output one click away." },
      { slug: "subagent", when: "Work handed to another agent, so it is always clear who did what." },
      { slug: "text-shimmer", when: "Short live status lines like “Searching…”." },
    ],
  },
  {
    id: "approvals",
    name: "Approvals",
    summary: "The moments the agent stops and asks. They block the run, so make them unmissable.",
    items: [
      { slug: "plan", when: "Before multi-step work: show the steps and wait (optionally auto-run after a countdown)." },
      { slug: "confirmation", when: "Before one action with side effects: sending, paying, deleting, deploying. Risky ones need a hold.", avoid: "Asking for harmless reads; people learn to click through." },
    ],
  },
  {
    id: "evidence",
    name: "Evidence",
    summary: "Why people can trust the answer.",
    items: [
      { slug: "inline-citation", when: "Right after the claim it supports." },
      { slug: "sources", when: "Under the answer: everything the agent read, collapsed to one pill." },
    ],
  },
  {
    id: "panel",
    name: "Side panel",
    summary: "Beside the chat: the things the agent made or changed, too big for a message.",
    items: [
      { slug: "artifact", when: "Documents, charts and components the agent produced, with full screen and download." },
      { slug: "web-preview", when: "A page or deploy the agent built, in a framed browser." },
      { slug: "file-tree", when: "The files a coding agent touched, marked added, modified or deleted." },
      { slug: "file-diff", when: "A proposed change, to accept or reject (also fine inline in the thread)." },
      { slug: "code-block", when: "Code or queries the agent wrote." },
      { slug: "terminal", when: "Live command output while the agent runs something." },
      { slug: "test-results", when: "The outcome of a test run, failures open." },
      { slug: "stack-trace", when: "Errors the agent hit or is fixing, with library frames folded." },
    ],
  },
  {
    id: "observe",
    name: "Run header",
    summary: "For power users and developers: what the run costs and where the time went.",
    items: [
      { slug: "context-meter", when: "Long sessions where the context window fills up, with tokens and cost on hover." },
      { slug: "trace-waterfall", when: "Agent runs with many steps or sub-agents: every model and tool call on one timeline." },
    ],
  },
];

/** The agent lifecycle, used to group the component index. */
export const LIFECYCLE: { id: string; name: string; summary: string; slugs: string[] }[] = [
  { id: "ask", name: "Ask", summary: "Start and steer a run.", slugs: ["prompt-input", "suggestions", "queue", "model-selector"] },
  { id: "think", name: "Think", summary: "Show the work without burying the answer.", slugs: ["reasoning", "chain-of-thought", "task", "text-shimmer"] },
  { id: "act", name: "Act", summary: "Tool calls, delegation and the things they produce.", slugs: ["tool", "subagent", "terminal", "file-diff", "file-tree", "code-block", "test-results", "stack-trace", "web-preview"] },
  { id: "approve", name: "Approve", summary: "Stop and ask before anything with side effects.", slugs: ["plan", "confirmation", "checkpoint"] },
  { id: "answer", name: "Answer", summary: "The reply, its versions and where it came from.", slugs: ["conversation", "message", "streaming-text", "branch", "inline-citation", "sources", "artifact"] },
  { id: "observe", name: "Observe", summary: "Cost, context and timing.", slugs: ["context-meter", "trace-waterfall"] },
];

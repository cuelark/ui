import { TraceWaterfall } from "@/registry/cuelark/ui/trace-waterfall";

export default function TraceWaterfallDemo() {
  return (
    <TraceWaterfall
      className="w-full max-w-2xl"
      spans={[
        {
          id: "run",
          name: "support-agent",
          kind: "agent",
          start: 0,
          end: 7.8,
          children: [
            { id: "plan", name: "model.plan", kind: "llm", start: 0.1, end: 1.6, tokens: 1840, cost: 0.012 },
            { id: "kb", name: "search_docs", kind: "tool", start: 1.7, end: 2.9 },
            {
              id: "sub",
              name: "billing-subagent",
              kind: "agent",
              start: 3,
              end: 6.4,
              children: [
                { id: "sql", name: "sql.query", kind: "tool", start: 3.1, end: 4.2 },
                { id: "refund", name: "stripe.refund", kind: "tool", start: 4.3, end: 4.9, error: true },
                { id: "retry", name: "stripe.refund", kind: "tool", start: 5, end: 6.2 },
              ],
            },
            { id: "answer", name: "model.reply", kind: "llm", start: 6.5, end: 7.7, tokens: 920, cost: 0.006 },
          ],
        },
      ]}
    />
  );
}

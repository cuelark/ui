import type { TraceSpan } from "@/registry/cuelark/ui/trace-waterfall";
import type { Script } from "./script";

type SpanSpec = Omit<TraceSpan, "id" | "start" | "end" | "children"> & { beat: string; children?: SpanSpec[] };

/** The run's trace from its beats: one root agent span, a child per beat that has started, timed by the script. */
export function spans(s: Script, agent: string, specs: SpanSpec[]): TraceSpan[] {
  const build = (list: SpanSpec[]): TraceSpan[] =>
    list.filter((x) => s.at(x.beat)).map(({ beat, children, ...rest }) => ({ id: `${beat}-${rest.name}`, ...rest, ...s.span(beat), children: children && build(children) }));
  return [{ id: "run", name: agent, kind: "agent", start: 0, end: s.finished ? s.now : undefined, children: build(specs) }];
}

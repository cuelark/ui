import * as React from "react";
import { CopyIcon, ThumbsUpIcon } from "lucide-react";

import { Artifact } from "@/registry/cuelark/ui/artifact";
import { Branch } from "@/registry/cuelark/ui/branch";
import { CodeBlock } from "@/registry/cuelark/ui/code-block";
import { Confirmation } from "@/registry/cuelark/ui/confirmation";
import { ContextMeter } from "@/registry/cuelark/ui/context-meter";
import { Message, MessageAction, MessageActions, MessageContent } from "@/registry/cuelark/ui/message";
import { ModelSelector } from "@/registry/cuelark/ui/model-selector";
import { PromptInput } from "@/registry/cuelark/ui/prompt-input";
import { Reasoning } from "@/registry/cuelark/ui/reasoning";
import { StackTrace } from "@/registry/cuelark/ui/stack-trace";
import { StreamingText } from "@/registry/cuelark/ui/streaming-text";
import { Suggestion, Suggestions } from "@/registry/cuelark/ui/suggestions";
import { TextShimmer } from "@/registry/cuelark/ui/text-shimmer";
import { Tool } from "@/registry/cuelark/ui/tool";
import { TraceWaterfall } from "@/registry/cuelark/ui/trace-waterfall";
import { cn } from "@/lib/utils";
import { Part } from "../inspect";
import { count, useScript, type Beat } from "../script";
import { spans } from "../trace";
import { AgentWindow, PanelSection, PanelWaiting } from "../window";
import { AgentAvatar, MODELS } from "./shared";

const QUESTION = "Revenue dipped in week 14. Find out why and chart it.";
const THOUGHTS = ["Compare week 14 with the four weeks before it, split by region.", "If one region explains most of the drop, chart that and check what changed there."];
const SQL_BAD = "select week, region, sum(amount) as revenue\nfrom revenue_daily\nwhere week between 10 and 15\ngroup by 1, 2;";
const SQL = "select week, region_code, sum(amount) as revenue\nfrom revenue_daily\nwhere week between 10 and 15\ngroup by 1, 2\norder by 1, 2;";
const ERROR = [
  'error: column "region" does not exist',
  "    at Parser.parseErrorMessage (node_modules/pg-protocol/dist/parser.js:287:98)",
  "    at Parser.handlePacket (node_modules/pg-protocol/dist/parser.js:126:29)",
  "    at runQuery (src/tools/sql.ts:41:11)",
  "    at async Agent.step (src/agent/loop.ts:118:20)",
].join("\n");
const ANSWER =
  "Week 14 revenue was $109k, 16% below the $130k average of the four weeks before it. Almost all of the drop is in the EU (−$19k): card payments there failed more often for three days after a checkout change, then recovered in week 15. Other regions were flat.";
const DETAILED = [
  "Week 14: $109k total, against a $130k average for weeks 10–13 (−$21k).",
  "EU: $31k, down from a $50k average (−$19k). Failed card payments tripled on Apr 2–4.",
  "US and APAC: within 2% of their averages.",
  "Week 15 is back at $129k, so this looks like a one-off, not a trend.",
];
const WEEKS = [
  { week: 10, eu: 49, rest: 79 },
  { week: 11, eu: 51, rest: 80 },
  { week: 12, eu: 50, rest: 77 },
  { week: 13, eu: 52, rest: 82 },
  { week: 14, eu: 31, rest: 78 },
  { week: 15, eu: 48, rest: 81 },
];

const BEATS: Beat[] = [
  { id: "think", ms: 1600 },
  { id: "query1", ms: 1300 },
  { id: "error", ms: 1300 },
  { id: "query2", ms: 1600 },
  { id: "chart", ms: 1200 },
  { id: "confirm", gate: true },
  { id: "answer", ms: 2800 },
];

/** Weekly revenue as stacked bars (EU on top), week 14 called out. */
function RevenueChart() {
  const max = 140;
  return (
    <figure className="grid gap-3 p-4">
      <div className="flex h-40 items-end gap-2" role="img" aria-label="Weekly revenue, weeks 10 to 15: week 14 is $109k, the others $127k to $134k; the drop is in the EU.">
        {WEEKS.map((w) => (
          <div key={w.week} className="grid flex-1 justify-items-center gap-1.5">
            <span className={cn("font-mono text-[0.625rem] tabular-nums", w.week === 14 ? "text-foreground" : "text-muted-foreground")}>${w.eu + w.rest}k</span>
            <div className="flex w-full max-w-9 flex-col overflow-hidden rounded-md" style={{ height: `${((w.eu + w.rest) / max) * 8}rem` }}>
              <span className={cn("block", w.week === 14 ? "bg-destructive/80" : "bg-signal/80")} style={{ flexGrow: w.eu }} />
              <span className="block bg-foreground/15" style={{ flexGrow: w.rest }} />
            </div>
            <span className="font-mono text-[0.625rem] text-muted-foreground">W{w.week}</span>
          </div>
        ))}
      </div>
      <figcaption className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-signal/80" /> EU
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-foreground/15" /> US + APAC
        </span>
      </figcaption>
    </figure>
  );
}

export function DataScenario() {
  const s = useScript(BEATS);
  const think = s.span("think");

  const thread = (
    <>
      <Part slug="message">
        <Message from="user">
          <MessageContent>{QUESTION}</MessageContent>
        </Message>
      </Part>
      <Message from="assistant">
        <AgentAvatar />
        <MessageContent className="gap-4">
          <Part slug="reasoning">
            <Reasoning streaming={s.during("think")} duration={think.end === undefined ? undefined : Math.max(1, Math.round(think.end - think.start))}>
              {THOUGHTS.slice(0, count(s, "think", THOUGHTS.length)).map((t) => (
                <p key={t}>{t}</p>
              ))}
            </Reasoning>
          </Part>
          {s.at("query1") && <Tool name="sql.query" status={s.has("query1") ? "error" : "running"} duration={0.4} input={SQL_BAD} output={s.has("query1") ? 'column "region" does not exist' : undefined} />}
          {s.at("error") && (
            <div className="grid gap-2">
              <Part slug="stack-trace">
                <StackTrace trace={ERROR} />
              </Part>
              <p className="text-sm text-muted-foreground">{s.during("error") ? <TextShimmer>Checking the table schema…</TextShimmer> : "The column is called region_code. Retrying."}</p>
            </div>
          )}
          {s.at("query2") && (
            <Part slug="tool">
              <Tool name="sql.query" status={s.has("query2") ? "success" : "running"} duration={0.9} input={{ table: "revenue_daily", weeks: "10–15" }} output={s.has("query2") ? { rows: 18 } : undefined} />
            </Part>
          )}
          {s.has("query2") && (
            <Part slug="code-block">
              <CodeBlock code={SQL} language="sql" filename="revenue_by_region.sql" highlight={[1]} />
            </Part>
          )}
          {s.at("confirm") && (
            <Part slug="confirmation">
              <Confirmation
                title="Add this chart to the Finance dashboard"
                description="It will be visible to the 14 people in Finance."
                command="dashboards.add_tile(board='finance', chart='revenue-w14-by-region')"
                defaultDecision={s.has("confirm") ? "approved" : undefined}
                onApprove={s.next}
                onDeny={s.next}
              />
            </Part>
          )}
          {s.at("answer") &&
            (s.finished ? (
              <Part slug="branch">
                <Branch
                  versions={[
                    <p key="short" className="text-sm leading-relaxed">
                      {ANSWER}
                    </p>,
                    <ul key="detailed" className="grid list-disc gap-1 ps-5 text-sm leading-relaxed">
                      {DETAILED.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>,
                  ]}
                />
              </Part>
            ) : (
              <Part slug="streaming-text">
                <StreamingText text={ANSWER.slice(0, Math.round(s.frac("answer") * ANSWER.length))} streaming />
              </Part>
            ))}
          {s.finished && (
            <MessageActions>
              <MessageAction label="Copy">
                <CopyIcon />
              </MessageAction>
              <MessageAction label="Good response">
                <ThumbsUpIcon />
              </MessageAction>
            </MessageActions>
          )}
        </MessageContent>
      </Message>
      {s.finished && (
        <Part slug="suggestions" className="ps-10">
          <Suggestions>
            {["Break the EU down by country", "Alert me if this happens again", "Compare with last year"].map((t) => (
              <Suggestion key={t}>{t}</Suggestion>
            ))}
          </Suggestions>
        </Part>
      )}
    </>
  );

  const trace = spans(s, "data-agent", [
    { beat: "think", name: "model.plan", kind: "llm", tokens: 640, cost: 0.008 },
    { beat: "query1", name: "sql.query", kind: "tool", error: true },
    { beat: "error", name: "sql.describe", kind: "tool" },
    { beat: "query2", name: "sql.query", kind: "tool" },
    { beat: "chart", name: "chart.render", kind: "tool" },
    { beat: "confirm", name: "await_approval", kind: "tool" },
    { beat: "answer", name: "model.reply", kind: "llm", tokens: 520, cost: 0.007 },
  ]);

  const panel = (
    <>
      <PanelSection title="Artifact">
        {s.has("chart") ? (
          <Part slug="artifact">
            <Artifact kind="Chart" title="Revenue by week · EU vs rest">
              <RevenueChart />
            </Artifact>
          </Part>
        ) : (
          <PanelWaiting>{s.at("chart") ? <TextShimmer>Rendering the chart…</TextShimmer> : "The chart appears here once the numbers are in."}</PanelWaiting>
        )}
      </PanelSection>
      <PanelSection
        title="Run"
        aside={
          <Part slug="context-meter">
            <ContextMeter used={Math.min(200000, 9000 + Math.round(s.now * 2600))} max={200000} breakdown={{ input: 7000 + Math.round(s.now * 2000), output: Math.round(s.now * 600) }} cost={0.021} />
          </Part>
        }
      >
        <Part slug="trace-waterfall">
          <TraceWaterfall spans={trace} now={s.playing ? s.now : undefined} className="text-xs" />
        </Part>
      </PanelSection>
    </>
  );

  return (
    <AgentWindow
      name="data-agent"
      context="warehouse · finance"
      script={s}
      thread={thread}
      panel={panel}
      composer={
        <Part slug="prompt-input">
          <PromptInput
            status={s.playing && !s.during("confirm") ? "streaming" : "idle"}
            onStop={s.stop}
            onSubmit={s.play}
            placeholder="Ask about your data…"
            toolbar={
              <Part slug="model-selector">
                <ModelSelector models={MODELS} />
              </Part>
            }
          />
        </Part>
      }
    />
  );
}

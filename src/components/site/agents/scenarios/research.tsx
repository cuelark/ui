import * as React from "react";
import { CopyIcon, ThumbsUpIcon } from "lucide-react";

import { Artifact } from "@/registry/cuelark/ui/artifact";
import { ContextMeter } from "@/registry/cuelark/ui/context-meter";
import { InlineCitation } from "@/registry/cuelark/ui/inline-citation";
import { Message, MessageAction, MessageActions, MessageContent } from "@/registry/cuelark/ui/message";
import { ModelSelector } from "@/registry/cuelark/ui/model-selector";
import { PromptInput } from "@/registry/cuelark/ui/prompt-input";
import { Queue, type QueueItem } from "@/registry/cuelark/ui/queue";
import { Reasoning } from "@/registry/cuelark/ui/reasoning";
import { Sources } from "@/registry/cuelark/ui/sources";
import { StreamingText } from "@/registry/cuelark/ui/streaming-text";
import { Subagent } from "@/registry/cuelark/ui/subagent";
import { Task, type TaskItem } from "@/registry/cuelark/ui/task";
import { Tool } from "@/registry/cuelark/ui/tool";
import { TraceWaterfall } from "@/registry/cuelark/ui/trace-waterfall";
import { Part } from "../inspect";
import { count, useScript, type Beat, type Script } from "../script";
import { spans } from "../trace";
import { AgentWindow, PanelSection, PanelWaiting } from "../window";
import { AgentAvatar, MODELS } from "./shared";

const QUESTION = "What's slowing new customers down during onboarding? Read last month's tickets and survey answers and write a brief for the team.";
const THOUGHTS = [
  "Two places to look: support tickets tagged onboarding, and the free-text answers in the March NPS survey.",
  "I'll hand each to its own reader so they run in parallel, then group what they find into themes.",
];
const ANSWER =
  "Three things slow new customers down: setting up SSO (17 of 42 tickets), importing data from CSV (11) and finding where to invite teammates (9). The survey says the same, and SSO is the most common reason behind a score of 6 or lower. The brief beside this chat has the quotes, the counts and a suggested fix for each.";
const SOURCES = [
  { title: "Support tickets · onboarding · last 30 days", url: "https://support.example.com/tickets?tag=onboarding" },
  { title: "March NPS survey · 318 comments", url: "https://surveys.example.com/nps/march" },
  { title: "Onboarding call notes · Customer Success", url: "https://notes.example.com/cs/onboarding" },
  { title: "SSO setup guide", url: "https://docs.example.com/sso" },
];
const THEMES = [
  { title: "SSO setup", count: "17 tickets · 41% of low scores", quote: "We spent two days going back and forth with IT to get SAML working.", fix: "A guided SSO checklist with a test-login button before it goes live." },
  { title: "CSV import", count: "11 tickets · 22% of low scores", quote: "The importer rejected our file but didn't say which column was wrong.", fix: "Show the failing row and column, and let people fix it in place." },
  { title: "Inviting teammates", count: "9 tickets · 12% of low scores", quote: "It took me a while to find where to add my team.", fix: "Put Invite in the empty state of the first project." },
];
const TICKET_ACTIVITY = ["Fetching tickets tagged onboarding…", "Reading ticket #4821…", "Reading ticket #4907…", "Tagging themes…"];
const SURVEY_ACTIVITY = ["Loading the March survey…", "Reading comments with a score of 6 or lower…", "Matching comments to themes…"];

const BEATS: Beat[] = [
  { id: "think", ms: 1800 },
  { id: "delegate", ms: 4600 },
  { id: "sources", ms: 900 },
  { id: "answer", ms: 3200 },
];

const taskItems = (s: Script): TaskItem[] => [
  { label: "Find onboarding tickets from the last 30 days", status: s.has("delegate") || s.frac("delegate") > 0.75 ? "done" : s.at("delegate") ? "active" : "todo" },
  { label: "Read the March NPS comments", status: s.has("delegate") ? "done" : s.at("delegate") ? "active" : "todo" },
  { label: "Group the complaints into themes", status: s.has("sources") ? "done" : s.at("sources") ? "active" : "todo" },
  { label: "Write the brief", status: s.finished ? "done" : s.at("answer") ? "active" : "todo" },
];

const activity = (lines: string[], f: number) => lines[Math.min(lines.length - 1, Math.floor(f * lines.length))]!;

export function ResearchScenario() {
  const s = useScript(BEATS);
  const think = s.span("think");
  const [queue, setQueue] = React.useState<QueueItem[]>([{ id: "churn", text: "Also check what churned accounts said" }]);
  const ticketsDone = s.has("delegate") || s.frac("delegate") > 0.75;
  const surveyDone = s.has("delegate");
  const themes = count(s, "answer", THEMES.length);

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
          {s.at("delegate") && (
            <Part slug="task">
              <Task title="Research plan" items={taskItems(s)} />
            </Part>
          )}
          {s.at("delegate") && (
            <div className="grid gap-2">
              <Part slug="subagent">
                <Subagent name="ticket-reader" task="Read the 42 onboarding tickets and tag each complaint" status={ticketsDone ? "done" : "running"} activity={activity(TICKET_ACTIVITY, s.frac("delegate") / 0.75)} duration={ticketsDone ? 12 : undefined}>
                  <Part slug="tool">
                    <Tool name="search_tickets" status={s.frac("delegate") > 0.2 || ticketsDone ? "success" : "running"} duration={0.6} input={{ tag: "onboarding", since: "30d" }} output={{ count: 42 }} />
                  </Part>
                </Subagent>
              </Part>
              <Subagent name="survey-reader" task="Read 318 NPS comments and find the reasons behind low scores" status={surveyDone ? "done" : "running"} activity={activity(SURVEY_ACTIVITY, s.frac("delegate"))} duration={surveyDone ? 16 : undefined}>
                <Tool name="read_survey" status={s.frac("delegate") > 0.3 || surveyDone ? "success" : "running"} duration={0.9} input={{ survey: "nps-march", maxScore: 6 }} output={{ comments: 96 }} />
              </Subagent>
            </div>
          )}
          {s.at("answer") && (
            <div className="grid gap-3">
              <Part slug="streaming-text">
                <StreamingText text={ANSWER.slice(0, Math.round(s.frac("answer") * ANSWER.length))} streaming={s.during("answer")} />
              </Part>
              {s.finished && (
                <>
                  <Part slug="inline-citation">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      SSO setup tops both lists
                      <InlineCitation index={1} source={{ ...SOURCES[0]!, excerpt: "17 of 42 tickets mention SSO, SAML or IdP setup." }} />
                      <InlineCitation index={2} source={{ ...SOURCES[1]!, excerpt: "“We spent two days going back and forth with IT to get SAML working.”" }} />, and the setup guide skips the test-login step
                      <InlineCitation index={4} source={{ ...SOURCES[3]!, excerpt: "Step 4: enable SSO for your workspace." }} />.
                    </p>
                  </Part>
                  <MessageActions>
                    <MessageAction label="Copy">
                      <CopyIcon />
                    </MessageAction>
                    <MessageAction label="Good response">
                      <ThumbsUpIcon />
                    </MessageAction>
                  </MessageActions>
                </>
              )}
            </div>
          )}
          {s.at("sources") && (
            <Part slug="sources">
              <Sources sources={SOURCES} />
            </Part>
          )}
        </MessageContent>
      </Message>
    </>
  );

  const trace = spans(s, "research-agent", [
    { beat: "think", name: "model.plan", kind: "llm", tokens: 920, cost: 0.012 },
    {
      beat: "delegate",
      name: "ticket-reader",
      kind: "agent",
      children: [
        { beat: "delegate", name: "search_tickets", kind: "tool" },
        { beat: "delegate", name: "model.tag", kind: "llm", tokens: 8400, cost: 0.041 },
      ],
    },
    {
      beat: "delegate",
      name: "survey-reader",
      kind: "agent",
      children: [
        { beat: "delegate", name: "read_survey", kind: "tool" },
        { beat: "delegate", name: "model.tag", kind: "llm", tokens: 11200, cost: 0.055 },
      ],
    },
    { beat: "sources", name: "model.group", kind: "llm", tokens: 2100, cost: 0.019 },
    { beat: "answer", name: "model.write", kind: "llm", tokens: 1650, cost: 0.024 },
  ]);

  const panel = (
    <>
      <PanelSection title="Artifact">
        {s.at("answer") ? (
          <Part slug="artifact">
            <Artifact kind="Document" title="Onboarding brief · March">
              <article className="grid gap-4 p-4 text-sm leading-relaxed">
                <p className="text-muted-foreground">42 support tickets and 318 survey comments from the last 30 days. Three themes explain most of the friction.</p>
                {THEMES.slice(0, themes).map((t, i) => (
                  <section key={t.title} className="grid gap-1.5">
                    <h4 className="font-medium">
                      {i + 1}. {t.title} <span className="font-mono text-xs font-normal text-muted-foreground">{t.count}</span>
                    </h4>
                    <blockquote className="border-s-2 border-border ps-3 text-muted-foreground italic">{t.quote}</blockquote>
                    <p>
                      <span className="cue-label me-1.5">Fix</span>
                      {t.fix}
                    </p>
                  </section>
                ))}
              </article>
            </Artifact>
          </Part>
        ) : (
          <PanelWaiting>The brief is written here once the readers finish.</PanelWaiting>
        )}
      </PanelSection>
      <PanelSection
        title="Run"
        aside={
          <Part slug="context-meter">
            <ContextMeter used={Math.min(200000, 12000 + Math.round(s.now * 5200))} max={200000} breakdown={{ input: 9000 + Math.round(s.now * 4400), output: Math.round(s.now * 800) }} cost={0.151} />
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
      name="research-agent"
      context="northwind · support + surveys"
      script={s}
      thread={thread}
      panel={panel}
      composer={
        <div className="grid gap-2">
          {(s.frac("delegate") > 0.4 || s.has("delegate")) && queue.length > 0 && (
            <Part slug="queue">
              <Queue items={queue} onItemsChange={setQueue} label="Up next" />
            </Part>
          )}
          <Part slug="prompt-input">
            <PromptInput
              status={s.playing ? "streaming" : "idle"}
              onStop={s.stop}
              onSubmit={({ text }) => text && setQueue((q) => [...q, { id: `${Date.now()}`, text }])}
              placeholder={s.playing ? "Queue a follow-up…" : "Ask a follow-up…"}
              toolbar={<ModelSelector models={MODELS} />}
            />
          </Part>
        </div>
      }
    />
  );
}

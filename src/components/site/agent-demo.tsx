import * as React from "react";
import { BookOpenIcon, CopyIcon, FileSearchIcon, GlobeIcon, RefreshCwIcon, RotateCcwIcon, ThumbsUpIcon } from "lucide-react";
import { PiSparkleFill as SparklesIcon } from "react-icons/pi";

import { Button } from "@/registry/cuelark/ui/button";
import { ChainOfThought, ChainOfThoughtStep } from "@/registry/cuelark/ui/chain-of-thought";
import { ContextMeter } from "@/registry/cuelark/ui/context-meter";
import { Conversation, ConversationContent } from "@/registry/cuelark/ui/conversation";
import { FileDiff } from "@/registry/cuelark/ui/file-diff";
import { InlineCitation } from "@/registry/cuelark/ui/inline-citation";
import { Message, MessageAction, MessageActions, MessageAvatar, MessageContent } from "@/registry/cuelark/ui/message";
import { ModelSelector } from "@/registry/cuelark/ui/model-selector";
import { Plan } from "@/registry/cuelark/ui/plan";
import { PromptInput } from "@/registry/cuelark/ui/prompt-input";
import { Reasoning } from "@/registry/cuelark/ui/reasoning";
import { Sources } from "@/registry/cuelark/ui/sources";
import { StreamingText } from "@/registry/cuelark/ui/streaming-text";
import { Suggestion, Suggestions } from "@/registry/cuelark/ui/suggestions";
import { Terminal } from "@/registry/cuelark/ui/terminal";
import { Tool } from "@/registry/cuelark/ui/tool";
import { TraceWaterfall, type TraceSpan } from "@/registry/cuelark/ui/trace-waterfall";

const MODELS = [
  { id: "opus", name: "Claude Opus", provider: "Anthropic", context: "200k", tags: ["reasoning"] },
  { id: "gpt5", name: "GPT-5", provider: "OpenAI", context: "400k", tags: ["reasoning"] },
  { id: "gemini", name: "Gemini Pro", provider: "Google", context: "1M" },
];
const QUESTION = "Invoices are charging tax to customers without a tax ID. Fix it and tell me what changed.";
const THOUGHTS = [
  "Tax is applied in two places: the invoice API and the PDF renderer.",
  "The rule should live in one helper so the two can't drift again.",
  "I'll propose the diff, then run the billing tests before answering.",
];
const ANSWER =
  "Fixed. Tax is now computed in one helper, tax(), which returns 0 when the customer has no tax ID and rounds to the cent otherwise. The invoice API and the PDF renderer both call it, so totals match everywhere. All 22 billing tests pass, including two new ones for invoices with and without a tax ID.";
const TESTS = ["$ pnpm test billing", " ✓ tax.test.ts (8 tests) 39ms", " ✓ invoice.test.ts (12 tests) 81ms", " ✓ pdf.test.ts (2 tests) 140ms", "done in 1.4s · 22 passed"];

/** Phases of the scripted run; each advances on a timer except the plan, which waits for approval. */
type Phase = "idle" | "thinking" | "acting" | "diff" | "plan" | "testing" | "answering" | "done";
const ORDER: Phase[] = ["idle", "thinking", "acting", "diff", "plan", "testing", "answering", "done"];
const at = (phase: Phase, p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

export function AgentDemo() {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [thoughts, setThoughts] = React.useState(0);
  const [steps, setSteps] = React.useState(0);
  const [lines, setLines] = React.useState(0);
  const [chars, setChars] = React.useState(0);
  const [t0, setT0] = React.useState(0);
  const [now, setNow] = React.useState(0);

  const start = () => {
    setPhase("thinking");
    setThoughts(0);
    setSteps(0);
    setLines(0);
    setChars(0);
    setT0(performance.now());
  };

  // Drive the script.
  React.useEffect(() => {
    let id: ReturnType<typeof setTimeout> | undefined;
    if (phase === "thinking") id = thoughts < THOUGHTS.length ? setTimeout(() => setThoughts((n) => n + 1), 800) : setTimeout(() => setPhase("acting"), 500);
    if (phase === "acting") id = steps < 3 ? setTimeout(() => setSteps((n) => n + 1), 900) : setTimeout(() => setPhase("diff"), 400);
    if (phase === "diff") id = setTimeout(() => setPhase("plan"), 1200);
    if (phase === "testing") id = lines < TESTS.length ? setTimeout(() => setLines((n) => n + 1), 380) : setTimeout(() => setPhase("answering"), 500);
    if (phase === "answering") id = chars < ANSWER.length ? setTimeout(() => setChars((n) => n + 5), 28) : setTimeout(() => setPhase("done"), 200);
    return () => clearTimeout(id);
  }, [phase, thoughts, steps, lines, chars]);

  // Clock for the trace.
  React.useEffect(() => {
    if (phase === "idle" || phase === "done") return;
    let raf = 0;
    const loop = () => {
      setNow((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, t0]);

  const marks = React.useRef<Partial<Record<Phase, number>>>({});
  React.useEffect(() => {
    if (phase === "idle") marks.current = {};
    else marks.current[phase] ??= (performance.now() - t0) / 1000;
  }, [phase, t0]);
  const m = marks.current;
  const end = (p: Phase) => (at(phase, ORDER[ORDER.indexOf(p) + 1]!) ? m[ORDER[ORDER.indexOf(p) + 1]!] : undefined);
  const spans: TraceSpan[] =
    phase === "idle"
      ? []
      : [
          {
            id: "run",
            name: "billing-agent",
            kind: "agent",
            start: 0,
            end: phase === "done" ? m.done : undefined,
            children: [
              { id: "think", name: "model.reason", kind: "llm", start: 0, end: end("thinking"), tokens: 1240, cost: 0.018 },
              ...(at(phase, "acting") ? [{ id: "search", name: "search_code", kind: "tool" as const, start: m.acting ?? 0, end: end("acting") }] : []),
              ...(at(phase, "diff") ? [{ id: "edit", name: "propose_edit", kind: "llm" as const, start: m.diff ?? 0, end: end("diff"), tokens: 860, cost: 0.011 }] : []),
              ...(at(phase, "plan") ? [{ id: "wait", name: "await_approval", kind: "tool" as const, start: m.plan ?? 0, end: end("plan") }] : []),
              ...(at(phase, "testing") ? [{ id: "test", name: "shell.run_tests", kind: "tool" as const, start: m.testing ?? 0, end: end("testing") }] : []),
              ...(at(phase, "answering") ? [{ id: "reply", name: "model.reply", kind: "llm" as const, start: m.answering ?? 0, end: end("answering"), tokens: 410, cost: 0.006 }] : []),
            ],
          },
        ];

  const sources = [
    { title: "billing/tax.ts · repository", url: "https://example.com/repo/billing/tax.ts" },
    { title: "VAT rules for B2B invoices", url: "https://europa.eu/youreurope/business/taxation/vat" },
    { title: "Rounding money in JavaScript", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/round" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
      <div className="flex h-[40rem] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-raised">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className="size-2 rounded-full bg-signal" />
          <span className="text-sm font-medium">billing-agent</span>
          <span className="font-mono text-xs text-muted-foreground">acme/billing</span>
          <Button variant="ghost" size="xs" className="ms-auto" onClick={start}>
            <RotateCcwIcon /> {phase === "idle" ? "Run demo" : "Replay"}
          </Button>
        </div>
        <Conversation className="flex-1">
          <ConversationContent className="gap-5 p-5">
            {phase === "idle" ? (
              <div className="grid h-[28rem] place-items-center text-center">
                <div className="grid justify-items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-foreground text-background">
                    <SparklesIcon className="size-5" />
                  </span>
                  <p className="max-w-xs text-sm text-muted-foreground">A scripted agent run, built only from Cuelark agent components. Send the prompt to start.</p>
                  <Suggestions className="justify-center">
                    <Suggestion onClick={start}>Fix the invoice tax bug</Suggestion>
                  </Suggestions>
                </div>
              </div>
            ) : (
              <>
                <Message from="user">
                  <MessageContent>{QUESTION}</MessageContent>
                </Message>
                <Message from="assistant">
                  <MessageAvatar className="bg-foreground text-background">
                    <SparklesIcon />
                  </MessageAvatar>
                  <MessageContent className="gap-4">
                    <Reasoning streaming={phase === "thinking"}>
                      {THOUGHTS.slice(0, thoughts).map((t) => (
                        <p key={t}>{t}</p>
                      ))}
                    </Reasoning>
                    {at(phase, "acting") && (
                      <ChainOfThought title="Working">
                        <ChainOfThoughtStep status={steps > 0 ? "complete" : "active"} label="Searched the code for tax calculations" icon={<FileSearchIcon />} />
                        {steps > 0 && <ChainOfThoughtStep status={steps > 1 ? "complete" : "active"} label="Read billing/tax.ts and pdf/render.ts" icon={<BookOpenIcon />} />}
                        {steps > 1 && <ChainOfThoughtStep status={steps > 2 ? "complete" : "active"} label="Checked VAT rules for B2B invoices" icon={<GlobeIcon />} />}
                      </ChainOfThought>
                    )}
                    {at(phase, "acting") && <Tool name="search_code" status={steps > 0 ? "success" : "running"} duration={0.8} input={{ query: "subtotal * rate" }} output={{ matches: ["billing/tax.ts:3", "pdf/render.ts:57"] }} />}
                    {at(phase, "diff") && (
                      <FileDiff
                        filename="billing/tax.ts"
                        lines={[
                          { type: "remove", content: "export const tax = (i) => i.subtotal * i.rate" },
                          { type: "add", content: "export function tax(i: Invoice) {" },
                          { type: "add", content: "  if (!i.customer.taxId) return 0" },
                          { type: "add", content: "  return Math.round(i.subtotal * i.rate * 100) / 100" },
                          { type: "add", content: "}" },
                        ]}
                      />
                    )}
                    {at(phase, "plan") && (
                      <Plan
                        title="Plan · apply and verify"
                        steps={[{ label: "Apply the change to billing/tax.ts", done: true }, { label: "Use tax() in pdf/render.ts" }, { label: "Add tests for both cases" }, { label: "Run the billing suite" }]}
                        autoRun={6}
                        onApprove={() => setPhase("testing")}
                        onReject={() => setPhase("done")}
                      />
                    )}
                    {at(phase, "testing") && <Terminal title="shell · billing" lines={TESTS.slice(0, lines)} streaming={phase === "testing"} />}
                    {at(phase, "answering") && (
                      <div className="grid gap-3">
                        <StreamingText text={ANSWER.slice(0, chars)} streaming={phase === "answering"} />
                        {phase === "done" && (
                          <>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              Customers without a tax ID are now charged no tax
                              <InlineCitation index={1} source={{ ...sources[0]!, excerpt: "if (!i.customer.taxId) return 0" }} />, which matches the reverse-charge rule for B2B invoices
                              <InlineCitation index={2} source={{ ...sources[1]!, excerpt: "The customer accounts for VAT under the reverse-charge mechanism." }} />.
                            </p>
                            <Sources sources={sources} />
                            <MessageActions>
                              <MessageAction label="Copy"><CopyIcon /></MessageAction>
                              <MessageAction label="Regenerate" onClick={start}><RefreshCwIcon /></MessageAction>
                              <MessageAction label="Good response"><ThumbsUpIcon /></MessageAction>
                            </MessageActions>
                          </>
                        )}
                      </div>
                    )}
                  </MessageContent>
                </Message>
                {phase === "done" && (
                  <Suggestions className="ps-10">
                    {["Open a pull request", "Explain the VAT rule", "Backfill old invoices"].map((s) => (
                      <Suggestion key={s}>{s}</Suggestion>
                    ))}
                  </Suggestions>
                )}
              </>
            )}
          </ConversationContent>
        </Conversation>
        <div className="border-t border-border p-3">
          <PromptInput
            status={phase !== "idle" && phase !== "done" && phase !== "plan" ? "streaming" : "idle"}
            onStop={() => setPhase("done")}
            onSubmit={start}
            placeholder={phase === "idle" ? QUESTION : "Ask a follow-up…"}
            toolbar={<ModelSelector models={MODELS} />}
          />
        </div>
      </div>
      <aside className="grid content-start gap-4">
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="cue-label">Run</span>
            <ContextMeter used={phase === "idle" ? 0 : Math.min(200000, 18000 + Math.round(now * 4200))} max={200000} breakdown={{ input: 14000 + Math.round(now * 3000), output: Math.round(now * 1200) }} cost={0.035} />
          </div>
          {spans.length ? <TraceWaterfall spans={spans} now={phase === "done" ? undefined : now} className="text-xs" /> : <p className="text-sm text-muted-foreground">The trace appears here as the agent works.</p>}
        </div>
        <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          <span className="cue-label mb-2 block">In this demo</span>
          Prompt Input · Model Selector · Conversation · Message · Reasoning · Chain of Thought · Tool · File Diff · Plan · Terminal · Streaming Text · Inline Citation · Sources · Suggestions · Context Meter · Trace Waterfall
        </div>
      </aside>
    </div>
  );
}

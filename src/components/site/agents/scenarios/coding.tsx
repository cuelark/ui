import * as React from "react";
import { BookOpenIcon, CopyIcon, FileSearchIcon, GlobeIcon, RefreshCwIcon, ThumbsUpIcon } from "lucide-react";

import { ChainOfThought, ChainOfThoughtStep } from "@/registry/cuelark/ui/chain-of-thought";
import { Checkpoint } from "@/registry/cuelark/ui/checkpoint";
import { ContextMeter } from "@/registry/cuelark/ui/context-meter";
import { FileDiff } from "@/registry/cuelark/ui/file-diff";
import { FileTree } from "@/registry/cuelark/ui/file-tree";
import { InlineCitation } from "@/registry/cuelark/ui/inline-citation";
import { Message, MessageAction, MessageActions, MessageContent } from "@/registry/cuelark/ui/message";
import { ModelSelector } from "@/registry/cuelark/ui/model-selector";
import { Plan } from "@/registry/cuelark/ui/plan";
import { PromptInput } from "@/registry/cuelark/ui/prompt-input";
import { Reasoning } from "@/registry/cuelark/ui/reasoning";
import { Sources } from "@/registry/cuelark/ui/sources";
import { StreamingText } from "@/registry/cuelark/ui/streaming-text";
import { Suggestion, Suggestions } from "@/registry/cuelark/ui/suggestions";
import { Terminal } from "@/registry/cuelark/ui/terminal";
import { TestResults } from "@/registry/cuelark/ui/test-results";
import { Tool } from "@/registry/cuelark/ui/tool";
import { TraceWaterfall } from "@/registry/cuelark/ui/trace-waterfall";
import { Part } from "../inspect";
import { count, useScript, type Beat } from "../script";
import { spans } from "../trace";
import { AgentWindow, PanelSection, PanelWaiting } from "../window";
import { AgentAvatar, MODELS } from "./shared";

const QUESTION = "Invoices are charging tax to customers without a tax ID. Fix it and tell me what changed.";
const THOUGHTS = [
  "Tax is applied in two places: the invoice API and the PDF renderer.",
  "The rule should live in one helper so the two can't drift again.",
  "I'll propose the diff, then run the billing tests before answering.",
];
const STEPS = [
  { done: "Searched the code for tax calculations", active: "Searching the code for tax calculations", icon: <FileSearchIcon /> },
  { done: "Read billing/tax.ts and pdf/render.ts", active: "Reading billing/tax.ts and pdf/render.ts", icon: <BookOpenIcon /> },
  { done: "Checked VAT rules for B2B invoices", active: "Checking VAT rules for B2B invoices", icon: <GlobeIcon /> },
];
const TESTS = ["$ pnpm test billing", " ✓ tax.test.ts (8 tests) 39ms", " ✓ invoice.test.ts (12 tests) 81ms", " ✓ pdf.test.ts (2 tests) 140ms", "done in 1.4s · 22 passed"];
const ANSWER =
  "Fixed. Tax is now computed in one helper, tax(), which returns 0 when the customer has no tax ID and rounds to the cent otherwise. The invoice API and the PDF renderer both call it, so totals match everywhere. All 22 billing tests pass, including two new ones for invoices with and without a tax ID.";
const SOURCES = [
  { title: "billing/tax.ts · repository", url: "https://example.com/repo/billing/tax.ts" },
  { title: "VAT rules for B2B invoices", url: "https://europa.eu/youreurope/business/taxation/vat" },
  { title: "Rounding money in JavaScript", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/round" },
];

const BEATS: Beat[] = [
  { id: "think", ms: 2400 },
  { id: "search", ms: 2700 },
  { id: "diff", ms: 1300 },
  { id: "plan", gate: true },
  { id: "tests", ms: 1900 },
  { id: "answer", ms: 2600 },
];

export function CodingScenario() {
  const s = useScript(BEATS);
  const doneSteps = s.has("search") ? STEPS.length : Math.max(0, count(s, "search", STEPS.length) - 1);
  const think = s.span("think");

  const thread = (
    <>
      <Part slug="checkpoint">
        <Checkpoint label="Before the tax fix" time="14:02" onRestore={s.play} />
      </Part>
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
          {s.at("search") && (
            <Part slug="chain-of-thought">
              <ChainOfThought title={s.has("search") ? "Found the cause" : "Working"}>
                {STEPS.map((step, i) => (
                  <ChainOfThoughtStep key={step.done} status={i < doneSteps ? "complete" : i === doneSteps ? "active" : "pending"} label={i < doneSteps ? step.done : step.active} icon={step.icon} />
                ))}
              </ChainOfThought>
            </Part>
          )}
          {s.at("search") && (
            <Part slug="tool">
              <Tool name="search_code" status={doneSteps > 0 ? "success" : "running"} duration={0.8} input={{ query: "subtotal * rate" }} output={{ matches: ["billing/tax.ts:3", "pdf/render.ts:57"] }} />
            </Part>
          )}
          {s.at("diff") && (
            <Part slug="file-diff">
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
            </Part>
          )}
          {s.at("plan") && (
            <Part slug="plan">
              <Plan
                title="Plan · apply and verify"
                steps={[{ label: "Apply the change to billing/tax.ts", done: true }, { label: "Use tax() in pdf/render.ts" }, { label: "Add tests for both cases" }, { label: "Run the billing suite" }]}
                autoRun={6}
                defaultState={s.has("plan") ? "approved" : "pending"}
                onApprove={s.next}
                onReject={s.stop}
              />
            </Part>
          )}
          {s.at("tests") && (
            <Part slug="terminal">
              <Terminal title="shell · billing" lines={TESTS.slice(0, count(s, "tests", TESTS.length))} streaming={s.during("tests")} />
            </Part>
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
                      Customers without a tax ID are now charged no tax
                      <InlineCitation index={1} source={{ ...SOURCES[0]!, excerpt: "if (!i.customer.taxId) return 0" }} />, which matches the reverse-charge rule for B2B invoices
                      <InlineCitation index={2} source={{ ...SOURCES[1]!, excerpt: "The customer accounts for VAT under the reverse-charge mechanism." }} />.
                    </p>
                  </Part>
                  <Part slug="sources">
                    <Sources sources={SOURCES} />
                  </Part>
                  <MessageActions>
                    <MessageAction label="Copy">
                      <CopyIcon />
                    </MessageAction>
                    <MessageAction label="Regenerate" onClick={s.play}>
                      <RefreshCwIcon />
                    </MessageAction>
                    <MessageAction label="Good response">
                      <ThumbsUpIcon />
                    </MessageAction>
                  </MessageActions>
                </>
              )}
            </div>
          )}
        </MessageContent>
      </Message>
      {s.finished && (
        <Part slug="suggestions" className="ps-10">
          <Suggestions>
            {["Open a pull request", "Explain the VAT rule", "Backfill old invoices"].map((t) => (
              <Suggestion key={t}>{t}</Suggestion>
            ))}
          </Suggestions>
        </Part>
      )}
    </>
  );

  const trace = spans(s, "billing-agent", [
    { beat: "think", name: "model.reason", kind: "llm", tokens: 1240, cost: 0.018 },
    { beat: "search", name: "search_code", kind: "tool" },
    { beat: "diff", name: "propose_edit", kind: "llm", tokens: 860, cost: 0.011 },
    { beat: "plan", name: "await_approval", kind: "tool" },
    { beat: "tests", name: "shell.run_tests", kind: "tool" },
    { beat: "answer", name: "model.reply", kind: "llm", tokens: 410, cost: 0.006 },
  ]);

  const panel = (
    <>
      <PanelSection
        title="Run"
        aside={
          <Part slug="context-meter">
            <ContextMeter used={Math.min(200000, 18000 + Math.round(s.now * 4200))} max={200000} breakdown={{ input: 14000 + Math.round(s.now * 3000), output: Math.round(s.now * 1200) }} cost={0.035} />
          </Part>
        }
      >
        <Part slug="trace-waterfall">
          <TraceWaterfall spans={trace} now={s.playing ? s.now : undefined} className="text-xs" />
        </Part>
      </PanelSection>
      <PanelSection title="Changed files">
        {s.at("diff") ? (
          <Part slug="file-tree">
            <FileTree
              tree={[
                { name: "billing", children: [{ name: "tax.ts", status: "modified" }, { name: "tax.test.ts", status: "added" }] },
                { name: "pdf", children: [{ name: "render.ts", status: "modified" }] },
              ]}
              defaultExpanded={["billing", "pdf"]}
              selected="billing/tax.ts"
            />
          </Part>
        ) : (
          <PanelWaiting>Files appear here as the agent edits them.</PanelWaiting>
        )}
      </PanelSection>
      <PanelSection title="Tests">
        {s.has("tests") ? (
          <Part slug="test-results">
            <TestResults
              suites={[
                { name: "tax.test.ts", tests: [{ name: "no tax without a tax ID", status: "pass", duration: 4 }, { name: "rounds to the cent", status: "pass", duration: 3 }] },
                { name: "invoice.test.ts", tests: [{ name: "totals match the PDF", status: "pass", duration: 12 }] },
                { name: "pdf.test.ts", tests: [{ name: "renders reverse-charge note", status: "pass", duration: 70 }] },
              ]}
            />
          </Part>
        ) : (
          <PanelWaiting>Results land here after the run.</PanelWaiting>
        )}
      </PanelSection>
    </>
  );

  return (
    <AgentWindow
      name="billing-agent"
      context="acme/billing"
      script={s}
      thread={thread}
      panel={panel}
      composer={
        <Part slug="prompt-input">
          <PromptInput
            status={s.playing && !s.during("plan") ? "streaming" : "idle"}
            onStop={s.stop}
            onSubmit={s.play}
            placeholder="Ask a follow-up…"
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

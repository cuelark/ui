import { CopyIcon, GlobeIcon, RefreshCwIcon, ThumbsUpIcon } from "lucide-react";
import { PiSparkleFill as SparklesIcon } from "react-icons/pi";

import { ChainOfThought, ChainOfThoughtStep } from "@/registry/cuelark/ui/chain-of-thought";
import { ContextMeter } from "@/registry/cuelark/ui/context-meter";
import { InlineCitation } from "@/registry/cuelark/ui/inline-citation";
import { Message, MessageAction, MessageActions, MessageAvatar, MessageContent } from "@/registry/cuelark/ui/message";
import { ModelSelector } from "@/registry/cuelark/ui/model-selector";
import { PromptInput } from "@/registry/cuelark/ui/prompt-input";
import { Suggestion, Suggestions } from "@/registry/cuelark/ui/suggestions";
import { Tool } from "@/registry/cuelark/ui/tool";

const frame = "relative grid gap-5 rounded-2xl border border-border bg-background p-5 sm:p-6";

/** The agent kit under the current theme: a short exchange with steps, a tool call, citations and the composer. */
export function AgentPreview() {
  return (
    <div className={frame}>
      <Message from="user">
        <MessageContent>Which plan should a 12-person team pick?</MessageContent>
      </Message>
      <Message from="assistant">
        <MessageAvatar className="bg-foreground text-background">
          <SparklesIcon />
        </MessageAvatar>
        <MessageContent>
          <ChainOfThought title="Compared plans" defaultOpen={false}>
            <ChainOfThoughtStep label="Read the pricing page" />
            <ChainOfThoughtStep label="Checked seat limits" />
          </ChainOfThought>
          <Tool name="fetch_pricing" icon={<GlobeIcon />} duration={0.6} input={{ seats: 12 }} output={{ plan: "Team", monthly: 240 }} />
          <p>
            Team fits best: it covers up to 15 seats and adds SSO<InlineCitation index={1} source={{ title: "Pricing · Example", url: "https://example.com/pricing", excerpt: "Team: up to 15 seats, SSO included." }} />, at $240 a month.
          </p>
          <MessageActions className="opacity-100">
            <MessageAction label="Copy"><CopyIcon /></MessageAction>
            <MessageAction label="Regenerate"><RefreshCwIcon /></MessageAction>
            <MessageAction label="Good response"><ThumbsUpIcon /></MessageAction>
          </MessageActions>
        </MessageContent>
      </Message>
      <Suggestions>
        <Suggestion>Compare with Pro</Suggestion>
        <Suggestion>What about annual billing?</Suggestion>
      </Suggestions>
      <PromptInput
        attachments={false}
        placeholder="Ask a follow-up…"
        toolbar={
          <>
            <ModelSelector models={[{ id: "a", name: "Claude Opus", provider: "Anthropic", context: "200k" }, { id: "b", name: "GPT-5", provider: "OpenAI", context: "400k" }]} />
            <ContextMeter used={46000} max={200000} />
          </>
        }
      />
    </div>
  );
}

/** The type scale under the current font, size and letter spacing. */
export function TypePreview() {
  return (
    <div className={frame}>
      <span className="cue-label">Display · 48</span>
      <p className="text-5xl leading-none font-semibold tracking-tight">Interfaces that move</p>
      <span className="cue-label">Heading · 24</span>
      <p className="text-2xl font-semibold tracking-tight">Agents that think, act and ask</p>
      <span className="cue-label">Body · 16</span>
      <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
        A precise, monochrome core with tactile details and GSAP motion. Every token cascades, so a font, size or spacing change reaches each component at once.
      </p>
      <span className="cue-label">Small · 14 · Mono · 12</span>
      <p className="text-sm">The quick brown fox jumps over the lazy dog.</p>
      <p className="font-mono text-xs text-muted-foreground">npx shadcn@latest add https://ui.cuelark.com/r/button.json</p>
    </div>
  );
}

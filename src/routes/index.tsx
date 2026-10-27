import type { ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AccessibilityIcon, ArrowRightIcon, BoldIcon, CodeIcon, CrosshairIcon, ItalicIcon, PaletteIcon, UnderlineIcon } from "lucide-react";
import { PiSparkleFill as SparklesIcon } from "react-icons/pi";

import { examples } from "@/components/site/examples";
import { HeroApp } from "@/components/site/hero-app";
import { FluidBackdrop } from "@/components/site/fluid-backdrop";
import { HeroPrompt } from "@/components/site/hero-prompt";
import { MotionDial } from "@/components/site/motion-dial";
import { components, SECTIONS } from "@/content/components";
import { SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/cuelark/ui/accordion";
import { Button } from "@/registry/cuelark/ui/button";
import { Card } from "@/registry/cuelark/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/registry/cuelark/ui/input-otp";
import { AnimatedList } from "@/registry/cuelark/ui/animated-list";
import { BorderBeam } from "@/registry/cuelark/ui/border-beam";
import { Burst } from "@/registry/cuelark/ui/burst";
import { TiltCard } from "@/registry/cuelark/ui/tilt-card";
import { Typewriter } from "@/registry/cuelark/ui/typewriter";
import { Marquee } from "@/registry/cuelark/ui/marquee";
import { Rating } from "@/registry/cuelark/ui/rating";
import { Reveal } from "@/registry/cuelark/ui/reveal";
import { Spinner } from "@/registry/cuelark/ui/spinner";
import { TextReveal } from "@/registry/cuelark/ui/text-reveal";
import { ToggleGroup, ToggleGroupItem } from "@/registry/cuelark/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/cuelark/ui/tooltip";
import { cn } from "@/lib/utils";

const FAQ = [
  {
    q: "What is Cuelark UI?",
    a: `An open-source library of ${components.length} React components for shadcn/ui: a precise, monochrome core with tactile details and GSAP motion. You install the source with the shadcn CLI and own every line.`,
  },
  { q: "Is it free for commercial projects?", a: "Yes. Cuelark UI is MIT licensed. GSAP, which powers the animation, is free for commercial use under its standard license." },
  {
    q: "How is it different from shadcn/ui?",
    a: "Same registry, same conventions, same CLI, so it sits next to your shadcn components. On top you get a refined visual language, GSAP motion with one intensity knob, a full theme editor and components shadcn does not ship: Dock, Number Ticker, Text Reveal, Stepper, Rating, Marquee and more.",
  },
  { q: "Can I make it match my brand?", a: "Every color, radius, density and motion value is a CSS variable. The theme editor sets base gray, accent, radius, density, crop marks and motion, and gives you the CSS to paste." },
  { q: "Does the animation hurt accessibility or performance?", a: "Motion respects prefers-reduced-motion and the --cl-motion variable. Animations use transforms and opacity, run after hydration and never hide server-rendered content." },
  { q: "Are the animated text components SEO-friendly?", a: "Yes. Text Reveal, Scramble Text, Number Ticker and Rotating Text render their real text on the server, so search engines index it in full." },
];

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: SITE.title,
      description: SITE.description,
      path: "/",
      keywords: [
        "shadcn ui components",
        "ai agent ui components",
        "agentic ui",
        "ai chat ui react",
        "ai elements alternative",
        "react component library",
        "animated react components",
        "gsap react components",
        "tailwind css v4 components",
        "shadcn registry",
        "radix ui components",
        "copy paste react components",
      ],
      jsonLd: [ld.organization(), ld.website(), ld.faq(FAQ)],
    }),
  component: Home,
});


function Home() {
  return (
    <main id="main" className="overflow-x-clip">
      <Hero />
      <BuiltWith />
      <Preview />
      <Effects />
      <Bento />
      <section aria-label="Motion" className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
        <MotionDial />
      </section>
      <Principles />
      <Catalog />
      <Faq />
      <Closing />
    </main>
  );
}

function SectionHeading({ eyebrow, title, children, center }: { eyebrow: string; title: string; children?: ReactNode; center?: boolean }) {
  return (
    <div className={cn("grid max-w-2xl gap-4", center && "mx-auto justify-items-center text-center")}>
      <span className="cue-label">{eyebrow}</span>
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {children && <p className="text-lg text-balance text-muted-foreground">{children}</p>}
    </div>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="p-2">
      <div className="relative isolate grid min-h-[min(calc(100svh-1rem),58rem)] place-items-center overflow-hidden rounded-[1.75rem] px-4 pt-28 pb-20 sm:rounded-[2.25rem] sm:px-6">
        <FluidBackdrop />
        <div className="relative grid w-full max-w-4xl justify-items-center gap-6 text-center">
          <h1 id="hero-title" className="text-[2.4rem] leading-[1.05] text-balance font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[4rem]">
            <TextReveal as="span" split="words" effect="blur" trigger="mount" className="block">
              Interfaces for AI agents
            </TextReveal>
            <TextReveal as="span" split="words" effect="blur" trigger="mount" className="block">
              and everything around them
            </TextReveal>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-pretty text-foreground/70 sm:text-lg">
            {components.length} open-source shadcn/ui components: agent chat, reasoning and approvals, plus GSAP motion and themes you can copy.
          </p>
          <div className="mt-6 w-full sm:mt-10">
            <HeroPrompt />
          </div>
        </div>
      </div>
    </section>
  );
}

function BuiltWith() {
  const stack = ["shadcn/ui", "React 19", "Tailwind CSS v4", "Radix UI", "GSAP", "TypeScript", "Vercel AI SDK", "TanStack", "Next.js", "Vite", "cmdk"];
  return (
    <section aria-label="Works with your stack" className="mx-auto mt-10 grid max-w-7xl gap-7 text-center">
      <p className="px-4 text-sm text-muted-foreground">
        Installs into the stack you{" "}
        <span className="mx-0.5 inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 font-medium text-foreground shadow-control">already ship</span> with one
        command
      </p>
      <Marquee speed={32} gap="4rem" className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        {stack.map((s) => (
          <span key={s} className="text-lg font-semibold tracking-tight whitespace-nowrap text-muted-foreground/55 sm:text-xl">
            {s}
          </span>
        ))}
      </Marquee>
    </section>
  );
}

function Preview() {
  return (
    <section aria-label="Preview" className="relative mx-auto mt-20 max-w-6xl px-4 sm:px-6">
      <HeroApp />
    </section>
  );
}

function EffectFrame({ title, slug, className, children }: { title: string; slug: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("group relative flex min-h-72 flex-col overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <div className="relative flex flex-1 items-center justify-center p-6">{children}</div>
      <Link
        to="/components/$slug"
        params={{ slug }}
        className="flex items-center justify-between border-t border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted/60"
      >
        {title}
        <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

const FEED = [
  { t: "Payment received", d: "$240 · Atlas Labs" },
  { t: "New member", d: "Grace joined Borealis" },
  { t: "Deploy ready", d: "web · main · 41s" },
  { t: "PR merged", d: "feat: motion tokens" },
];

function Effects() {
  const effectCount = components.filter((c) => c.section === "Effects" || c.section === "Motion").length;
  const OrbitDemo = examples["orbit-demo"]!;
  const FlipGridDemo = examples["flip-grid-demo"]!;
  return (
    <section aria-labelledby="effects-title" className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
      <div className="grid gap-4 text-center">
        <span className="cue-label">{effectCount} GSAP effects</span>
        <h2 id="effects-title" className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Motion you can <Typewriter text={["drop in.", "dial down.", "own."]} />
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-balance text-muted-foreground">
          Text reveals, odometers, orbits, beams, confetti, layout animation. Each is one file, powered by GSAP, and still readable by search engines.
        </p>
      </div>
      <Reveal stagger className="mt-14 grid gap-4 md:grid-cols-3">
        <EffectFrame title="Tilt Card" slug="tilt-card">
          <TiltCard className="grid aspect-[1.6/1] w-full max-w-72 content-between p-5">
            <div className="flex items-center justify-between">
              <span className="cue-label">Member</span>
              <span className="size-6 rounded-md bg-signal" />
            </div>
            <span className="font-mono text-sm tracking-[0.18em]">4242 0042 2026</span>
          </TiltCard>
        </EffectFrame>
        <EffectFrame title="Orbit" slug="orbit">
          <div className="flex w-full origin-center scale-75 justify-center">
            <OrbitDemo />
          </div>
        </EffectFrame>
        <EffectFrame title="Animated List" slug="animated-list">
          <AnimatedList max={3} className="w-full max-w-72">
            {FEED.map((f) => (
              <div key={f.t} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-left text-sm shadow-control">
                <span className="size-2 rounded-full bg-signal" />
                <span className="grid">
                  <span className="font-medium">{f.t}</span>
                  <span className="text-xs text-muted-foreground">{f.d}</span>
                </span>
              </div>
            ))}
          </AnimatedList>
        </EffectFrame>
        <EffectFrame title="Flip Grid" slug="flip-grid" className="md:col-span-2">
          <FlipGridDemo />
        </EffectFrame>
        <EffectFrame title="Border Beam + Burst" slug="border-beam">
          <div className="relative grid w-full max-w-60 justify-items-center gap-3 rounded-2xl border border-border bg-background p-6">
            <span className="cue-label">Ship it</span>
            <Burst>
              <Button pill>Deploy</Button>
            </Burst>
            <BorderBeam />
          </div>
        </EffectFrame>
      </Reveal>
    </section>
  );
}

function Tile({ title, text, slug, className, children }: { title: string; text: string; slug: string; className?: string; children: ReactNode }) {
  return (
    <Card className={cn("group gap-0 overflow-hidden py-0", className)}>
      <div className="relative flex min-h-56 flex-1 items-center justify-center border-b border-border bg-muted/30 p-6">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative z-10 flex w-full justify-center">{children}</div>
      </div>
      <div className="grid gap-1 p-5">
        <h3 className="font-semibold tracking-tight">
          <Link to="/components/$slug" params={{ slug }} className="inline-flex items-center gap-1.5 outline-none hover:underline hover:underline-offset-4">
            {title}
            <ArrowRightIcon className="size-3.5 -translate-x-1 opacity-0 transition-[opacity,translate] group-hover:translate-x-0 group-hover:opacity-100" />
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </Card>
  );
}

function Bento() {
  const TabsDemo = examples["tabs-demo"]!;
  const ButtonStates = examples["button-states"]!;
  const DockDemo = examples["dock-demo"]!;
  const NumberTickerDemo = examples["number-ticker-demo"]!;
  const CommandDemo = examples["command-demo"]!;
  return (
    <section aria-labelledby="bento-title" className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
      <SectionHeading eyebrow="Crafted interactions" title="Every component answers with a cue." center>
        Small, precise signals that a press, a hover or a change registered. Try them; everything below is live.
      </SectionHeading>
      <h2 id="bento-title" className="sr-only">
        Live components
      </h2>
      <Reveal stagger className="mt-14 grid gap-4 md:grid-cols-6">
        <Tile title="Button" slug="button" text="A surface that compresses on press, a ring that pings from your pointer, shortcuts built in." className="md:col-span-4">
          <ButtonStates />
        </Tile>
        <Tile title="Spinner" slug="spinner" text="Crop marks that close in, turn and release." className="md:col-span-2">
          <Spinner size="lg" />
        </Tile>
        <Tile title="Tabs" slug="tabs" text="One indicator that stretches between tabs, then catches up." className="md:col-span-3">
          <TabsDemo />
        </Tile>
        <Tile title="Number Ticker" slug="number-ticker" text="An odometer that rolls each digit; crawlers read the real number." className="md:col-span-3">
          <NumberTickerDemo />
        </Tile>
        <Tile title="Command" slug="command" text="A ⌘K palette whose highlight glides as you arrow through." className="md:col-span-3">
          <div className="w-full max-w-sm [&>div>button]:hidden">
            <CommandDemo />
          </div>
        </Tile>
        <Tile title="Toggle Group" slug="toggle-group" text="A segmented control with a chip that snaps into place." className="md:col-span-3">
          <div className="grid justify-items-center gap-5">
            <ToggleGroup type="single" defaultValue="week" aria-label="Range">
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="multiple" variant="ghost" defaultValue={["bold"]} aria-label="Formatting">
              {[
                { v: "bold", I: BoldIcon, k: "⌘B" },
                { v: "italic", I: ItalicIcon, k: "⌘I" },
                { v: "underline", I: UnderlineIcon, k: "⌘U" },
              ].map(({ v, I, k }) => (
                <Tooltip key={v}>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value={v} aria-label={v}>
                      <I />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent kbd={k} className="capitalize">
                    {v}
                  </TooltipContent>
                </Tooltip>
              ))}
            </ToggleGroup>
          </div>
        </Tile>
        <Tile title="Input OTP" slug="input-otp" text="Digits drop into their slots as you type or paste." className="md:col-span-2">
          <InputOTP maxLength={4} aria-label="Code">
            <InputOTPGroup>
              {[0, 1, 2, 3].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </Tile>
        <Tile title="Rating" slug="rating" text="Stars that pop up to your score in a cascade." className="md:col-span-2">
          <Rating defaultValue={4} size="lg" label="Rate Cuelark UI" />
        </Tile>
        <Tile title="Dock" slug="dock" text="Icons that swell as you approach, like the macOS Dock." className="md:col-span-2">
          <div className="origin-bottom scale-90">
            <DockDemo />
          </div>
        </Tile>
      </Reveal>
    </section>
  );
}

const PRINCIPLES = [
  { icon: CrosshairIcon, title: "Cue marks", text: "Print-registration crop marks frame surfaces and close in as overlays open. A signature detail, used sparingly." },
  { icon: SparklesIcon, title: "Motion with a dial", text: "GSAP-driven, tuned on one curve, scaled by one variable, and silent when visitors ask for less motion." },
  { icon: PaletteIcon, title: "Themeable to the core", text: "Base gray, accent, radius, density, marks and motion are all tokens. Light and dark follow from one block." },
  { icon: AccessibilityIcon, title: "Accessible", text: "Radix primitives, keyboard support, visible focus and real semantics in every component." },
  { icon: CodeIcon, title: "Source you own", text: "Installed by the shadcn CLI into your codebase. No runtime package, no lock-in, change anything." },
  { icon: ArrowRightIcon, title: "Crawlable by default", text: "Animated text is server-rendered, reveals never hide what is on screen, docs ship with structured data." },
];

function Principles() {
  return (
    <section aria-labelledby="principles-title" className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
      <SectionHeading eyebrow="Why Cuelark" title="Quiet by default. Precise when it matters." />
      <h2 id="principles-title" className="sr-only">
        Principles
      </h2>
      <Reveal stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="grid content-start gap-3 bg-background p-7">
            <Icon className="size-5 text-foreground" strokeWidth={1.5} />
            <h3 className="font-semibold tracking-tight">{title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function Catalog() {
  return (
    <section aria-labelledby="catalog-title" className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="The library" title={`${components.length} components across ${SECTIONS.length} categories`} />
        <Button variant="outline" pill asChild>
          <Link to="/components">
            View all <ArrowRightIcon />
          </Link>
        </Button>
      </div>
      <h2 id="catalog-title" className="sr-only">
        Component catalog
      </h2>
      <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <div key={section} className="grid content-start gap-3">
            <h3 className="cue-label border-b border-border pb-2">{section}</h3>
            <ul className="grid gap-1.5">
              {components
                .filter((c) => c.section === section)
                .map((c) => (
                  <li key={c.slug}>
                    <Link to="/components/$slug" params={{ slug: c.slug }} className="group flex items-baseline gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {c.name}
                      {c.motion && <span className="size-1 shrink-0 translate-y-[-2px] rounded-full bg-foreground/40" aria-label="GSAP motion" />}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq-title" className="mx-auto mt-32 grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
      <div className="grid content-start gap-4">
        <span className="cue-label">FAQ</span>
        <h2 id="faq-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Questions, answered
        </h2>
        <p className="text-muted-foreground">
          Anything else? Write to{" "}
          <a href={`mailto:${SITE.contact}`} className="font-medium text-foreground underline decoration-border underline-offset-4">
            {SITE.contact}
          </a>
          .
        </p>
      </div>
      <Accordion type="single" collapsible numbered defaultValue={FAQ[0]!.q}>
        {FAQ.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Closing() {
  return (
    <section className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
      <div className="cue-marks relative overflow-visible rounded-3xl bg-foreground px-6 py-20 text-center text-background">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.07] invert" />
        <div className="relative grid justify-items-center gap-6">
          <TextReveal as="h2" split="chars" className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Ship interfaces people feel.
          </TextReveal>
          <p className="max-w-lg text-background/70">Start with one component. Each works on its own and composes with the rest.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" pill variant="secondary" asChild>
              <Link to="/docs/installation">Get started</Link>
            </Button>
            <Button size="lg" pill variant="ghost" className="text-background hover:before:bg-background/10" asChild>
              <a href={SITE.github}>Star on GitHub</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

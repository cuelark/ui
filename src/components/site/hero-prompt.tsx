import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpIcon, BlocksIcon, CornerLeftUpIcon, PaletteIcon, RotateCcwIcon } from "lucide-react";

import { components } from "@/content/components";
import type { ComponentDoc } from "@/content/types";
import { gsap, motionScale } from "@/lib/motion";
import { DEFAULT_THEME, resetSiteTheme, setSiteTheme, type SiteTheme } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

type Mode = "find" | "style";

/** Best component for a free-text query: name hits beat keyword hits beat description hits. */
function bestMatch(query: string): ComponentDoc | undefined {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return undefined;
  let best: { doc: ComponentDoc; score: number } | undefined;
  for (const doc of components) {
    const name = doc.name.toLowerCase();
    const keys = doc.keywords.join(" ").toLowerCase();
    const desc = doc.description.toLowerCase();
    const score = words.reduce((s, w) => s + (name.includes(w) ? 6 : 0) + (keys.includes(w) ? 3 : 0) + (desc.includes(w) ? 1 : 0), 0) + (name === query.toLowerCase().trim() ? 10 : 0);
    if (score > 0 && (!best || score > best.score)) best = { doc, score };
  }
  return best?.doc;
}

/** Turn a described look ("midnight editorial violet") into theme settings. */
const VOCAB: { match: RegExp; set: Partial<SiteTheme>; label: string; dark?: boolean }[] = [
  { match: /\b(blue|cobalt|ocean|sky)\b/, set: { signal: "Cobalt", hue: 264, fill: "signal" }, label: "Cobalt" },
  { match: /\b(electric|neon blue)\b/, set: { signal: "Electric", hue: 258, fill: "signal" }, label: "Electric" },
  { match: /\b(violet|purple|lavender|grape)\b/, set: { signal: "Violet", hue: 295, fill: "signal" }, label: "Violet" },
  { match: /\b(coral|red|orange|sunset|warm)\b/, set: { signal: "Coral", hue: 32, fill: "signal" }, label: "Coral" },
  { match: /\b(mint|green|teal|forest|fresh)\b/, set: { signal: "Mint", hue: 168, fill: "signal" }, label: "Mint" },
  { match: /\b(lime|chartreuse|acid)\b/, set: { signal: "Chartreuse", hue: 127, fill: "ink" }, label: "Chartreuse" },
  { match: /\b(mono|monochrome|ink|black|minimal)\b/, set: { signal: "Ink", hue: 0, fill: "ink", base: "Neutral" }, label: "Mono" },
  { match: /\b(paper|cream|vintage)\b/, set: { base: "Paper" }, label: "Paper base" },
  { match: /\b(cool|slate|steel)\b/, set: { base: "Slate" }, label: "Slate base" },
  { match: /\b(neutral|gray|grey)\b/, set: { base: "Neutral" }, label: "Neutral base" },
  { match: /\b(editorial|magazine|elegant)\b/, set: { font: "Instrument Sans", radius: 1 }, label: "Instrument Sans" },
  { match: /\b(techy|terminal|code|hacker|retro)\b/, set: { font: "Space Grotesk", radius: 0, density: 0.875 }, label: "Space Grotesk" },
  { match: /\b(soft|friendly|playful|round)\b/, set: { font: "Plus Jakarta Sans", radius: 1.25 }, label: "Soft corners" },
  { match: /\b(vercel|geist|swiss)\b/, set: { font: "Geist", radius: 0.5 }, label: "Geist" },
  { match: /\b(sharp|square|brutal)\b/, set: { radius: 0 }, label: "Square corners" },
  { match: /\b(compact|dense)\b/, set: { density: 0.875, textSize: 0.9375 }, label: "Compact" },
  { match: /\b(roomy|airy|spacious)\b/, set: { density: 1.125 }, label: "Roomy" },
  { match: /\b(calm|still|quiet)\b/, set: { motion: 0.5 }, label: "Calm motion" },
  { match: /\b(midnight|dark|night)\b/, set: {}, label: "Dark", dark: true },
];

const PLACEHOLDER: Record<Mode, string> = {
  find: "Try “chat input” or “command palette”",
  style: "Describe a look: “midnight editorial violet”",
};

/**
 * The hero's input-first call to action. A segmented toggle (sliding white segment) switches between finding a
 * component and styling a theme; a white pill field with a round accent submit does the rest.
 */
export function HeroPrompt() {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<Mode>("find");
  const [value, setValue] = React.useState("");
  const [applied, setApplied] = React.useState<string[] | null>(null);
  const toggle = React.useRef<HTMLDivElement>(null);
  const field = React.useRef<HTMLFormElement>(null);
  const match = mode === "find" ? bestMatch(value) : undefined;

  // Slide the white segment under the active option.
  React.useLayoutEffect(() => {
    const root = toggle.current;
    const active = root?.querySelector<HTMLElement>(`[data-mode="${mode}"]`);
    const chip = root?.querySelector<HTMLElement>('[data-part="chip"]');
    if (!root || !active || !chip) return;
    gsap.to(chip, { x: active.offsetLeft - 4, width: active.offsetWidth, duration: motionScale(root) ? 0.35 : 0, ease: "cue" });
  }, [mode]);

  const submit = () => {
    const el = field.current;
    if (el && motionScale(el)) gsap.fromTo(el, { scale: 0.985 }, { scale: 1, duration: 0.4, ease: "cue-snap", clearProps: "transform" });
    if (mode === "find") {
      void navigate(match ? { to: "/components/$slug", params: { slug: match.slug } } : { to: "/components" });
      return;
    }
    const q = value.toLowerCase();
    const hits = VOCAB.filter((v) => v.match.test(q));
    if (!hits.length) {
      setApplied([]);
      return;
    }
    setSiteTheme(Object.assign({ ...DEFAULT_THEME }, ...hits.map((h) => h.set)));
    const dark = hits.some((h) => h.dark);
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    setApplied(hits.map((h) => h.label));
  };

  return (
    <div className="mx-auto grid w-full max-w-xl justify-items-center gap-5">
      <div ref={toggle} role="radiogroup" aria-label="What do you want to do?" className="relative flex rounded-full bg-[oklch(0.2_0.04_262/0.28)] p-1 text-sm font-medium text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.14)] backdrop-blur-md">
        <span data-part="chip" aria-hidden="true" className="absolute top-1 bottom-1 left-1 rounded-full bg-white shadow-control" />
        {(
          [
            { id: "find", label: "Find a component", Icon: BlocksIcon },
            { id: "style", label: "Style a theme", Icon: PaletteIcon },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mode === id}
            data-mode={id}
            onClick={() => {
              setMode(id);
              setApplied(null);
            }}
            className={cn(
              "relative z-10 flex h-8 items-center gap-1.5 rounded-full px-3.5 outline-none transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-white/60",
              mode === id ? "text-[oklch(0.18_0.03_262)]" : "text-white/90 hover:text-white",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <form
        ref={field}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex h-16 w-full items-center gap-2 rounded-[1.25rem] bg-white ps-5 pe-2.5 text-[oklch(0.18_0.03_262)] shadow-[0_1px_2px_oklch(0.3_0.08_262/0.12),0_12px_40px_-12px_oklch(0.3_0.12_262/0.45)] transition-shadow focus-within:shadow-[0_0_0_4px_oklch(1_0_0/0.45),0_12px_40px_-12px_oklch(0.3_0.12_262/0.45)]"
      >
        <label htmlFor="hero-prompt" className="sr-only">
          {mode === "find" ? "Find a component" : "Describe a theme"}
        </label>
        <input
          id="hero-prompt"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={PLACEHOLDER[mode]}
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[oklch(0.55_0.02_262)]"
        />
        <button
          type="submit"
          aria-label={mode === "find" ? "Open component" : "Apply theme"}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground outline-none transition-[scale,filter] duration-150 ease-cue hover:brightness-110 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-90"
        >
          <ArrowUpIcon className="size-4.5" />
        </button>
      </form>

      <p aria-live="polite" className="flex min-h-5 items-center gap-2 text-sm font-medium text-white [text-shadow:0_1px_8px_oklch(0.3_0.12_262/0.35)]">
        <CornerLeftUpIcon className="size-4" aria-hidden="true" />
        {mode === "find" ? (
          match ? (
            <span>
              Opens <span className="underline decoration-white/50 underline-offset-4">{match.name}</span>, {match.description.charAt(0).toLowerCase() + match.description.slice(1)}
            </span>
          ) : (
            <span>Search {components.length} components by what you need</span>
          )
        ) : applied === null ? (
          <span>Applies to the whole site, live</span>
        ) : applied.length ? (
          <span className="flex items-center gap-2">
            Applied {applied.join(" · ")}
            <button type="button" onClick={() => (resetSiteTheme(), setApplied(null))} className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs hover:bg-white/25">
              <RotateCcwIcon className="size-3" /> Reset
            </button>
          </span>
        ) : (
          <span>Try a color, a mood or a font: violet, editorial, midnight, compact</span>
        )}
      </p>
    </div>
  );
}

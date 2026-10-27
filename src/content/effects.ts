import type { ComponentDoc } from "./types.ts";

const imp = (names: string, slug: string) => `import { ${names} } from "@/components/ui/${slug}";`;
const motionA11y = "With reduced motion or --cl-motion: 0 the effect stays still and the content remains fully usable.";

/** GSAP effects: the expressive end of the library, for landing pages and moments that deserve it. */
export const effects: ComponentDoc[] = [
  {
    slug: "animated-icon",
    name: "Animated Icon",
    section: "Effects",
    description: "Any icon, animated with a motion that fits it: bells ring, arrows nudge, gears turn.",
    intro:
      "Animated Icon brings any icon to life with GSAP: react-icons, lucide-react, an installed Cuelark icon or a raw SVG. Leave the animation on auto and it reads the icon's name to pick a motion that means something: bells ring, arrows nudge in their direction, gears turn, send icons fly off and return, refresh spins, charts grow, eyes blink, flags wave, pins drop. Or choose from 30 named animations, triggered on hover, click, mount, scroll or loop.",
    keywords: ["animated icons react", "icon animation", "react icons animation", "lucide animated icons", "hover icon animation", "gsap icon animation"],
    motion: "GSAP timelines per animation, scaled by --cl-motion; auto mode maps icon names to motions.",
    usage: { imports: imp("AnimatedIcon", "animated-icon"), code: `<AnimatedIcon>\n  <BellIcon />\n</AnimatedIcon>\n\n<AnimatedIcon animation="spin" trigger="click">\n  <RefreshCwIcon />\n</AnimatedIcon>` },
    examples: [{ name: "animated-icon-demo", title: "Smart motion", description: "Ten icons, each with its own animation." }],
    api: [
      {
        part: "AnimatedIcon",
        props: [
          { prop: "animation", type: "string", default: '"auto"', description: "auto, pop, ring, nudge-right, turn, fly, spin, twinkle, zoom, blink, wave, grow, drive, drop, draw and more." },
          { prop: "trigger", type: '"hover" | "click" | "mount" | "inView" | "loop"', default: '"hover"', description: "When it plays." },
          { prop: "name", type: "string", description: "Icon name for auto mode; read from the child when omitted." },
          { prop: "duration", type: "number", description: "Override seconds." },
        ],
      },
    ],
    accessibility: ["Decorative motion only; the icon keeps its own label.", motionA11y],
    faq: [
      { q: "Where do I find icons?", a: "Browse 50,000+ icons at /icons: every react-icons set, searchable, with a page, SVG and shadcn install for each." },
      { q: "Does auto work with lucide-react?", a: "Yes: lucide icons carry their name, so <AnimatedIcon><BellIcon /></AnimatedIcon> rings." },
    ],
  },
  {
    slug: "shimmer-button",
    name: "Shimmer Button",
    section: "Effects",
    description: "A pill CTA whose surface catches a sweeping band of light.",
    intro:
      "Shimmer Button is the call to action for hero sections: a band of light sweeps across the ink surface on a slow loop and pauses while hovered, so the button stays lively without becoming restless. Presses ping in the signal color.",
    keywords: ["shimmer button", "animated button react", "shiny button", "cta button animation", "shimmer cta button"],
    motion: "A repeating GSAP timeline sweeps the light band; hovering pauses it.",
    usage: { imports: imp("ShimmerButton", "shimmer-button"), code: `<ShimmerButton>Start building</ShimmerButton>` },
    examples: [{ name: "shimmer-button-demo", title: "Hero CTA", description: "A pill button with an icon." }],
    api: [
      {
        part: "ShimmerButton",
        description: "Extends native <button> props.",
        props: [
          { prop: "interval", type: "number", default: "2.6", description: "Seconds between sweeps." },
          { prop: "asChild", type: "boolean", default: "false", description: "Render a link." },
        ],
      },
    ],
    accessibility: ["Native button semantics and a visible focus ring.", motionA11y],
    faq: [{ q: "Can I change its color?", a: "It uses --primary and --primary-foreground, so it follows your theme; override with classes like bg-signal." }],
  },
  {
    slug: "border-beam",
    name: "Border Beam",
    section: "Effects",
    description: "A light that travels around a card's border.",
    intro:
      "Border Beam draws a short comet of light that laps the border of its parent. Use it to mark the recommended plan, a new feature or an active state. It is one masked conic gradient rotated by GSAP: no SVG, no layout cost.",
    keywords: ["border beam", "animated border", "glowing border card", "border animation css", "animated card border"],
    motion: "GSAP rotates the gradient angle in a seamless loop.",
    usage: { imports: imp("BorderBeam", "border-beam"), code: `<div className="relative rounded-2xl border">\n  …\n  <BorderBeam />\n</div>` },
    examples: [{ name: "border-beam-demo", title: "Highlighted plan", description: "A pricing card with a beam." }],
    api: [
      {
        part: "BorderBeam",
        description: "Absolutely positioned; inherits the parent's radius.",
        props: [
          { prop: "duration", type: "number", default: "6", description: "Seconds per lap." },
          { prop: "color", type: "string", default: '"var(--signal)"', description: "Beam color." },
          { prop: "size", type: "number", default: "0.18", description: "Beam length (0–1 of the border)." },
        ],
      },
    ],
    accessibility: ["Decorative and aria-hidden.", motionA11y],
    faq: [{ q: "Why don't I see it?", a: "The parent needs position: relative and a border radius; the beam fills it." }],
  },
  {
    slug: "tilt-card",
    name: "Tilt Card",
    section: "Effects",
    description: "A 3D card that tilts toward the pointer with a moving glare.",
    intro:
      "Tilt Card leans toward the pointer in 3D with a glare that follows across the surface, then settles back with an elastic release. It suits product cards, membership cards and showcases.",
    keywords: ["3d tilt card", "react tilt effect", "parallax card hover", "glare card", "hover 3d card"],
    motion: "GSAP quickTo drives rotateX/rotateY and the glare position; release uses an elastic ease.",
    usage: { imports: imp("TiltCard", "tilt-card"), code: `<TiltCard className="p-6">…</TiltCard>` },
    examples: [{ name: "tilt-card-demo", title: "Member card", description: "A card with a glare." }],
    api: [
      {
        part: "TiltCard",
        props: [
          { prop: "max", type: "number", default: "10", description: "Maximum tilt in degrees." },
          { prop: "glare", type: "boolean", default: "true", description: "Pointer-following glare." },
        ],
      },
    ],
    accessibility: ["Purely visual; content and focus order are unchanged.", motionA11y],
    faq: [{ q: "Does it work on touch?", a: "Pointer events drive it, so it tilts while a finger drags across it and settles on release." }],
  },
  {
    slug: "typewriter",
    name: "Typewriter",
    section: "Effects",
    description: "Text that types itself out, cycling through phrases.",
    intro:
      "Typewriter types a phrase with a signal-colored block caret, holds, deletes and moves to the next (GSAP TextPlugin). It starts when it scrolls into view, and the first phrase is server-rendered for search engines.",
    keywords: ["typewriter effect react", "typing animation", "typed text", "text typing effect", "typewriter text"],
    motion: "A GSAP TextPlugin timeline types, holds and deletes each phrase.",
    usage: { imports: imp("Typewriter", "typewriter"), code: `<Typewriter text={["dashboards.", "landing pages."]} />` },
    examples: [{ name: "typewriter-demo", title: "Cycling phrases", description: "Four phrases in a heading." }],
    api: [
      {
        part: "Typewriter",
        props: [
          { prop: "text", type: "string | string[]", description: "Phrase(s) to type." },
          { prop: "speed", type: "number", default: "28", description: "Characters per second." },
          { prop: "hold", type: "number", default: "1.6", description: "Seconds before deleting." },
          { prop: "loop", type: "boolean", default: "true", description: "Cycle forever." },
          { prop: "cursor", type: "boolean", default: "true", description: "Block caret." },
        ],
      },
    ],
    accessibility: ["The first phrase is real text; the caret is aria-hidden.", motionA11y],
    faq: [{ q: "Which phrase is indexed?", a: "The first one, rendered on the server. Put the most important phrase first." }],
  },
  {
    slug: "gradient-text",
    name: "Gradient Text",
    section: "Effects",
    description: "Text with a living highlight: a drifting shimmer or a pointer spotlight.",
    intro:
      "Gradient Text gives words a living highlight. In drift mode a soft glint of the signal color slides through the text on a loop; in spotlight mode the color sits under your pointer, as if you were lighting the line with a torch. The base color is always your foreground, so it reads on any theme, and the text stays real: selectable, translatable and indexed.",
    keywords: ["animated gradient text", "shiny text react", "text spotlight effect", "text shimmer", "aurora text"],
    motion: "GSAP loops the highlight position (drift) or eases it to the pointer with quickTo (spotlight).",
    usage: { imports: imp("GradientText", "gradient-text"), code: `Interfaces with a <GradientText>signal</GradientText>.\n<GradientText variant="spotlight">Hover me</GradientText>` },
    examples: [{ name: "gradient-text-demo", title: "Drift and spotlight", description: "A headline accent and a line you light with the pointer." }],
    api: [
      {
        part: "GradientText",
        props: [
          { prop: "variant", type: '"drift" | "spotlight"', default: '"drift"', description: "Looping shimmer, or a highlight that follows the pointer." },
          { prop: "color", type: "string", default: "signal, deepened", description: "Highlight color." },
          { prop: "duration", type: "number", default: "3.2", description: "Seconds per drift sweep." },
          { prop: "asChild", type: "boolean", default: "false", description: "Use your own element." },
        ],
      },
    ],
    accessibility: ["The resting color is the foreground, so contrast never depends on the animation.", motionA11y],
    faq: [{ q: "Can I use brand colors?", a: "Pass color=\"#…\" or any CSS color or variable." }],
  },
  {
    slug: "orbit",
    name: "Orbit",
    section: "Effects",
    description: "Icons orbiting a center on dashed tracks.",
    intro:
      "Orbit spaces its children evenly on a ring that turns around a center while the items stay upright: integrations, partner logos, team avatars. Stack two Orbits for inner and outer rings; hover slows the system down.",
    keywords: ["orbiting circles", "orbit animation react", "integrations animation", "rotating icons", "orbiting icons animation"],
    motion: "GSAP rotates the ring and counter-rotates items; hover eases timeScale down.",
    usage: { imports: imp("Orbit", "orbit"), code: `<div className="relative h-80">\n  <Orbit radius={120}>{icons}</Orbit>\n</div>` },
    examples: [{ name: "orbit-demo", title: "Integrations", description: "Two rings in opposite directions." }],
    api: [
      {
        part: "Orbit",
        description: "Absolutely fills its relative parent.",
        props: [
          { prop: "radius", type: "number", default: "110", description: "Ring radius (px)." },
          { prop: "duration", type: "number", default: "24", description: "Seconds per revolution." },
          { prop: "reverse", type: "boolean", default: "false", description: "Counter-clockwise." },
          { prop: "path", type: "boolean", default: "true", description: "Dashed track." },
        ],
      },
    ],
    accessibility: ["Give icon items accessible names if they convey meaning.", motionA11y],
    faq: [{ q: "How many items fit?", a: "Any number; they are spaced evenly. Around 3–8 per ring reads best." }],
  },
  {
    slug: "dot-field",
    name: "Dot Field",
    section: "Effects",
    description: "An interactive dot-grid background that reacts to the cursor.",
    intro:
      "Dot Field is a canvas dot grid for hero and section backgrounds. Dots near the pointer swell and light up in the signal color, and a click sends a ripple across the field. It reads your theme tokens, stays sharp on retina screens and pauses when off screen.",
    keywords: ["interactive background react", "dot grid background", "cursor effect background", "canvas background animation", "dot pattern"],
    motion: "A canvas loop (paused off screen) reacts to the pointer and click ripples.",
    usage: { imports: imp("DotField", "dot-field"), code: `<DotField className="h-96">…hero content…</DotField>` },
    examples: [{ name: "dot-field-demo", title: "Hero background", description: "Move and click." }],
    api: [
      {
        part: "DotField",
        props: [
          { prop: "gap", type: "number", default: "22", description: "Grid spacing (px)." },
          { prop: "radius", type: "number", default: "120", description: "Pointer influence radius." },
          { prop: "ripple", type: "boolean", default: "true", description: "Click ripples." },
        ],
      },
    ],
    accessibility: ["The canvas is aria-hidden; children render normally above it.", motionA11y],
    faq: [{ q: "Is it heavy?", a: "It draws only while visible and caps the device pixel ratio at 2." }],
  },
  {
    slug: "burst",
    name: "Burst",
    section: "Effects",
    description: "Confetti that sprays from any button on click.",
    intro:
      "Burst wraps any clickable element and throws a small spray of confetti from the click point. Pieces arc, spin and fall in a GSAP timeline, then clean themselves up. Save it for real milestones: finished onboarding, a first deploy, a like.",
    keywords: ["confetti react", "confetti button", "celebration animation", "click confetti effect", "canvas confetti alternative"],
    motion: "Each particle runs a two-stage GSAP timeline: launch, then gravity and fade.",
    usage: { imports: imp("Burst", "burst"), code: `<Burst><Button>Celebrate</Button></Burst>` },
    examples: [{ name: "burst-demo", title: "Celebrate", description: "Click for confetti." }],
    api: [
      {
        part: "Burst",
        description: "Takes one child element and keeps its own onClick.",
        props: [
          { prop: "count", type: "number", default: "18", description: "Particles per click." },
          { prop: "colors", type: "string[]", default: "signal, ink, muted", description: "Particle colors." },
          { prop: "disabled", type: "boolean", default: "false", description: "Turn it off." },
        ],
      },
    ],
    accessibility: ["Particles are decorative and removed after 1.5s.", motionA11y],
    faq: [{ q: "Does it need a canvas library?", a: "No. Particles are a few DOM nodes animated by GSAP." }],
  },
  {
    slug: "animated-list",
    name: "Animated List",
    section: "Effects",
    description: "A live feed where items arrive and push the rest down.",
    intro:
      "Animated List turns a list into a live feed: new items spring in at the top while the others glide down to make room. Use it for notifications, activity streams and transactions on landing pages and dashboards.",
    keywords: ["animated list react", "notification feed animation", "activity feed", "live feed component", "animated notification list"],
    motion: "New items spring in; existing items animate from their previous positions (FLIP).",
    usage: { imports: imp("AnimatedList", "animated-list"), code: `<AnimatedList>{notifications}</AnimatedList>` },
    examples: [{ name: "animated-list-demo", title: "Activity feed", description: "Payments, members, merges and comments." }],
    api: [
      {
        part: "AnimatedList",
        props: [
          { prop: "interval", type: "number", default: "1400", description: "ms between items." },
          { prop: "loop", type: "boolean", default: "true", description: "Cycle forever." },
          { prop: "max", type: "number", default: "5", description: "Visible items." },
        ],
      },
    ],
    accessibility: ["A polite live region; consider loop={false} for screen-reader heavy pages.", motionA11y],
    faq: [{ q: "Can I feed it real data?", a: "Yes: render your latest items as children; new children animate in." }],
  },
  {
    slug: "flip-grid",
    name: "Flip Grid",
    section: "Effects",
    description: "A grid whose items glide to new places when filtered or sorted.",
    intro:
      "Flip Grid animates layout changes with GSAP Flip: filter, sort or reflow the grid and every item glides from where it was to where it lands. New items scale in and removed ones fade out. Changing one key is all it takes.",
    keywords: ["gsap flip react", "animated filter grid", "layout animation react", "shuffle grid", "isotope alternative"],
    motion: "GSAP Flip records positions before the change and animates the difference.",
    usage: { imports: imp("FlipGrid, FlipGridItem", "flip-grid"), code: `<FlipGrid layoutKey={filter} className="grid-cols-4">\n  {items.map((i) => (\n    <FlipGridItem key={i.id} id={i.id} hidden={!matches(i)}>…</FlipGridItem>\n  ))}\n</FlipGrid>` },
    examples: [{ name: "flip-grid-demo", title: "Filterable grid", description: "Filter with a segmented control." }],
    api: [{ part: "FlipGrid", props: [{ prop: "layoutKey", type: "string | number", description: "Change it to animate the next layout." }] }],
    accessibility: ["Children keep their semantics and DOM order.", motionA11y],
    faq: [{ q: "Why does it need keys?", a: "Flip matches elements before and after the change; stable React keys keep the same nodes." }],
  },
  {
    slug: "draw-path",
    name: "Draw Path",
    section: "Effects",
    description: "Draws SVG strokes as if by hand: signatures, underlines, diagrams.",
    intro:
      "Draw Path animates the strokes of any inline SVG as though drawn by hand (GSAP DrawSVGPlugin), on mount, on scroll into view, or scrubbed with the scroll position. Use it for signatures, hand-drawn underlines, diagrams and line icons.",
    keywords: ["svg line drawing animation", "draw svg react", "signature animation", "path animation gsap", "stroke animation"],
    motion: "DrawSVGPlugin animates each stroke from 0% to 100% in sequence.",
    usage: { imports: imp("DrawPath", "draw-path"), code: `<DrawPath viewBox="0 0 100 20"><path d="M0 10 Q 50 0 100 10" /></DrawPath>` },
    examples: [{ name: "draw-path-demo", title: "Signature", description: "A scribble with a signal underline." }],
    api: [
      {
        part: "DrawPath",
        description: "Extends <svg> props; put stroked elements inside.",
        props: [
          { prop: "trigger", type: '"mount" | "inView" | "scroll"', default: '"inView"', description: "When to draw." },
          { prop: "duration", type: "number", default: "1.4", description: "Seconds." },
        ],
      },
    ],
    accessibility: ["Add a <title> to meaningful SVGs.", motionA11y],
    faq: [{ q: "Is DrawSVGPlugin free?", a: "Yes, every GSAP plugin is free since 3.13." }],
  },
];

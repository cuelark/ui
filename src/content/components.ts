/**
 * Every component's docs and registry metadata. `scripts/registry.ts` builds registry.json from this,
 * and the docs pages render from it, so a component is added in exactly one place (plus its source files).
 */
import { agents } from "./agents.ts";
import { effects } from "./effects.ts";
import { essentials } from "./essentials.ts";
import { patterns } from "./patterns.ts";
import { moreComponents } from "./more-components.ts";
import type { ComponentDoc } from "./types.ts";

export { SECTIONS } from "./types.ts";
export type { ComponentDoc, ExampleDoc, PropRow, Section } from "./types.ts";

const coreComponents: ComponentDoc[] = [
  {
    slug: "accordion",
    name: "Accordion",
    section: "Layout",
    description: "Stacked disclosure sections with numbered, dashed and separated styles.",
    intro:
      "An accordion lets readers scan a list of headings and open only what they need. Cuelark's accordion adds CSS-counter numbering, a plus that turns into a close mark, and three surface styles, while each trigger stays inside a real heading for a clean document outline.",
    keywords: ["react accordion", "shadcn accordion", "faq accordion", "collapsible sections", "tailwind accordion"],
    motion: "As a panel opens, its children rise in one after another (GSAP stagger). Items open on first render skip it.",
    usage: {
      imports: 'import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";',
      code: `<Accordion type="single" collapsible numbered>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It follows the WAI-ARIA accordion pattern.</AccordionContent>
  </AccordionItem>
</Accordion>`,
    },
    examples: [
      { name: "accordion-demo", title: "Numbered FAQ", description: "A single-open FAQ with mono index numbers." },
      { name: "accordion-separated", title: "Separated and dashed", description: "Card-like items, and dashed rules between items." },
    ],
    api: [
      {
        part: "Accordion",
        description: "Extends Radix Accordion.Root (type, value, defaultValue, collapsible, …).",
        props: [
          { prop: "variant", type: '"lined" | "dashed" | "separated"', default: '"lined"', description: "Divider style between items." },
          { prop: "numbered", type: "boolean", default: "false", description: "Prefix triggers with 01, 02, … via CSS counters." },
        ],
      },
      { part: "AccordionItem", description: "Extends Radix Accordion.Item.", props: [{ prop: "value", type: "string", description: "Unique value of the item." }] },
      { part: "AccordionTrigger", description: "Rendered inside an <h3> header.", props: [] },
      { part: "AccordionContent", description: "Animates height on open and close.", props: [] },
    ],
    accessibility: [
      "Triggers are buttons inside <h3> headings with aria-expanded and aria-controls.",
      "Space and Enter toggle; arrow keys, Home and End move between triggers.",
      "Height animations are skipped when the user prefers reduced motion.",
    ],
    faq: [
      { q: "Can several items be open at once?", a: 'Yes. Pass type="multiple" to Accordion; use type="single" collapsible for one-at-a-time.' },
      { q: "How does the numbering work?", a: "With CSS counters, so numbers stay correct when items are filtered, reordered or rendered conditionally." },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    section: "Display",
    description: "Compact status and category labels with status dots and a mono style.",
    intro:
      "Badges label status, category or version at a glance. Cuelark badges come in soft tinted tones, an optional status dot with a live pulse, and a mono uppercase style for version tags and metadata.",
    keywords: ["react badge", "shadcn badge", "status badge", "tag component", "tailwind badge"],
    usage: {
      imports: 'import { Badge } from "@/components/ui/badge";',
      code: `<Badge variant="success" dot="pulse">Live</Badge>`,
    },
    examples: [
      { name: "badge-demo", title: "Variants", description: "Seven tones from neutral to solid." },
      { name: "badge-status", title: "Status and mono", description: "Status dots, a live pulse, mono tags and a badge link." },
    ],
    api: [
      {
        part: "Badge",
        props: [
          { prop: "variant", type: '"neutral" | "primary" | "success" | "warning" | "destructive" | "outline" | "solid"', default: '"neutral"', description: "Color tone." },
          { prop: "size", type: '"sm" | "md"', default: '"md"', description: "Height and text size." },
          { prop: "dot", type: 'boolean | "pulse"', default: "false", description: "Leading status dot; pulse adds a ping." },
          { prop: "mono", type: "boolean", default: "false", description: "Mono, uppercase, tracked text." },
          { prop: "asChild", type: "boolean", default: "false", description: "Render the child element (e.g. a link) with badge styles." },
        ],
      },
    ],
    accessibility: [
      "The status dot is decorative (aria-hidden); the text carries the meaning.",
      "The pulse animation is hidden for users who prefer reduced motion.",
      "Badge links get a visible focus outline.",
    ],
    faq: [
      { q: "Can a badge be a link?", a: "Yes. Use asChild and pass an <a> (or your router's Link) as the child." },
      { q: "How do I add a new tone?", a: "Add a variant to badgeVariants in badge.tsx; the file is yours after install." },
    ],
  },
  {
    slug: "button",
    name: "Button",
    section: "Actions",
    description: "Tactile buttons with loading state, keyboard hints and six variants.",
    intro:
      "Buttons trigger actions. Cuelark buttons have a pressed state you can feel (an inset highlight and a one-pixel travel), a loading state that keeps the button's width, and a built-in keyboard shortcut hint, so the shortcut is learned where the action lives.",
    keywords: ["react button", "shadcn button", "loading button", "button with keyboard shortcut", "tailwind button"],
    motion: "Pressing sends a thin ring rippling out from the pointer (from the center for keyboard presses). Turn it off per button with ping={false}.",
    usage: {
      imports: 'import { Button } from "@/components/ui/button";',
      code: `<Button kbd="⌘S" loading={saving}>Save</Button>`,
    },
    examples: [
      { name: "button-demo", title: "Variants", description: "Primary, secondary, outline, ghost, destructive and link." },
      { name: "button-states", title: "Sizes, loading and shortcuts", description: "Keyboard hints, the loading state, icon buttons and every size." },
    ],
    api: [
      {
        part: "Button",
        description: "Extends the native <button> props.",
        props: [
          { prop: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"', default: '"primary"', description: "Visual style." },
          { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "icon" | "icon-sm" | "icon-lg"', default: '"md"', description: "Height follows --cl-density." },
          { prop: "loading", type: "boolean", default: "false", description: "Spinner, aria-busy, disabled; width is preserved." },
          { prop: "kbd", type: "ReactNode", description: "Keyboard shortcut hint shown after the label." },
          { prop: "ping", type: "boolean", default: "true (false for link)", description: "Ripple ring on press (GSAP, follows --cl-motion)." },
          { prop: "asChild", type: "boolean", default: "false", description: "Render the child element with button styles." },
        ],
      },
    ],
    accessibility: [
      "Native <button> semantics; icon-only buttons need an aria-label.",
      "Loading sets aria-busy and disables the button so double submits cannot happen.",
      "Focus is shown with a 2px outline offset from the button, visible on every variant.",
    ],
    faq: [
      { q: "Does the kbd prop bind the shortcut?", a: "No. It only displays the hint; bind the key with your own handler or a hotkeys library." },
      { q: "Can I render a link that looks like a button?", a: "Yes. <Button asChild><a href=\"/pricing\">Pricing</a></Button> keeps link semantics." },
    ],
  },
  {
    slug: "card",
    name: "Card",
    section: "Layout",
    description: "Surfaces with crop marks, raised and inset styles, and a divided footer tray.",
    intro:
      "Cards group related content on one surface. Cuelark cards add optional print-style crop marks, raised, inset and ghost surfaces, a mono label slot, and a footer tray separated by a dashed rule. Titles can render as real headings for SEO.",
    keywords: ["react card", "shadcn card", "pricing card", "tailwind card component", "card with header and footer"],
    motion: "With spotlight, a soft accent glow trails the pointer, smoothed with GSAP quickTo on the house ease.",
    usage: {
      imports: 'import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";',
      code: `<Card variant="raised" marks>
  <CardHeader>
    <CardTitle asChild><h3>Studio</h3></CardTitle>
    <CardDescription>For small teams.</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>`,
    },
    examples: [
      { name: "card-demo", title: "Pricing card", description: "Raised card with crop marks, a label, an action and a footer tray." },
      { name: "card-variants", title: "Interactive variants", description: "Outline, raised and inset cards whose whole surface is a link." },
    ],
    api: [
      {
        part: "Card",
        props: [
          { prop: "variant", type: '"outline" | "raised" | "inset" | "ghost"', default: '"outline"', description: "Surface style." },
          { prop: "marks", type: "boolean", default: "false", description: "Crop marks outside the corners (hidden globally with --cl-marks: 0)." },
          { prop: "interactive", type: "boolean", default: "false", description: "Hover lift and focus ring for clickable cards." },
          { prop: "spotlight", type: "boolean", default: "false", description: "Accent glow that follows the pointer (GSAP quickTo)." },
        ],
      },
      { part: "CardTitle", props: [{ prop: "asChild", type: "boolean", default: "false", description: "Render your own heading element." }] },
      { part: "CardFooter", props: [{ prop: "divided", type: "boolean", default: "false", description: "Dashed rule and muted tray." }] },
      { part: "CardHeader · CardLabel · CardDescription · CardAction · CardContent", props: [] },
    ],
    accessibility: [
      "A card is a plain container; give titles a heading level that fits the page outline with asChild.",
      "Interactive cards show a focus ring when any link or button inside is focused.",
      "Crop marks are a decorative pseudo-element and are never announced.",
    ],
    faq: [
      { q: "How do I make the whole card clickable?", a: "Set interactive and stretch the title link with after:absolute after:inset-0, as in the variants example." },
      { q: "Why don't I see the crop marks?", a: "They sit outside the card, so a parent with overflow: hidden clips them. Give the card some room or remove the clipping." },
    ],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    section: "Forms",
    description: "Checkboxes with a self-drawing check mark and an indeterminate state.",
    intro:
      "Checkboxes toggle independent options. In Cuelark, the check mark draws itself in when ticked, the box sits in a recessed well until checked, and the indeterminate state makes select-all patterns straightforward.",
    keywords: ["react checkbox", "shadcn checkbox", "indeterminate checkbox", "select all checkbox", "tailwind checkbox"],
    motion: "The check mark draws itself in while the box pops with a slight overshoot (GSAP cue-snap).",
    usage: {
      imports: 'import { Checkbox } from "@/components/ui/checkbox";',
      code: `<label className="flex items-center gap-2">
  <Checkbox defaultChecked /> Email me updates
</label>`,
    },
    examples: [
      { name: "checkbox-demo", title: "With labels", description: "Labels, descriptions and the disabled state." },
      { name: "checkbox-select-all", title: "Select all", description: "A parent checkbox that turns indeterminate." },
    ],
    api: [
      {
        part: "Checkbox",
        description: "Extends Radix Checkbox.Root (checked, defaultChecked, onCheckedChange, required, name, …).",
        props: [
          { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Box size." },
          { prop: "checked", type: 'boolean | "indeterminate"', description: "Controlled state." },
        ],
      },
    ],
    accessibility: [
      'Uses role="checkbox" with aria-checked="mixed" for the indeterminate state.',
      "Wrap it in a <label> or point a label at it with htmlFor and id.",
      "Space toggles; inside a form it submits like a native checkbox.",
    ],
    faq: [
      { q: "Does it work in native forms?", a: "Yes. Pass name and value; Radix renders a hidden input so the value is submitted with the form." },
      { q: "Can I disable the draw animation?", a: "It is skipped automatically for reduced motion, or remove the transition classes from the path." },
    ],
  },
  {
    slug: "dialog",
    name: "Dialog",
    section: "Overlays",
    description: "Modal dialogs with crop marks, an Esc hint and a footer tray.",
    intro:
      "A dialog interrupts the page for a focused task. Cuelark dialogs open with a short, eased rise, frame the panel in crop marks, show an Esc hint next to the close button, and can put actions in a footer tray under a dashed rule.",
    keywords: ["react dialog", "shadcn dialog", "modal component", "react modal", "tailwind dialog"],
    motion: "The panel rises into place, then its crop marks close in like a registration lock. Exits stay on CSS so Radix can wait for them.",
    usage: {
      imports: 'import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";',
      code: `<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Visible to your team.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
    },
    examples: [
      { name: "dialog-demo", title: "Form dialog", description: "A small form with a divided footer tray." },
      { name: "dialog-confirm", title: "Confirm a destructive action", description: "A plain confirmation without crop marks." },
    ],
    api: [
      { part: "Dialog", description: "Extends Radix Dialog.Root (open, defaultOpen, onOpenChange, modal).", props: [] },
      {
        part: "DialogContent",
        props: [
          { prop: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Maximum width." },
          { prop: "marks", type: "boolean", default: "true", description: "Crop marks around the panel." },
          { prop: "showClose", type: "boolean", default: "true", description: "Close button with the Esc hint." },
        ],
      },
      { part: "DialogFooter", props: [{ prop: "divided", type: "boolean", default: "false", description: "Dashed rule and muted tray." }] },
      { part: "DialogTrigger · DialogClose · DialogHeader · DialogTitle · DialogDescription", props: [] },
    ],
    accessibility: [
      "Focus moves into the dialog on open, is trapped while open, and returns to the trigger on close.",
      "DialogTitle and DialogDescription are wired to aria-labelledby and aria-describedby.",
      "Esc and a click on the overlay close it; the page behind is inert to screen readers.",
    ],
    faq: [
      { q: "How do I control it from state?", a: "Pass open and onOpenChange to Dialog, then close it from your own handlers." },
      { q: "Can it scroll when content is long?", a: "The panel is capped at the viewport height; add overflow-y-auto to DialogContent or to an inner region." },
    ],
  },
  {
    slug: "input",
    name: "Input",
    section: "Forms",
    description: "Recessed text inputs with leading and trailing add-ons.",
    intro:
      "Inputs collect short text. Cuelark inputs sit in a slightly recessed well that contrasts with raised buttons, take leading and trailing add-ons (icons, prefixes, units, keyboard hints) without extra wrappers, and show a soft focus halo and a clear invalid state.",
    keywords: ["react input", "shadcn input", "input with icon", "input group", "tailwind text field"],
    motion: "When aria-invalid turns on, the field gives a short, damped shake, so errors are noticed without a modal.",
    usage: {
      imports: 'import { Input } from "@/components/ui/input";',
      code: `<Input placeholder="Search" leading={<SearchIcon />} trailing={<kbd className="cue-kbd">/</kbd>} />`,
    },
    examples: [
      { name: "input-demo", title: "Labeled field", description: "A label, an input and a helper text wired with aria-describedby." },
      { name: "input-addons", title: "Add-ons and states", description: "Icons, a URL prefix, a keyboard hint, invalid and disabled." },
    ],
    api: [
      {
        part: "Input",
        description: "Extends native <input> props (except the numeric size attribute).",
        props: [
          { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height follows --cl-density." },
          { prop: "leading", type: "ReactNode", description: "Content before the text; wraps the input in a field group." },
          { prop: "trailing", type: "ReactNode", description: "Content after the text." },
          { prop: "aria-invalid", type: "boolean", description: "Shows the destructive border and halo." },
        ],
      },
      { part: "InputAddon", description: "The add-on wrapper, exported for custom compositions.", props: [] },
    ],
    accessibility: [
      "Always pair it with a <label> or aria-label; placeholders are not labels.",
      "Set aria-invalid and link the error text with aria-describedby.",
      "Add-ons are outside the input, so screen readers read only the value.",
    ],
    faq: [
      { q: "Where does className go when I use add-ons?", a: "To the field group wrapper, so width and margins work the same with or without add-ons." },
      { q: "Can a trailing add-on be a button?", a: "Yes. Pass any element, for example a ghost icon Button that clears the field." },
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    section: "Forms",
    description: "Toggle switches in three sizes with a stretch-on-press thumb.",
    intro:
      "A switch turns a setting on or off immediately. The Cuelark switch thumb stretches while pressed and settles when released, a small tactile cue that the press registered, and it comes in three sizes for dense settings lists.",
    keywords: ["react switch", "shadcn switch", "toggle switch", "settings toggle", "tailwind switch"],
    motion: "CSS moves the thumb; GSAP adds an elastic squash as it lands. The thumb also stretches while pressed.",
    usage: {
      imports: 'import { Switch } from "@/components/ui/switch";',
      code: `<Switch id="digest" defaultChecked />`,
    },
    examples: [
      { name: "switch-demo", title: "Sizes", description: "Small, medium, large and disabled." },
      { name: "switch-settings", title: "Settings list", description: "Labeled settings separated by dashed rules." },
    ],
    api: [
      {
        part: "Switch",
        description: "Extends Radix Switch.Root (checked, defaultChecked, onCheckedChange, name, …).",
        props: [{ prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Track and thumb size." }],
      },
    ],
    accessibility: [
      'Uses role="switch" with aria-checked.',
      "Label it with a <label htmlFor> or aria-label.",
      "Space and Enter toggle; the press animation is skipped for reduced motion.",
    ],
    faq: [
      { q: "Switch or checkbox?", a: "Use a switch for settings that apply immediately and a checkbox for choices confirmed with a submit button." },
      { q: "Does it submit with forms?", a: "Yes. Give it a name; Radix renders a hidden input." },
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    section: "Navigation",
    description: "Segmented and underline tabs with a gliding active indicator.",
    intro:
      "Tabs switch between views in the same place. Cuelark tabs have one indicator that glides and resizes to the active tab, in a segmented or underline style, and the active tab is styled before hydration too, so server-rendered pages never flash.",
    keywords: ["react tabs", "shadcn tabs", "animated tabs", "segmented control", "underline tabs"],
    motion: "One indicator moves like a caterpillar: it stretches to cover both tabs, then its trailing edge catches up (GSAP timeline).",
    usage: {
      imports: 'import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";',
      code: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="settings">…</TabsContent>
</Tabs>`,
    },
    examples: [
      { name: "tabs-demo", title: "Segmented", description: "A full-width segmented control." },
      { name: "tabs-underline", title: "Underline with icons", description: "An underline indicator that follows the label width." },
    ],
    api: [
      { part: "Tabs", description: "Extends Radix Tabs.Root (value, defaultValue, onValueChange, orientation, activationMode).", props: [] },
      {
        part: "TabsList",
        props: [{ prop: "variant", type: '"segmented" | "underline"', default: '"segmented"', description: "Indicator style." }],
      },
      { part: "TabsTrigger · TabsContent", description: "Extend the matching Radix parts.", props: [] },
    ],
    accessibility: [
      "Implements the WAI-ARIA tabs pattern: tablist, tab and tabpanel roles with selection state.",
      "Arrow keys move between tabs (vertical lists use Up and Down); Home and End jump to the ends.",
      "The indicator is decorative and its motion is disabled for reduced motion.",
    ],
    faq: [
      { q: "Do vertical tabs work?", a: 'Yes. Pass orientation="vertical" to Tabs; the indicator follows on either variant.' },
      { q: "Is the content indexed by search engines?", a: "Only the active panel is rendered. Put content you want indexed in the default tab, or render it elsewhere on the page." },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    section: "Overlays",
    description: "Inverted tooltips with keyboard shortcut hints and arrows.",
    intro:
      "Tooltips name an icon or reveal a shortcut on hover and focus. Cuelark tooltips use an inverted surface for contrast on any background, take a keyboard shortcut hint, and share warm-up delay across a toolbar so moving between buttons feels instant.",
    keywords: ["react tooltip", "shadcn tooltip", "tooltip with shortcut", "tailwind tooltip", "radix tooltip"],
    motion: "Springs out of the side it is anchored to with a small overshoot (shared popIn motion).",
    usage: {
      imports: 'import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";',
      code: `<Tooltip>
  <TooltipTrigger asChild><Button size="icon" aria-label="Bold"><BoldIcon /></Button></TooltipTrigger>
  <TooltipContent kbd="⌘B">Bold</TooltipContent>
</Tooltip>`,
    },
    examples: [
      { name: "tooltip-demo", title: "Toolbar with shortcuts", description: "Icon buttons whose tooltips show shortcuts." },
      { name: "tooltip-sides", title: "Placement", description: "Tooltips on all four sides." },
    ],
    api: [
      { part: "Tooltip", description: "Extends Radix Tooltip.Root and includes its own provider.", props: [] },
      {
        part: "TooltipContent",
        props: [
          { prop: "kbd", type: "ReactNode", description: "Keyboard shortcut after the label." },
          { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred side." },
          { prop: "sideOffset", type: "number", default: "6", description: "Distance from the trigger in px." },
        ],
      },
      {
        part: "TooltipProvider",
        props: [
          { prop: "delayDuration", type: "number", default: "150", description: "Hover delay before opening." },
          { prop: "skipDelayDuration", type: "number", default: "300", description: "Window in which the next tooltip opens instantly." },
        ],
      },
    ],
    accessibility: [
      "Opens on hover and on keyboard focus, closes on Esc.",
      "Content is linked to the trigger with aria-describedby.",
      "Never put essential information or interactive content only in a tooltip.",
    ],
    faq: [
      { q: "Does it work on touch devices?", a: "Tooltips are hover and focus affordances; on touch, show the label visibly or use a popover." },
      { q: "Why wrap a toolbar in TooltipProvider?", a: "One provider shares the skip delay, so after the first tooltip opens the next ones appear immediately." },
    ],
  },
];

export const components: ComponentDoc[] = [...coreComponents, ...moreComponents, ...effects, ...patterns, ...essentials, ...agents].sort((a, b) => a.name.localeCompare(b.name));

export const componentBySlug = new Map(components.map((c) => [c.slug, c]));

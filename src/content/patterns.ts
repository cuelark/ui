import type { ComponentDoc } from "./types.ts";

const imp = (names: string, slug: string) => `import { ${names} } from "@/components/ui/${slug}";`;

/** Everyday patterns people search for by name; each solves one concrete UX problem end to end. */
export const patterns: ComponentDoc[] = [
  {
    slug: "hold-to-confirm",
    name: "Hold to Confirm",
    section: "Actions",
    description: "Press-and-hold button for destructive actions, with a timed fill.",
    intro:
      "Hold to Confirm replaces the \"Are you sure?\" dialog for destructive actions: press and hold, a fill sweeps across the button, and the action fires only when it completes. Release early and it snaps back. It prevents accidental deletes without an extra click or modal, and works from the keyboard by holding Space or Enter.",
    keywords: ["hold to confirm button react", "press and hold button", "long press button react", "hold to delete button", "confirm delete without modal"],
    motion: "A linear fill (it is a timer) via clip-path; an early release snaps back on a strong ease-out; completion gives an elastic pulse.",
    usage: { imports: imp("HoldToConfirm", "hold-to-confirm"), code: `<HoldToConfirm onConfirm={deleteWorkspace}>Delete workspace</HoldToConfirm>` },
    examples: [{ name: "hold-to-confirm-demo", title: "Delete workspace", description: "Hold to delete; release early to cancel." }],
    api: [
      {
        part: "HoldToConfirm",
        props: [
          { prop: "onConfirm", type: "() => void", description: "Fires when the hold completes." },
          { prop: "duration", type: "number", default: "1400", description: "Hold time in ms." },
          { prop: "holdingLabel", type: "ReactNode", default: '"Keep holding…"', description: "Label while holding." },
          { prop: "variant", type: '"destructive" | "primary"', default: '"destructive"', description: "Fill color." },
        ],
      },
    ],
    accessibility: ["Holding Space or Enter confirms from the keyboard.", "The accessible name says \"press and hold\" so the interaction is discoverable."],
    faq: [
      { q: "Hold to confirm or a confirm dialog?", a: "Use hold for frequent destructive actions in a known spot; use an Alert Dialog when the consequence needs explaining." },
      { q: "How long should the hold be?", a: "1–1.5 seconds: long enough to be intentional, short enough not to annoy." },
    ],
  },
  {
    slug: "compare-slider",
    name: "Compare Slider",
    section: "Display",
    description: "Before/after comparison slider for images, themes and redesigns.",
    intro:
      "Compare Slider overlays two layers and lets people drag a handle to reveal one over the other: before/after photos, image edits, light versus dark themes, old versus new designs. It clips with a hardware-accelerated clip-path, works with images, video or any component, follows arrow keys, and gives one gentle sweep on first view so people know it moves.",
    keywords: ["before after slider react", "image comparison slider", "react compare images", "before and after image slider", "image diff slider"],
    motion: "A one-time GSAP sweep on mount hints that the handle moves; dragging is direct (no easing between pointer and handle).",
    usage: { imports: imp("CompareSlider", "compare-slider"), code: `<CompareSlider before={<img src="/before.jpg" alt="" />} after={<img src="/after.jpg" alt="" />} />` },
    examples: [{ name: "compare-slider-demo", title: "Light vs dark", description: "The same UI in both themes." }],
    api: [
      {
        part: "CompareSlider",
        props: [
          { prop: "before · after", type: "ReactNode", description: "The two layers." },
          { prop: "beforeLabel · afterLabel", type: "string", default: '"Before" · "After"', description: "Corner labels." },
          { prop: "defaultPosition", type: "number", default: "50", description: "Start position (0–100)." },
          { prop: "hover", type: "boolean", default: "false", description: "Follow the pointer without dragging." },
        ],
      },
    ],
    accessibility: ["The handle is a slider (aria-valuenow) operated with arrow keys; Shift moves 10%.", "Give meaningful images alt text."],
    faq: [{ q: "Does it work with Next.js Image?", a: "Yes. Pass any element as before and after; it is sized to fill the container." }],
  },
  {
    slug: "password-input",
    name: "Password Input",
    section: "Forms",
    description: "Password field with show/hide and a live strength meter.",
    intro:
      "Password Input is a sign-up password field with a show/hide toggle and a live strength meter. Segments fill as rules pass, each rule in the checklist ticks off with a small pop, and the strength level is announced politely, so people know what is missing before they submit.",
    keywords: ["password strength meter react", "password input with eye icon", "show hide password react", "password validation checklist", "shadcn password input"],
    motion: "Rules pop as they pass; segments transition color.",
    usage: { imports: imp("PasswordInput", "password-input"), code: `<PasswordInput name="password" placeholder="At least 8 characters" />` },
    examples: [{ name: "password-input-demo", title: "Sign-up password", description: "Type to see the meter and checklist." }],
    api: [
      {
        part: "PasswordInput",
        description: "Extends native <input> props (type is managed).",
        props: [
          { prop: "strength", type: "boolean", default: "true", description: "Show meter and checklist." },
          { prop: "rules", type: "{ label; test }[]", default: "length, number, case, symbol", description: "Your own rules." },
        ],
      },
    ],
    accessibility: ["The toggle is a pressed-state button with a clear label.", "Rule states are announced; autocomplete=\"new-password\" helps password managers."],
    faq: [{ q: "Is this real password security?", a: "It is UX guidance. Enforce your policy on the server, ideally checking breached-password lists too." }],
  },
  {
    slug: "tag-input",
    name: "Tag Input",
    section: "Forms",
    description: "Type tags into one field, with suggestions, paste and keyboard removal.",
    intro:
      "Tag Input collects several values in one field: skills, labels, recipients, keywords. Enter or a comma adds a tag, pasted comma lists split automatically, Tab accepts an inline suggestion, and Backspace on an empty field first highlights and then removes the last tag. Duplicates shake instead of being added twice.",
    keywords: ["react tag input", "tags input shadcn", "multi value input react", "chip input react", "react input with tags"],
    motion: "New tags pop in; duplicates give a short shake.",
    usage: { imports: imp("TagInput", "tag-input"), code: `<TagInput defaultValue={["React"]} suggestions={["Tailwind CSS", "GSAP"]} />` },
    examples: [{ name: "tag-input-demo", title: "Skills", description: "Suggestions, paste and keyboard removal." }],
    api: [
      {
        part: "TagInput",
        props: [
          { prop: "value / defaultValue", type: "string[]", description: "Controlled or initial tags." },
          { prop: "onValueChange", type: "(tags: string[]) => void", description: "Called on change." },
          { prop: "suggestions", type: "string[]", description: "Inline completions." },
          { prop: "max", type: "number", description: "Maximum tags." },
        ],
      },
    ],
    accessibility: ["Every tag has a labelled remove button.", "Backspace arms before deleting, so a held key never wipes the list."],
    faq: [{ q: "Can I validate tags?", a: "Filter in onValueChange, or wrap add with your own rules (e.g. email format)." }],
  },
  {
    slug: "file-dropzone",
    name: "File Dropzone",
    section: "Forms",
    description: "Drag-and-drop file upload with size checks and a file list.",
    intro:
      "File Dropzone is a drag-and-drop upload area that also works by click and keyboard. While a file is dragged over, crop marks lock onto the zone and the icon lifts; dropped files list in with a stagger, oversized files get a clear message, and any file can be removed before upload.",
    keywords: ["react file upload drag and drop", "shadcn file upload", "dropzone component react", "drag and drop upload tailwind", "react dropzone alternative"],
    motion: "Crop marks close in on drag-over; the icon lifts; new files stagger in.",
    usage: { imports: imp("FileDropzone", "file-dropzone"), code: `<FileDropzone accept="image/*" maxSize={5_000_000} onFilesChange={setFiles} />` },
    examples: [{ name: "file-dropzone-demo", title: "Upload area", description: "Drop or browse; files list below." }],
    api: [
      {
        part: "FileDropzone",
        props: [
          { prop: "onFilesChange", type: "(files: File[]) => void", description: "Accepted files." },
          { prop: "accept", type: "string", description: "Native accept filter." },
          { prop: "multiple", type: "boolean", default: "true", description: "Allow several files." },
          { prop: "maxSize", type: "number", description: "Max bytes per file." },
          { prop: "hint", type: "ReactNode", description: "Helper text." },
        ],
      },
    ],
    accessibility: ["The zone is a button: Enter or Space opens the file browser.", "Rejections are announced with role=alert."],
    faq: [{ q: "Does it upload the files?", a: "No; it hands you File objects. Upload with fetch, presigned URLs or your SDK." }],
  },
  {
    slug: "countdown",
    name: "Countdown",
    section: "Display",
    description: "Launch and sale countdown timer with flipping digits.",
    intro:
      "Countdown counts down to a launch, sale or event in day, hour, minute and second tiles; each digit flips down as it changes. The remaining time is also rendered in a <time> element, so crawlers and screen readers get a real date rather than a stream of numbers.",
    keywords: ["react countdown timer component", "countdown timer tailwind", "launch countdown react", "flip countdown", "sale countdown timer"],
    motion: "Each changing digit drops in with a short blur (GSAP).",
    usage: { imports: imp("Countdown", "countdown"), code: `<Countdown to="2026-12-01T17:00:00Z" onComplete={openSale} />` },
    examples: [{ name: "countdown-demo", title: "Launch timer", description: "Days to seconds." }],
    api: [
      {
        part: "Countdown",
        props: [
          { prop: "to", type: "Date | string | number", description: "Target moment." },
          { prop: "units", type: '("days" | "hours" | "minutes" | "seconds")[]', default: "all four", description: "Units to show." },
          { prop: "onComplete", type: "() => void", description: "Fires once at zero." },
          { prop: "labels", type: "boolean", default: "true", description: "Unit labels." },
        ],
      },
    ],
    accessibility: ["role=timer with a readable sentence; the visual tiles are aria-hidden so seconds are not announced every tick."],
    faq: [{ q: "Is the time zone handled?", a: "Pass an ISO string with a zone (or a UTC timestamp); everyone counts to the same instant." }],
  },
  {
    slug: "cookie-consent",
    name: "Cookie Consent",
    section: "Overlays",
    description: "GDPR-friendly cookie banner with equal choices and per-category toggles.",
    intro:
      "Cookie Consent is a banner that respects people: Accept all and Reject all carry equal weight, Customize expands per-category switches in place, the choice is remembered, and the page is never blocked. It slides up once, after the page has settled.",
    keywords: ["cookie consent banner react", "shadcn cookie consent", "gdpr cookie banner", "cookie popup react", "cookie preferences component"],
    motion: "Slides up once after load; the customize panel expands in place.",
    usage: { imports: imp("CookieConsent", "cookie-consent"), code: `<CookieConsent onConsent={(c) => c.analytics && loadAnalytics()} />` },
    examples: [{ name: "cookie-consent-demo", title: "Banner", description: "Inline preview with customize." }],
    api: [
      {
        part: "CookieConsent",
        props: [
          { prop: "categories", type: "{ id; label; description; required? }[]", default: "necessary, analytics, marketing", description: "Consent groups." },
          { prop: "onConsent", type: "(consent: Record<string, boolean>) => void", description: "The choice." },
          { prop: "storageKey", type: "string", default: '"cookie-consent"', description: "localStorage key." },
          { prop: "persist", type: "boolean", default: "true", description: "Remember the choice." },
          { prop: "inline", type: "boolean", default: "false", description: "Render in place." },
        ],
      },
    ],
    accessibility: ["A labelled region, not a modal: it never traps focus or blocks reading.", "Reject is as easy as Accept, as GDPR guidance expects."],
    faq: [{ q: "Is this legal advice?", a: "No. It gives you a compliant UI pattern; your legal basis and script loading are up to you." }],
  },
];

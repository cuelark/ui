"use client";

import * as React from "react";
import { CookieIcon } from "lucide-react";

import { enterOnce, gsap, motionScale } from "@/lib/motion";
import { Switch } from "@/registry/cuelark/ui/switch";
import { cn } from "@/lib/utils";

type Category = { id: string; label: string; description: string; required?: boolean };
type Consent = Record<string, boolean>;

type CookieConsentProps = {
  categories?: Category[];
  /** Called with the choice; persist it and load scripts accordingly. */
  onConsent?: (consent: Consent) => void;
  /** localStorage key; the banner stays hidden once a choice is saved. */
  storageKey?: string;
  policyHref?: string;
  /** Remember the choice in localStorage (turn off for previews and tests). */
  persist?: boolean;
  /** Render in place instead of fixed to the bottom corner. */
  inline?: boolean;
  className?: string;
};

const DEFAULTS: Category[] = [
  { id: "necessary", label: "Necessary", description: "Sign-in, security and your preferences.", required: true },
  { id: "analytics", label: "Analytics", description: "Anonymous usage that helps us improve.", },
  { id: "marketing", label: "Marketing", description: "Personalized ads on other sites." },
];

/**
 * A GDPR-friendly cookie banner: equal-weight Accept and Reject buttons, and a Customize panel with per-category
 * switches that expands in place. It slides up once, remembers the choice, and never blocks the page.
 */
function CookieConsent({ categories = DEFAULTS, onConsent, storageKey = "cookie-consent", policyHref = "/privacy", persist = true, inline = false, className }: CookieConsentProps) {
  const [open, setOpen] = React.useState(false);
  const [custom, setCustom] = React.useState(false);
  const [choice, setChoice] = React.useState<Consent>(() => Object.fromEntries(categories.map((c) => [c.id, !!c.required])));
  const ref = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!persist || !localStorage.getItem(storageKey)) setOpen(true);
  }, [storageKey, persist]);

  React.useLayoutEffect(() => {
    if (open) enterOnce(ref.current, (s) => ({ y: 24 * s, opacity: 0 }), { duration: 0.45, delay: inline ? 0.1 : 0.6 });
  }, [open]);

  React.useLayoutEffect(() => {
    const el = panel.current;
    if (!el || !custom || !motionScale(el)) return;
    gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.3, ease: "cue" });
  }, [custom]);

  const save = (consent: Consent) => {
    if (persist) localStorage.setItem(storageKey, JSON.stringify(consent));
    onConsent?.(consent);
    const el = ref.current;
    if (el && motionScale(el)) gsap.to(el, { y: 24, opacity: 0, duration: 0.25, ease: "cue", onComplete: () => setOpen(false) });
    else setOpen(false);
  };
  const all = (v: boolean) => Object.fromEntries(categories.map((c) => [c.id, c.required || v]));

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Cookie consent"
      data-slot="cookie-consent"
      className={cn(
        "grid w-full max-w-lg gap-4 rounded-2xl bg-popover p-5 text-sm text-popover-foreground shadow-overlay ring-1 ring-foreground/10",
        !inline && "fixed inset-x-3 bottom-3 z-[90] mx-auto sm:inset-x-auto sm:right-5 sm:bottom-5",
        className,
      )}
    >
      <div className="flex gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
          <CookieIcon className="size-4.5" />
        </span>
        <div className="grid gap-1">
          <p className="font-semibold">We use cookies</p>
          <p className="text-muted-foreground">
            Some keep the site working; others are optional. Choose what is fine with you.{" "}
            <a href={policyHref} className="font-medium text-foreground underline decoration-border underline-offset-4">
              Cookie policy
            </a>
          </p>
        </div>
      </div>
      {custom && (
        <div ref={panel} className="grid gap-3 overflow-hidden border-t border-border pt-4">
          {categories.map((c) => (
            <label key={c.id} className="flex items-start justify-between gap-4">
              <span className="grid gap-0.5">
                <span className="font-medium">{c.label}</span>
                <span className="text-xs text-muted-foreground">{c.description}</span>
              </span>
              <Switch size="sm" checked={choice[c.id]} disabled={c.required} onCheckedChange={(v) => setChoice((s) => ({ ...s, [c.id]: v }))} aria-label={c.label} />
            </label>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => (custom ? save(choice) : setCustom(true))}
          className="h-ctl-sm rounded-md px-3 font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {custom ? "Save choices" : "Customize"}
        </button>
        <span className="ms-auto flex gap-2">
          <button
            type="button"
            onClick={() => save(all(false))}
            className="h-ctl-sm rounded-md border border-border bg-background px-3 font-medium outline-none transition-[scale] hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={() => save(all(true))}
            className="h-ctl-sm rounded-md bg-primary px-3 font-medium text-primary-foreground outline-none transition-[scale] hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]"
          >
            Accept all
          </button>
        </span>
      </div>
    </div>
  );
}

export { CookieConsent };
export type { CookieConsentProps };

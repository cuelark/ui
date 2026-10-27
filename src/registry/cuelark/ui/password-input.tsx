"use client";

import * as React from "react";
import { CheckIcon, EyeIcon, EyeOffIcon } from "lucide-react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Rule = { label: string; test: (v: string) => boolean };

const DEFAULT_RULES: Rule[] = [
  { label: "8+ characters", test: (v) => v.length >= 8 },
  { label: "A number", test: (v) => /\d/.test(v) },
  { label: "Upper and lower case", test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: "A symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];
const LEVELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const TONE = ["bg-destructive", "bg-destructive", "bg-warning", "bg-success", "bg-success"];

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type" | "size"> & {
  /** Show the strength meter and checklist. */
  strength?: boolean;
  rules?: Rule[];
};

/**
 * Password field with a show/hide toggle and a live strength meter: four segments fill as rules pass, and each
 * rule ticks off with a small pop. Built for sign-up forms; the checklist is announced politely.
 */
function PasswordInput({ strength = true, rules = DEFAULT_RULES, className, value, defaultValue, onChange, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const [internal, setInternal] = React.useState(String(defaultValue ?? ""));
  const current = value !== undefined ? String(value) : internal;
  const passed = rules.map((r) => r.test(current));
  const score = current ? passed.filter(Boolean).length : 0;
  const listRef = React.useRef<HTMLUListElement>(null);
  const prev = React.useRef(passed);

  React.useEffect(() => {
    const list = listRef.current;
    if (list && motionScale(list))
      passed.forEach((p, i) => {
        if (p && !prev.current[i]) gsap.fromTo(list.children[i]!, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: "cue-snap" });
      });
    prev.current = passed;
  });

  return (
    <div data-slot="password-input" className={cn("grid gap-2.5", className)}>
      <div className="flex h-ctl-md items-center rounded-md border border-input bg-card shadow-well transition-[border-color,box-shadow] duration-150 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/20">
        <input
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => {
            setInternal(e.target.value);
            onChange?.(e);
          }}
          className="h-full w-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/80"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="me-1 grid size-7 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
      {strength && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-1" aria-hidden="true">
              {rules.map((_, i) => (
                <span key={i} className={cn("h-1 flex-1 rounded-full bg-muted transition-colors duration-300", i < score && TONE[score])} />
              ))}
            </div>
            <span className="w-16 text-right font-mono text-[0.6875rem] text-muted-foreground" aria-live="polite">
              {current ? LEVELS[score] : ""}
            </span>
          </div>
          <ul ref={listRef} className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs" aria-live="polite">
            {rules.map((r, i) => (
              <li key={r.label} className={cn("flex origin-left items-center gap-1.5 transition-colors", passed[i] ? "text-foreground" : "text-muted-foreground")}>
                <span className={cn("grid size-3.5 place-items-center rounded-full border transition-colors", passed[i] ? "border-success bg-success text-success-foreground" : "border-border")}>
                  {passed[i] && <CheckIcon className="size-2.5" strokeWidth={3} />}
                </span>
                {r.label}
                <span className="sr-only">{passed[i] ? "met" : "not met"}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export { PasswordInput };
export type { PasswordInputProps };

"use client";

import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type NumberFieldProps = Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "size" | "type" | "min" | "max" | "step"> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
  /** Display formatting, e.g. `{ style: "currency", currency: "USD" }`. */
  formatOptions?: Intl.NumberFormatOptions;
};

const heights = { sm: "h-ctl-sm", md: "h-ctl-md", lg: "h-ctl-lg" };

/**
 * A numeric stepper: −/+ buttons (press and hold to repeat, accelerating), arrow keys, Page Up/Down for ×10,
 * Home/End for min/max. The value slides in from the direction it moved.
 */
function NumberField({ className, value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, size = "md", formatOptions, disabled, ...props }: NumberFieldProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const [draft, setDraft] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const repeat = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = React.useRef(current);
  latest.current = current;

  const format = React.useMemo(() => new Intl.NumberFormat(undefined, formatOptions), [formatOptions]);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const commit = (next: number) => {
    const clamped = clamp(Number(next.toFixed(10)));
    if (clamped === latest.current) return;
    const direction = clamped > latest.current ? 1 : -1;
    latest.current = clamped;
    setInternal(clamped);
    onValueChange?.(clamped);
    const el = inputRef.current;
    const scale = el ? motionScale(el) : 0;
    if (el && scale) gsap.fromTo(el, { y: 8 * direction * scale, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.3, ease: "cue", overwrite: true });
  };

  const stopRepeat = () => {
    if (repeat.current) clearTimeout(repeat.current);
    repeat.current = null;
  };
  const startRepeat = (delta: number) => {
    commit(latest.current + delta);
    let delay = 380;
    const tick = () => {
      commit(latest.current + delta);
      delay = Math.max(40, delay * 0.8);
      repeat.current = setTimeout(tick, delay);
    };
    repeat.current = setTimeout(tick, delay);
  };
  React.useEffect(() => stopRepeat, []);

  const stepper = (delta: number, label: string, Icon: typeof PlusIcon) => (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      disabled={disabled || (delta > 0 ? current >= max : current <= min)}
      onPointerDown={(e) => {
        e.preventDefault();
        startRepeat(delta);
      }}
      onPointerUp={stopRepeat}
      onPointerLeave={stopRepeat}
      className={cn("inline-flex aspect-square h-full items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-accent disabled:pointer-events-none disabled:opacity-40", heights[size])}
    >
      <Icon className="size-3.5" />
    </button>
  );

  return (
    <div
      data-slot="number-field"
      className={cn(
        "inline-flex w-36 items-stretch overflow-hidden rounded-md border border-input bg-card shadow-well transition-[border-color,box-shadow] duration-150 ease-cue has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/20 has-[input:disabled]:opacity-50",
        heights[size],
        className,
      )}
    >
      {stepper(-step, "Decrease", MinusIcon)}
      <input
        ref={inputRef}
        data-slot="number-field-input"
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-valuenow={current}
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        disabled={disabled}
        value={draft ?? format.format(current)}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => setDraft(String(current))}
        onBlur={() => {
          const parsed = Number.parseFloat((draft ?? "").replace(/[^\d.-]/g, ""));
          if (Number.isFinite(parsed)) commit(parsed);
          setDraft(null);
        }}
        onKeyDown={(e) => {
          const keys: Record<string, number> = { ArrowUp: step, ArrowDown: -step, PageUp: step * 10, PageDown: -step * 10 };
          if (e.key in keys) {
            e.preventDefault();
            commit(current + keys[e.key]!);
            setDraft(null);
          } else if (e.key === "Home" && Number.isFinite(min)) commit(min);
          else if (e.key === "End" && Number.isFinite(max)) commit(max);
          else if (e.key === "Enter") e.currentTarget.blur();
        }}
        className="w-full min-w-0 flex-1 border-x border-input bg-transparent text-center text-sm font-medium tabular-nums outline-none"
        {...props}
      />
      {stepper(step, "Increase", PlusIcon)}
    </div>
  );
}

export { NumberField };
export type { NumberFieldProps };

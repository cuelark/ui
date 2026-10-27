"use client";

import * as React from "react";
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon } from "lucide-react";

import { enterOnce, gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "error" | "warning" | "info";
type ToastAction = { label: string; onClick: () => void };
type ToastInput = { description?: React.ReactNode; tone?: Tone; duration?: number; action?: ToastAction; id?: string };
type ToastData = Required<Pick<ToastInput, "tone" | "duration">> & Omit<ToastInput, "tone" | "duration"> & { id: string; title: React.ReactNode };

/* A tiny external store: `toast()` works anywhere (event handlers, mutations), the Toaster subscribes. */
let toasts: ToastData[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
let counter = 0;

function show(title: React.ReactNode, input: ToastInput = {}) {
  const id = input.id ?? `t${++counter}`;
  const data: ToastData = { tone: "default", duration: 4500, ...input, id, title };
  toasts = toasts.some((t) => t.id === id) ? toasts.map((t) => (t.id === id ? data : t)) : [...toasts, data];
  emit();
  return id;
}

function dismiss(id?: string) {
  toasts = id ? toasts.filter((t) => t.id !== id) : [];
  emit();
}

/**
 * `toast("Saved")`, `toast.success(…)`, `toast.error(…)`, `toast.promise(p, { loading, success, error })`.
 * Each call returns the toast id, which `toast.dismiss(id)` accepts.
 */
const toast = Object.assign(show, {
  success: (title: React.ReactNode, input?: ToastInput) => show(title, { ...input, tone: "success" }),
  error: (title: React.ReactNode, input?: ToastInput) => show(title, { ...input, tone: "error" }),
  warning: (title: React.ReactNode, input?: ToastInput) => show(title, { ...input, tone: "warning" }),
  info: (title: React.ReactNode, input?: ToastInput) => show(title, { ...input, tone: "info" }),
  dismiss,
  promise: <T,>(promise: Promise<T>, messages: { loading: React.ReactNode; success: React.ReactNode | ((v: T) => React.ReactNode); error: React.ReactNode | ((e: unknown) => React.ReactNode) }) => {
    const id = show(messages.loading, { duration: Infinity, tone: "info" });
    promise.then(
      (v) => show(typeof messages.success === "function" ? messages.success(v) : messages.success, { id, tone: "success" }),
      (e) => show(typeof messages.error === "function" ? messages.error(e) : messages.error, { id, tone: "error" }),
    );
    return promise;
  },
});

const icons: Record<Tone, React.ComponentType<{ className?: string }> | null> = {
  default: null,
  success: CheckCircle2Icon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
};
const toneColor: Record<Tone, string> = { default: "text-foreground", success: "text-success", error: "text-destructive", warning: "text-warning", info: "text-primary" };

type ToasterProps = { position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "bottom-center" | "top-center"; className?: string };

/** Mount once near the root. Toasts rise in, show a hairline countdown that pauses on hover, and slide away. */
function Toaster({ position = "bottom-right", className }: ToasterProps) {
  const items = React.useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts,
    () => toasts,
  );
  const top = position.startsWith("top");

  return (
    <section
      aria-label="Notifications"
      data-slot="toaster"
      className={cn(
        "pointer-events-none fixed z-[100] flex w-full max-w-sm flex-col gap-2 p-4",
        top ? "top-0 flex-col-reverse" : "bottom-0",
        position.endsWith("right") && "right-0",
        position.endsWith("left") && "left-0",
        position.endsWith("center") && "left-1/2 -translate-x-1/2",
        className,
      )}
    >
      {items.map((t) => (
        <ToastItem key={t.id} toast={t} fromTop={top} />
      ))}
    </section>
  );
}

function ToastItem({ toast: t, fromTop }: { toast: ToastData; fromTop: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const bar = React.useRef<HTMLSpanElement>(null);
  const timer = React.useRef<gsap.core.Tween | null>(null);
  const Icon = icons[t.tone];

  const close = React.useCallback(() => {
    const el = ref.current;
    timer.current?.kill();
    if (!el || !motionScale(el)) return dismiss(t.id);
    gsap.to(el, { x: 32, opacity: 0, height: 0, marginTop: -8, paddingTop: 0, paddingBottom: 0, duration: 0.35, ease: "cue", onComplete: () => dismiss(t.id) });
  }, [t.id]);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scale = motionScale(el);
    if (scale) enterOnce(el, (s) => ({ y: (fromTop ? -16 : 16) * s, opacity: 0, scale: 1 - 0.04 * s }), { duration: 0.45, ease: "cue-snap" });
  }, [fromTop]);

  React.useEffect(() => {
    timer.current?.kill();
    if (!Number.isFinite(t.duration) || !bar.current) return;
    timer.current = gsap.fromTo(bar.current, { scaleX: 1 }, { scaleX: 0, duration: t.duration / 1000, ease: "none", onComplete: close });
    return () => {
      timer.current?.kill();
    };
  }, [t.duration, t.title, close]);

  return (
    <div
      ref={ref}
      role={t.tone === "error" ? "alert" : "status"}
      aria-live={t.tone === "error" ? "assertive" : "polite"}
      data-slot="toast"
      data-tone={t.tone}
      onPointerEnter={() => timer.current?.pause()}
      onPointerLeave={() => timer.current?.resume()}
      onFocus={() => timer.current?.pause()}
      onBlur={() => timer.current?.resume()}
      className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl bg-popover ring-1 ring-foreground/10 p-3.5 pe-9 text-sm text-popover-foreground shadow-overlay"
    >
      {Icon && <Icon className={cn("mt-0.5 size-4 shrink-0", toneColor[t.tone])} />}
      <div className="grid flex-1 gap-0.5">
        <div className="font-medium">{t.title}</div>
        {t.description && <div className="text-muted-foreground">{t.description}</div>}
        {t.action && (
          <button
            type="button"
            onClick={() => {
              t.action?.onClick();
              close();
            }}
            className="mt-1.5 w-fit rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={close}
        className="absolute top-3 right-3 rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <XIcon className="size-4" />
      </button>
      {Number.isFinite(t.duration) && <span ref={bar} aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-px origin-left bg-current opacity-40", toneColor[t.tone])} />}
    </div>
  );
}

export { Toaster, toast };
export type { ToasterProps, ToastInput };

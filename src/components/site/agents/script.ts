import * as React from "react";

/** One moment of a scripted agent run: it lasts `ms`, or waits for `next()` when it is a gate (an approval). */
export type Beat = { id: string; ms?: number; gate?: boolean };

/** How long a gate counts for on the trace when the run is shown finished without having been played. */
const GATE_NOMINAL_S = 2.4;
/** Clock resolution while playing: smooth enough for streaming text and live trace bars, cheap enough to re-render. */
const TICK_MS = 33;

/**
 * Drives a scripted run. It starts finished, so the server renders (and crawlers read) the complete transcript and
 * every part is inspectable at once; `play()` replays it from the first beat.
 *
 * `step` counts finished beats: beat i is running while step === i. Times come from the real playback once it has
 * been played, otherwise from the nominal beat lengths, so the trace always has believable spans.
 */
export function useScript(beats: readonly Beat[]) {
  const end = beats.length;
  const [step, setStep] = React.useState(end);
  const [playing, setPlaying] = React.useState(false);
  const [clock, setClock] = React.useState(0);
  const t0 = React.useRef(0);
  const marks = React.useRef<number[]>([]);

  const index = React.useMemo(() => new Map(beats.map((b, i) => [b.id, i])), [beats]);
  // nominal[i] = when beat i starts; nominal[end] = the whole run.
  const nominal = React.useMemo(() => {
    const out = [0];
    for (const b of beats) out.push(out.at(-1)! + (b.gate ? GATE_NOMINAL_S : (b.ms ?? 0) / 1000));
    return out;
  }, [beats]);

  React.useEffect(() => {
    if (!playing) return;
    marks.current[step] ??= (performance.now() - t0.current) / 1000;
    if (step >= end) return setPlaying(false);
    const beat = beats[step]!;
    if (beat.gate) return;
    const id = setTimeout(() => setStep((s) => s + 1), beat.ms ?? 0);
    return () => clearTimeout(id);
  }, [playing, step, end, beats]);

  React.useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = 0;
    const loop = (ts: number) => {
      if (ts - last >= TICK_MS) {
        last = ts;
        setClock((performance.now() - t0.current) / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const real = marks.current.length > 0;
  const i = (id: string) => {
    const n = index.get(id);
    if (n === undefined) throw new Error(`Unknown beat "${id}"`);
    return n;
  };
  const start = (id: string) => (real ? (marks.current[i(id)] ?? clock) : nominal[i(id)]!);
  const now = real ? (step >= end ? (marks.current[end] ?? clock) : clock) : nominal[end]!;

  return {
    playing,
    finished: step >= end,
    now,
    /** The beat has started (it is running or done). */
    at: (id: string) => step >= i(id),
    /** The beat is done. */
    has: (id: string) => step > i(id),
    /** The beat is running right now. */
    during: (id: string) => step === i(id),
    /** 0 → 1 through a timed beat. */
    frac: (id: string) => {
      const n = i(id);
      if (step !== n) return step > n ? 1 : 0;
      const ms = beats[n]!.ms ?? 0;
      return ms ? Math.min(1, Math.max(0, (clock - start(id)) / (ms / 1000))) : 0;
    },
    /** When the beat started and (once done) ended, in seconds from the start of the run. */
    span: (id: string) => {
      const n = i(id);
      return { start: start(id), end: step > n ? (real ? marks.current[n + 1] : nominal[n + 1]) : undefined };
    },
    play: () => {
      marks.current = [];
      t0.current = performance.now();
      setClock(0);
      setStep(0);
      setPlaying(true);
    },
    /** Release the gate the run is waiting on. */
    next: () => setStep((s) => (beats[s]?.gate ? s + 1 : s)),
    /** Halt where it is (e.g. a rejected plan). */
    stop: () => setPlaying(false),
  };
}

export type Script = ReturnType<typeof useScript>;

/** How many of `n` items have arrived during a timed beat. */
export const count = (s: Script, id: string, n: number) => Math.min(n, Math.ceil(s.frac(id) * n));

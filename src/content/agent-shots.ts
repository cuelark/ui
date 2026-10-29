/**
 * Optional screenshots of the /agents demos, keyed by `zone:<id>`, `component:<slug>` and `scenario:<slug>`.
 * Empty by default: the page renders without them, and shows an image wherever an entry exists.
 */
export type Shot = { src: string; width: number; height: number };

export const SHOTS: Record<string, Shot> = {};

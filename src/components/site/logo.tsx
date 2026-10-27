import { cn } from "@/lib/utils";

/** The Cuelark "bubble-lark" glyph (24-unit grid), same geometry as the brand package. */
const GLYPH = {
  body: "M4.6 11.55a7.2 7.2 0 1 1 14.4 0a7.2 7.2 0 1 1-14.4 0z M8.6 16.7L4.45 19.05a.7.7 0 0 1-1.1-.75L5.8 13.6z M18 9.75l3 1.25a.5.5 0 0 1 0 .9l-3 1.25z",
  eye: { cx: 15, cy: 9.95, r: 1.15 },
  shine: "M6.73 9.7A5.4 5.4 0 0 1 11.33 6.17",
};

export function Glyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-6", className)}>
      <path d={GLYPH.body} fill="#3074FE" />
      <circle {...GLYPH.eye} fill="#fff" />
      <path d={GLYPH.shine} stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <Glyph />
      <span>
        Cuelark <span className="text-muted-foreground">UI</span>
      </span>
    </span>
  );
}

export function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={cn("size-4", className)}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

import { ArrowUpRightIcon } from "lucide-react";

import type { IconSetMeta } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** "MIT" → "MIT license"; "MPL-2.0 license" stays as is. */
export const licenseLabel = (license: string) => (/licen[sc]e/i.test(license) ? license.replace(/ license$/i, " license").replace(/ License$/, " license") : `${license} license`);

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/**
 * Where an icon set comes from and how it may be used: its license and its project, linked to the original sources,
 * the way react-icons credits every set. Shown on set pages, icon pages and in the explorer.
 */
export function IconLicense({ set, className, compact = false }: { set: Pick<IconSetMeta, "license" | "licenseUrl" | "projectUrl" | "name">; className?: string; compact?: boolean }) {
  const link = "inline-flex items-center gap-1 font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";
  if (compact)
    return (
      <span className={cn("inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground", className)}>
        <a href={set.licenseUrl} target="_blank" rel="noopener nofollow" className={link}>
          {licenseLabel(set.license)}
        </a>
        <a href={set.projectUrl} target="_blank" rel="noopener nofollow" className={link}>
          {host(set.projectUrl)}
        </a>
      </span>
    );
  return (
    <dl className={cn("grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-xl border border-border bg-card px-4 py-3 text-sm", className)}>
      <dt className="text-muted-foreground">License</dt>
      <dd>
        <a href={set.licenseUrl} target="_blank" rel="noopener nofollow license" className={link}>
          {licenseLabel(set.license)} <ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
        </a>
      </dd>
      <dt className="text-muted-foreground">Project</dt>
      <dd>
        <a href={set.projectUrl} target="_blank" rel="noopener nofollow" className={link}>
          {host(set.projectUrl)} <ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
        </a>
      </dd>
    </dl>
  );
}

/** One-line attribution people can paste into a README or credits page. */
export const attribution = (iconTitle: string, set: Pick<IconSetMeta, "name" | "license" | "projectUrl">) =>
  `"${iconTitle}" icon from ${set.name} (${set.projectUrl}), licensed under ${licenseLabel(set.license)}.`;

"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva("relative flex shrink-0 overflow-visible select-none", {
  variants: {
    size: { xs: "size-6 text-[0.625rem]", sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-base", xl: "size-20 text-xl" },
    shape: { circle: "rounded-full", square: "rounded-lg" },
  },
  defaultVariants: { size: "md", shape: "circle" },
});

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants> & {
    /** A presence dot at the bottom-right corner. */
    status?: "online" | "away" | "busy" | "offline";
  };

const statusColor = { online: "bg-success", away: "bg-warning", busy: "bg-destructive", offline: "bg-muted-foreground" };

function Avatar({ className, size, shape, status, children, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root data-slot="avatar" data-shape={shape ?? "circle"} className={cn(avatarVariants({ size, shape }), className)} {...props}>
      {children}
      {status && (
        <span
          data-slot="avatar-status"
          role="img"
          aria-label={status}
          className={cn("absolute end-0 bottom-0 size-[28%] min-h-2 min-w-2 rounded-full ring-2 ring-background", statusColor[status])}
        />
      )}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full rounded-[inherit] object-cover", className)} {...props} />;
}

/** Shows `name`'s initials (deterministically tinted) while the image loads or if it fails. */
function AvatarFallback({ className, name, children, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback> & { name?: string }) {
  const initials = name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  const hue = name ? [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7) : 263;
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center rounded-[inherit] font-medium ring-1 ring-inset ring-black/5", className)}
      style={{ background: `oklch(0.93 0.05 ${hue})`, color: `oklch(0.4 0.12 ${hue})` }}
      {...props}
    >
      {children ?? initials}
    </AvatarPrimitive.Fallback>
  );
}

/** Overlapping avatars that fan apart on hover; extra people collapse into a "+N" tile. */
function AvatarGroup({ className, max, children, ...props }: React.ComponentProps<"div"> & { max?: number }) {
  const items = React.Children.toArray(children);
  const shown = max ? items.slice(0, max) : items;
  const rest = items.length - shown.length;
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatars flex items-center *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:transition-[margin] *:data-[slot=avatar]:duration-300 *:data-[slot=avatar]:ease-cue *:data-[slot=avatar]:not-first:-ms-2.5 hover:*:data-[slot=avatar]:not-first:-ms-1",
        className,
      )}
      {...props}
    >
      {shown}
      {rest > 0 && (
        <span data-slot="avatar" className="relative z-0 flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs text-muted-foreground ring-2 ring-background">
          +{rest}
        </span>
      )}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
export type { AvatarProps };

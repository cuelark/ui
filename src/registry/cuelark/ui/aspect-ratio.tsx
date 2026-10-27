"use client";

import * as React from "react";
import { AspectRatio as AspectRatioPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/** Keeps content at a fixed ratio (images, video, maps) so layout never shifts while media loads. */
function AspectRatio({ className, ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" className={cn("overflow-hidden rounded-[inherit]", className)} {...props} />;
}

export { AspectRatio };

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A styled native <select>: the platform picker on mobile, autofill and form submission for free, zero JavaScript.
 * Reach for it in long forms and on mobile-heavy pages; use Select when you need custom option content.
 */
function NativeSelect({ className, size = "md", ...props }: Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "md" | "lg" }) {
  return (
    <div data-slot="native-select" className={cn("relative w-fit", className)}>
      <select
        className={cn(
          "w-full min-w-40 appearance-none rounded-md border border-input bg-card ps-3 pe-9 text-sm shadow-control outline-none transition-[border-color,box-shadow] duration-150 ease-cue hover:border-ring/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
          { sm: "h-ctl-sm text-[0.8125rem]", md: "h-ctl-md", lg: "h-ctl-lg" }[size],
        )}
        {...props}
      />
      <ChevronDownIcon aria-hidden="true" className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export { NativeSelect };

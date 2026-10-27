import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Joins buttons into one control (split buttons, toolbars, pagination): inner corners square off, borders merge,
 * and the focused button rises above its neighbours so its ring is never clipped.
 */
function ButtonGroup({ className, orientation = "horizontal", ...props }: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "isolate inline-flex w-fit *:focus-visible:z-10",
        orientation === "horizontal"
          ? "*:not-first:rounded-s-none *:not-last:rounded-e-none *:not-first:-ms-px"
          : "flex-col *:not-first:rounded-t-none *:not-last:rounded-b-none *:not-first:-mt-px",
        className,
      )}
      {...props}
    />
  );
}

/** A thin rule between grouped buttons. */
function ButtonGroupSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="separator" data-slot="button-group-separator" className={cn("z-10 w-px self-stretch bg-current/15", className)} {...props} />;
}

export { ButtonGroup, ButtonGroupSeparator };

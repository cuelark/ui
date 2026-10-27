"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";

import { gsap, motionScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

function InputOTP({ className, containerClassName, ...props }: React.ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center gap-1.5", className)} {...props} />;
}

/** Each digit drops into its slot with a small spring (GSAP) as it is typed or pasted. */
function InputOTPSlot({ index, className, ...props }: React.ComponentProps<"div"> & { index: number }) {
  const context = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = context?.slots[index] ?? {};
  const charRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = charRef.current;
    if (!char || !el) return;
    const scale = motionScale(el);
    if (scale) gsap.fromTo(el, { y: -6 * scale, scale: 1 + 0.25 * scale, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.35, ease: "cue-snap", overwrite: true });
  }, [char]);

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-ctl-lg w-10 items-center justify-center rounded-md border border-input bg-card font-mono text-lg font-medium shadow-well transition-[border-color,box-shadow] duration-150 ease-cue aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/20",
        className,
      )}
      {...props}
    >
      <span ref={charRef}>{char}</span>
      {hasFakeCaret && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-5 w-px animate-pulse bg-foreground duration-1000" />
        </span>
      )}
    </div>
  );
}

function InputOTPSeparator(props: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" aria-hidden="true" className="w-3 text-center font-mono text-muted-foreground" {...props}>
      –
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

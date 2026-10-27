import { Countdown } from "@/registry/cuelark/ui/countdown";

const launch = Date.UTC(2026, 11, 1, 17, 0, 0);

export default function CountdownDemo() {
  return (
    <div className="grid justify-items-center gap-4">
      <span className="cue-label">Launch · Dec 1, 17:00 UTC</span>
      <Countdown to={launch} />
    </div>
  );
}

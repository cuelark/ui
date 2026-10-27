import { Badge } from "@/registry/cuelark/ui/badge";
import { Timeline, TimelineDescription, TimelineItem, TimelineTime, TimelineTitle } from "@/registry/cuelark/ui/timeline";

const releases = [
  { date: "2026-10-27", version: "1.0", title: "Cuelark UI 1.0", text: "52 components, GSAP motion tokens and the live theme editor." },
  { date: "2026-10-12", version: "0.9", title: "Motion layer", text: "One --cl-motion knob scales every animation, and reduced motion always wins." },
  { date: "2026-09-30", version: "0.8", title: "Crop marks", text: "The signature cue marks land on cards, dialogs and popovers." },
];

export default function TimelineDemo() {
  return (
    <Timeline animate className="w-full max-w-md">
      {releases.map((r) => (
        <TimelineItem key={r.version}>
          <div className="flex items-center gap-2">
            <TimelineTime dateTime={r.date}>{r.date}</TimelineTime>
            <Badge mono size="sm" variant="primary">
              v{r.version}
            </Badge>
          </div>
          <TimelineTitle>{r.title}</TimelineTitle>
          <TimelineDescription>{r.text}</TimelineDescription>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

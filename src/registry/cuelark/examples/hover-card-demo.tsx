import { Avatar, AvatarFallback } from "@/registry/cuelark/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/cuelark/ui/hover-card";

export default function HoverCardDemo() {
  return (
    <p className="text-sm text-muted-foreground">
      Designed by{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <a href="#" className="font-medium text-foreground underline decoration-dashed underline-offset-4">
            @cuelark
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="flex gap-3">
          <Avatar>
            <AvatarFallback name="Cue Lark" />
          </Avatar>
          <div className="grid gap-1 text-sm">
            <span className="font-medium text-foreground">Cuelark</span>
            <span className="text-muted-foreground">Precision components for shadcn/ui.</span>
            <span className="cue-label">Joined 2026</span>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      and the community.
    </p>
  );
}

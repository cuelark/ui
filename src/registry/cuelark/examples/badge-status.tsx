import { Badge } from "@/registry/cuelark/ui/badge";

export default function BadgeStatus() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="success" dot="pulse">
          Live
        </Badge>
        <Badge variant="warning" dot>
          Degraded
        </Badge>
        <Badge variant="destructive" dot>
          Offline
        </Badge>
        <Badge dot>Draft</Badge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge mono size="sm">
          v1.0
        </Badge>
        <Badge mono size="sm" variant="primary">
          New
        </Badge>
        <Badge asChild variant="outline" mono size="sm">
          <a href="#changelog">Changelog</a>
        </Badge>
      </div>
    </div>
  );
}

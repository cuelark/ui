import { Kbd, KbdGroup } from "@/registry/cuelark/ui/kbd";

export default function KbdDemo() {
  return (
    <div className="grid gap-3 text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        Search <KbdGroup keys={["⌘", "K"]} />
      </p>
      <p className="flex items-center gap-2">
        Command palette <KbdGroup keys={["Ctrl", "Shift", "P"]} separator="+" />
      </p>
      <p className="flex items-center gap-2">
        Close <Kbd>Esc</Kbd>
      </p>
    </div>
  );
}

import * as React from "react";
import { CalculatorIcon, CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/registry/cuelark/ui/command";

function Items() {
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem><CalendarIcon /> Calendar</CommandItem>
        <CommandItem><SmileIcon /> Search emoji</CommandItem>
        <CommandItem><CalculatorIcon /> Calculator</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem><UserIcon /> Profile <CommandShortcut>⌘P</CommandShortcut></CommandItem>
        <CommandItem><CreditCardIcon /> Billing <CommandShortcut>⌘B</CommandShortcut></CommandItem>
        <CommandItem><SettingsIcon /> Settings <CommandShortcut>⌘,</CommandShortcut></CommandItem>
      </CommandGroup>
    </>
  );
}

export default function CommandDemo() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <Command className="rounded-xl border border-border shadow-raised">
        <CommandInput placeholder="Type a command or search…" />
        <CommandList className="max-h-56">
          <Items />
        </CommandList>
      </Command>
      <Button variant="secondary" size="sm" kbd="⌘J" onClick={() => setOpen(true)}>
        Open palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <Items />
        </CommandList>
      </CommandDialog>
    </div>
  );
}

import { CalendarIcon, FolderIcon, HomeIcon, MailIcon, MusicIcon, SettingsIcon, TerminalIcon } from "lucide-react";

import { Dock, DockItem, DockSeparator } from "@/registry/cuelark/ui/dock";

export default function DockDemo() {
  return (
    <div className="flex h-40 w-full items-end justify-center pb-2">
      <Dock>
        <DockItem label="Home" active><HomeIcon /></DockItem>
        <DockItem label="Mail"><MailIcon /></DockItem>
        <DockItem label="Calendar"><CalendarIcon /></DockItem>
        <DockItem label="Music"><MusicIcon /></DockItem>
        <DockItem label="Terminal" active><TerminalIcon /></DockItem>
        <DockSeparator />
        <DockItem label="Files"><FolderIcon /></DockItem>
        <DockItem label="Settings"><SettingsIcon /></DockItem>
      </Dock>
    </div>
  );
}

import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/registry/cuelark/ui/toggle-group";

export default function ToggleGroupDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <ToggleGroup type="single" defaultValue="month" aria-label="Range">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>
      <div className="flex gap-4">
        <ToggleGroup type="single" variant="outline" defaultValue="left" aria-label="Alignment">
          <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="multiple" variant="ghost" defaultValue={["bold"]} aria-label="Formatting">
          <ToggleGroupItem value="bold" aria-label="Bold"><BoldIcon /></ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline"><UnderlineIcon /></ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

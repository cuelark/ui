import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/registry/cuelark/ui/button-group";

export default function ButtonGroupDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Snooze</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>Publish</Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="More publish options">
          <ChevronDownIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Previous">
          <ChevronLeftIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="Next">
          <ChevronRightIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}

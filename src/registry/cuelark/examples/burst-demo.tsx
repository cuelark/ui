import { PartyPopperIcon } from "lucide-react";

import { Burst } from "@/registry/cuelark/ui/burst";
import { Button } from "@/registry/cuelark/ui/button";

export default function BurstDemo() {
  return (
    <Burst>
      <Button size="lg" pill>
        <PartyPopperIcon /> Celebrate
      </Button>
    </Burst>
  );
}

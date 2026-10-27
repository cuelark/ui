import { ArrowRightIcon, HeartIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { Magnetic } from "@/registry/cuelark/ui/magnetic";

export default function MagneticDemo() {
  return (
    <div className="flex items-center gap-8 p-10">
      <Magnetic>
        <Button size="lg">
          Get started <ArrowRightIcon />
        </Button>
      </Magnetic>
      <Magnetic strength={0.5}>
        <Button variant="secondary" size="icon-lg" aria-label="Sponsor">
          <HeartIcon />
        </Button>
      </Magnetic>
    </div>
  );
}

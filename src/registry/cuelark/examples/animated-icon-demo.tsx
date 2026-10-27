import { ArrowRightIcon, BellIcon, HeartIcon, RefreshCwIcon, RocketIcon, SearchIcon, SendIcon, SettingsIcon, SparklesIcon, Trash2Icon } from "lucide-react";

import { AnimatedIcon } from "@/registry/cuelark/ui/animated-icon";

const icons = [BellIcon, ArrowRightIcon, SettingsIcon, SendIcon, HeartIcon, RefreshCwIcon, Trash2Icon, SearchIcon, SparklesIcon, RocketIcon];

export default function AnimatedIconDemo() {
  return (
    <div className="grid gap-4 text-center">
      <ul className="grid grid-cols-5 gap-2">
        {icons.map((Icon, i) => (
          <li key={i}>
            <AnimatedIcon className="grid size-14 place-items-center rounded-xl border border-border bg-card text-2xl shadow-control">
              <Icon />
            </AnimatedIcon>
          </li>
        ))}
      </ul>
      <span className="cue-label">Hover: each icon picks its own motion</span>
    </div>
  );
}

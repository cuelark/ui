import { CreditCardIcon, GitPullRequestIcon, MessageSquareIcon, UserPlusIcon } from "lucide-react";

import { AnimatedList } from "@/registry/cuelark/ui/animated-list";

const events = [
  { icon: CreditCardIcon, title: "Payment received", detail: "$240 from Atlas Labs", time: "now" },
  { icon: UserPlusIcon, title: "New member", detail: "Grace joined Borealis", time: "1m" },
  { icon: GitPullRequestIcon, title: "Pull request merged", detail: "feat: motion tokens", time: "3m" },
  { icon: MessageSquareIcon, title: "New comment", detail: "“Ship it.” on Roadmap", time: "6m" },
];

export default function AnimatedListDemo() {
  return (
    <AnimatedList className="h-80 w-full max-w-sm content-start overflow-hidden">
      {events.map(({ icon: Icon, title, detail, time }) => (
        <div key={title} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-control">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted [&_svg]:size-4">
            <Icon />
          </span>
          <div className="grid flex-1 text-sm">
            <span className="font-medium">{title}</span>
            <span className="text-muted-foreground">{detail}</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">{time}</span>
        </div>
      ))}
    </AnimatedList>
  );
}

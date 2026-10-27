import { InboxIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { Empty, EmptyActions, EmptyDescription, EmptyIcon, EmptyTitle } from "@/registry/cuelark/ui/empty";

export default function EmptyDemo() {
  return (
    <Empty className="max-w-lg">
      <EmptyIcon>
        <InboxIcon />
      </EmptyIcon>
      <EmptyTitle>No messages yet</EmptyTitle>
      <EmptyDescription>When customers write in, their conversations land here. Connect a channel to get started.</EmptyDescription>
      <EmptyActions>
        <Button>Connect email</Button>
        <Button variant="ghost">Read the guide</Button>
      </EmptyActions>
    </Empty>
  );
}

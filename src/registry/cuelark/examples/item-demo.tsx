import { BellIcon, ChevronRightIcon, ShieldCheckIcon } from "lucide-react";

import { Badge } from "@/registry/cuelark/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/registry/cuelark/ui/item";
import { Switch } from "@/registry/cuelark/ui/switch";

export default function ItemDemo() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <Item variant="outline">
        <ItemMedia>
          <BellIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Push notifications</ItemTitle>
          <ItemDescription>Mentions, replies and deploy results.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Switch defaultChecked aria-label="Push notifications" />
        </ItemActions>
      </Item>
      <Item variant="outline" asChild>
        <a href="#security">
          <ItemMedia>
            <ShieldCheckIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Two-factor authentication</ItemTitle>
            <ItemDescription>Protect your account with a second step.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="success" size="sm" dot>
              On
            </Badge>
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          </ItemActions>
        </a>
      </Item>
    </div>
  );
}

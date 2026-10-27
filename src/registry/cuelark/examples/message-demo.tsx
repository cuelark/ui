import { CopyIcon, RefreshCwIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { Message, MessageAction, MessageActions, MessageAvatar, MessageContent } from "@/registry/cuelark/ui/message";

export default function MessageDemo() {
  return (
    <div className="grid w-full max-w-xl gap-6">
      <Message from="user">
        <MessageContent>Can you summarize what changed in the billing service this week?</MessageContent>
      </Message>
      <Message from="assistant">
        <MessageAvatar className="bg-foreground text-background">C</MessageAvatar>
        <MessageContent>
          <p>
            Three changes shipped: proration now rounds to the cent, failed renewals retry twice before emailing the customer, and invoices include the tax ID when one is on file.
          </p>
          <MessageActions>
            <MessageAction label="Copy"><CopyIcon /></MessageAction>
            <MessageAction label="Regenerate"><RefreshCwIcon /></MessageAction>
            <MessageAction label="Good response"><ThumbsUpIcon /></MessageAction>
            <MessageAction label="Bad response"><ThumbsDownIcon /></MessageAction>
          </MessageActions>
        </MessageContent>
      </Message>
    </div>
  );
}

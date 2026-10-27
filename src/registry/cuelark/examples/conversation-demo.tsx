import { Conversation, ConversationContent } from "@/registry/cuelark/ui/conversation";
import { Message, MessageContent } from "@/registry/cuelark/ui/message";

const turns = [
  ["user", "What's the fastest way to add dark mode?"],
  ["assistant", "Put your colors in CSS variables, define a .dark block, and toggle the class on <html>. Cuelark's theme already does this."],
  ["user", "And to avoid a flash on load?"],
  ["assistant", "Run a tiny inline script in <head> that reads the saved preference and sets the class before the first paint."],
  ["user", "Can the user override the system setting?"],
  ["assistant", "Yes: store their choice in localStorage and only fall back to prefers-color-scheme when nothing is saved."],
] as const;

export default function ConversationDemo() {
  return (
    <Conversation className="h-80 w-full max-w-lg rounded-2xl border border-border bg-background">
      <ConversationContent>
        {turns.map(([from, text], i) => (
          <Message key={i} from={from}>
            <MessageContent>{text}</MessageContent>
          </Message>
        ))}
      </ConversationContent>
    </Conversation>
  );
}

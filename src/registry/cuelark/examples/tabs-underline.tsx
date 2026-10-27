import { CodeIcon, EyeIcon, TerminalIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";

export default function TabsUnderline() {
  return (
    <Tabs defaultValue="preview" className="w-full max-w-md">
      <TabsList variant="underline">
        <TabsTrigger value="preview">
          <EyeIcon />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon />
          Code
        </TabsTrigger>
        <TabsTrigger value="cli">
          <TerminalIcon />
          CLI
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="text-sm text-muted-foreground">
        The indicator glides to the active tab and resizes with its label.
      </TabsContent>
      <TabsContent value="code" className="text-sm text-muted-foreground">
        Arrow keys move between tabs; Home and End jump to the ends.
      </TabsContent>
      <TabsContent value="cli" className="text-sm text-muted-foreground">
        Install with one command and own the source.
      </TabsContent>
    </Tabs>
  );
}

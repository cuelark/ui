import * as React from "react";
import { RotateCcwIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";
import { CodeBlock } from "./code-block";
import { examples } from "./examples";
import { cn } from "@/lib/utils";

type ComponentPreviewProps = {
  name: string;
  code?: { code: string; html: string };
  className?: string;
};

/** A live example in a crop-marked stage, with its source one tab away and a replay button for motion. */
export function ComponentPreview({ name, code, className }: ComponentPreviewProps) {
  const Example = examples[name];
  const [run, setRun] = React.useState(0);
  if (!Example) return null;

  return (
    <Tabs defaultValue="preview" className={cn("gap-0", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <TabsList variant="underline">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <Button variant="ghost" size="xs" onClick={() => setRun((r) => r + 1)} aria-label="Replay example">
          <RotateCcwIcon /> Replay
        </Button>
      </div>
      <TabsContent value="preview">
        <div className="cue-marks relative rounded-xl border border-border bg-card">
          <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-[inherit] p-6 sm:p-10">
            <div key={run} className="relative flex w-full justify-center">
              <Example />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="code">{code && <CodeBlock code={code.code} html={code.html} collapsible />}</TabsContent>
    </Tabs>
  );
}

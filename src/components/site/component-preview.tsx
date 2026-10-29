import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ExternalLinkIcon, Maximize2Icon, RotateCcwIcon, XIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";
import { CodeBlock } from "./code-block";
import { examples } from "./examples";
import { PreviewThemePicker, ThemeScope, usePreviewTheme } from "./theme-scope";
import { cn } from "@/lib/utils";

type ComponentPreviewProps = {
  name: string;
  code?: { code: string; html: string };
  className?: string;
};

/**
 * A live example in a crop-marked stage, with its source one tab away. The toolbar picks the preview's theme and
 * mode (shared by every preview), replays motion, and opens the example full screen or in its own tab.
 */
export function ComponentPreview({ name, code, className }: ComponentPreviewProps) {
  const Example = examples[name];
  const [run, setRun] = React.useState(0);
  const [full, setFull] = React.useState(false);
  const { theme, mode } = usePreviewTheme();
  if (!Example) return null;

  return (
    <Tabs defaultValue="preview" className={cn("gap-0", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <TabsList variant="underline">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-1">
          <PreviewThemePicker />
          <Button variant="ghost" size="icon-sm" onClick={() => setRun((r) => r + 1)} aria-label="Replay example" title="Replay">
            <RotateCcwIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setFull(true)} aria-label="Open full screen" title="Full screen">
            <Maximize2Icon />
          </Button>
        </div>
      </div>
      <TabsContent value="preview">
        <ThemeScope theme={theme} mode={mode} className="cue-marks relative rounded-xl border border-border bg-card">
          <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-[inherit] p-4 sm:p-10">
            <div key={run} className="relative flex w-full min-w-0 justify-center [&>*]:max-w-full [&>*]:min-w-0">
              <Example />
            </div>
          </div>
        </ThemeScope>
      </TabsContent>
      <TabsContent value="code">{code && <CodeBlock code={code.code} html={code.html} collapsible />}</TabsContent>
      <FullScreenPreview name={name} open={full} onOpenChange={setFull} />
    </Tabs>
  );
}

/** The example on its own, filling the screen: theme and mode controls, replay, a new-tab link, Esc to close. */
export function FullScreenPreview({ name, open, onOpenChange }: { name: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const Example = examples[name];
  const [run, setRun] = React.useState(0);
  const { theme, mode } = usePreviewTheme();
  if (!Example) return null;
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[100] flex flex-col bg-background outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-200"
        >
          <PreviewBar name={name} onReplay={() => setRun((r) => r + 1)}>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close full screen" title="Close (Esc)">
                <XIcon />
              </Button>
            </DialogPrimitive.Close>
          </PreviewBar>
          <ThemeScope theme={theme} mode={mode} className="relative flex min-h-0 flex-1 overflow-auto bg-card">
            <div key={run} className="m-auto flex w-full max-w-5xl min-w-0 justify-center p-4 sm:p-10 [&>*]:max-w-full [&>*]:min-w-0">
              <Example />
            </div>
          </ThemeScope>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Top bar shared by the full-screen view and the standalone preview page. */
export function PreviewBar({ name, onReplay, children }: { name: string; onReplay: () => void; children?: React.ReactNode }) {
  const title = name.replace(/-demo$/, "").replace(/-/g, " ");
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-3 sm:px-4">
      <DialogTitleOrHeading className="truncate text-sm font-medium capitalize">{title}</DialogTitleOrHeading>
      <div className="ms-auto flex items-center gap-1">
        <PreviewThemePicker />
        <Button variant="ghost" size="icon-sm" onClick={onReplay} aria-label="Replay example" title="Replay">
          <RotateCcwIcon />
        </Button>
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/preview/$name" params={{ name }} target="_blank" aria-label="Open in a new tab" title="Open in a new tab">
            <ExternalLinkIcon />
          </Link>
        </Button>
        {children}
      </div>
    </div>
  );
}

/** Inside the dialog the bar's title names the dialog; on the standalone page it is a plain heading. */
const InDialog = React.createContext(true);
export const StandalonePreview = ({ children }: { children: React.ReactNode }) => <InDialog.Provider value={false}>{children}</InDialog.Provider>;
function DialogTitleOrHeading({ className, children }: { className?: string; children: React.ReactNode }) {
  return React.useContext(InDialog) ? <DialogPrimitive.Title className={className}>{children}</DialogPrimitive.Title> : <h1 className={className}>{children}</h1>;
}

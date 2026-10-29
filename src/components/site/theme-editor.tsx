import { themeCss, useSiteTheme } from "@/lib/site-theme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";
import { CodeBlock } from "./code-block";
import { ThemeControls } from "./theme-controls";
import { AgentPreview, ComponentsPreview, TypePreview } from "./theme-previews";

/** The full editor: controls bound to the live site theme, a component preview, and the CSS to copy. */
export function ThemeEditor() {
  const theme = useSiteTheme();
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[19rem_1fr]">
        <div className="h-fit rounded-2xl border border-border bg-card p-5 shadow-control lg:sticky lg:top-20">
          <ThemeControls />
          <p className="mt-5 text-xs text-muted-foreground">Changes apply to this whole site and are saved in your browser. Use the palette button in the header to tweak from any page.</p>
        </div>
        <Tabs defaultValue="components" className="min-w-0">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="agent">Agent chat</TabsTrigger>
            <TabsTrigger value="type">Typography</TabsTrigger>
          </TabsList>
          <TabsContent value="agent">
            <AgentPreview />
          </TabsContent>
          <TabsContent value="type">
            <TypePreview />
          </TabsContent>
          <TabsContent value="components">
            <ComponentsPreview />
          </TabsContent>
        </Tabs>
      </div>
      <CodeBlock code={themeCss(theme)} title="globals.css: paste after the Cuelark theme" />
    </div>
  );
}

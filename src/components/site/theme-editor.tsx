
import { Badge } from "@/registry/cuelark/ui/badge";
import { Button } from "@/registry/cuelark/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardLabel, CardTitle } from "@/registry/cuelark/ui/card";
import { Checkbox } from "@/registry/cuelark/ui/checkbox";
import { Input } from "@/registry/cuelark/ui/input";
import { Label } from "@/registry/cuelark/ui/label";
import { Progress } from "@/registry/cuelark/ui/progress";
import { Spinner } from "@/registry/cuelark/ui/spinner";
import { Switch } from "@/registry/cuelark/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";
import { CodeBlock } from "./code-block";

import { SearchIcon } from "lucide-react";
import { themeCss, useSiteTheme } from "@/lib/site-theme";
import { ThemeControls } from "./theme-controls";
import { AgentPreview, TypePreview } from "./theme-previews";

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
        <div className="cue-marks relative rounded-2xl border border-border bg-background p-5 sm:p-8">
          <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 rounded-[inherit] opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="relative grid gap-5 xl:grid-cols-2">
            <Card variant="raised" marks>
              <CardHeader>
                <CardLabel>Workspace · 02</CardLabel>
                <CardTitle>Invite your team</CardTitle>
                <CardDescription>Teammates get access to every project.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="preview-email">Email</Label>
                  <Input id="preview-email" placeholder="ada@example.com" leading={<SearchIcon />} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox defaultChecked /> Send a welcome email
                </label>
              </CardContent>
              <CardFooter divided className="justify-end">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button size="sm" kbd="↵">
                  Invite
                </Button>
              </CardFooter>
            </Card>
            <div className="grid content-start gap-5">
              <Tabs defaultValue="usage">
                <TabsList className="w-full">
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                <TabsContent value="usage" className="grid gap-3 pt-1">
                  <div className="flex items-center justify-between text-sm">
                    Storage <span className="font-mono text-muted-foreground">64%</span>
                  </div>
                  <Progress value={64} segments={10} size="lg" aria-label="Storage" />
                </TabsContent>
                <TabsContent value="billing" className="text-sm text-muted-foreground">
                  Next invoice on Nov 1.
                </TabsContent>
                <TabsContent value="team" className="text-sm text-muted-foreground">
                  6 members, 2 pending.
                </TabsContent>
              </Tabs>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" dot="pulse">
                  Live
                </Badge>
                <Badge variant="success" dot>
                  Healthy
                </Badge>
                <Badge mono size="sm">
                  v1.0
                </Badge>
              </div>
              <label className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm shadow-control">
                Weekly digest
                <Switch defaultChecked />
              </label>
              <div className="flex items-center gap-3">
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Spinner className="text-primary" />
              </div>
            </div>
          </div>
        </div>
          </TabsContent>
        </Tabs>
      </div>
      <CodeBlock code={themeCss(theme)} title="globals.css: paste after the Cuelark theme" />
    </div>
  );
}

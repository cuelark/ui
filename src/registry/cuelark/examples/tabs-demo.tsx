import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList className="w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        A snapshot of this week: 12 releases, 3 open incidents, 98.9% uptime.
      </TabsContent>
      <TabsContent value="analytics" className="text-sm text-muted-foreground">
        Traffic is up 18% week over week, led by organic search.
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        Manage members, billing and integrations for this workspace.
      </TabsContent>
    </Tabs>
  );
}

import { registryUrl } from "@/content/site";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";
import { CodeBlock } from "./code-block";

const RUNNERS = {
  pnpm: "pnpm dlx shadcn@latest add",
  npm: "npx shadcn@latest add",
  yarn: "yarn dlx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
} as const;

/** The shadcn CLI command for an item, per package manager. */
export function InstallTabs({ items }: { items: string[] }) {
  const targets = items.map(registryUrl).join(" ");
  return (
    <Tabs defaultValue="pnpm" className="gap-2">
      <TabsList variant="underline">
        {Object.keys(RUNNERS).map((pm) => (
          <TabsTrigger key={pm} value={pm} className="font-mono text-xs">
            {pm}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(RUNNERS).map(([pm, cmd]) => (
        <TabsContent key={pm} value={pm}>
          <CodeBlock code={`${cmd} ${targets}`} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
